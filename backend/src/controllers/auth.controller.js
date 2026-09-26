import {
  getGoogleAuthURL,
  getGoogleUser,
} from "../services/auth/google.service.js";
import {
  getGithubAuthURL,
  getGithubUser,
} from "../services/auth/github.service.js";
import {
  getDiscordAuthURL,
  getDiscordUser,
} from "../services/auth/discord.service.js";
import {
  getLinkedinAuthURL,
  getLinkedinUser,
} from "../services/auth/linkedin.service.js";
import {
  getGitlabAuthURL,
  getGitlabUser,
} from "../services/auth/gitlab.service.js";
import {
  getTwitchAuthURL,
  getTwitchUser,
} from "../services/auth/twitch.service.js";
import {
  getBitbucketAuthURL,
  getBitbucketUser,
} from "../services/auth/bitbucket.service.js";
import {
  getMicrosoftAuthURL,
  getMicrosoftUser,
} from "../services/auth/microsoft.service.js";
import authService from "../services/auth/auth.service.js";
import { handleSDKCallback } from "./sdk.controller.js";
import sdkService from "../services/auth/sdk.service.js";
import { conf } from "../configs/env.js";
import redisService from "../services/core/redis.service.js";
import crypto from "crypto";

/* ============================================================
   SOCIAL AUTH HANDLER (TRANSPORT LAYER)
 ============================================================ */
const processSocialAuth = async (res, req, userData, context = {}) => {
  try {
    const result = await authService.handleSocialAuth(req, userData, context);

    // SDK Flow callback
    if (result.endUser) {
      req.query.sdk_request = result.sdkRequestId;
      return await handleSDKCallback(
        req,
        res,
        result.endUser,
        result.provider,
        result.sdkRequestId,
      );
    }

    // Developer Login (Cookies & Redirects)
    const { developer, accessToken, refreshToken, cli } = result;

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    if (cli === "true" || cli === true) {
      try {
        await fetch(
          `${conf.cliUrl}/cli-update?name=${developer.username}&email=${developer.email}&id=${developer._id}&provider=${userData.provider}`,
        );
        return res.send("<script>window.close();</script>");
      } catch (error) {
        console.error("CLI callback failed:", error);
        return res.send("<script>window.close();</script>");
      }
    }

    return res.redirect(`${conf.frontendUrl}/dashboard`);
  } catch (err) {
    console.error("Social Auth Process Error:", err);
    return res.status(500).send(err.message || "Authentication failed");
  }
};

const getContextFromReq = (req) => {
  if (req.query.sdk === "true")
    return { type: "sdk", sdk_request: req.query.sdk_request };
  if (req.query.cli === "true") return { type: "cli" };
  return { type: "dev" };
};

/* ============================================================
   GOOGLE
 ============================================================ */
export async function googleLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    res.redirect(getGoogleAuthURL(context));
  } catch (_err) {
    res.status(500).send("Could not start Google login");
  }
}

export async function googleCallback(req, res) {
  const { code, state } = req.query;

  // ── Guard: missing code ──────────────────────────────────────────────
  if (!code) {
    return res.redirect(`${conf.frontendUrl}/auth/callback?error=missing_code`);
  }

  // Parse context from state BEFORE the try block so we can use it in catch
  let context = { cli: false, sdkRequest: null };
  if (state === "cli") context.cli = true;
  if (state?.startsWith("sdk:")) context.sdkRequest = state.split(":")[1];

  // Pre-resolve the developer's redirectUri so errors go to the RIGHT place.
  // For SDK flows the error must redirect to developer's app, not AuthSphere.
  let sdkErrorBase = null;
  if (context.sdkRequest) {
    try {
      const authReq = await sdkService.getAuthRequest(context.sdkRequest);
      if (authReq?.redirectUri) {
        const u = new URL(authReq.redirectUri);
        sdkErrorBase = u.origin + u.pathname; // strip existing query params
      }
    } catch (_e) {
      /* fall back to AuthSphere */
    }
  }

  /** Route errors to the correct destination (developer app vs AuthSphere) */
  const redirectError = (errorCode) => {
    if (sdkErrorBase) {
      return res.redirect(`${sdkErrorBase}?error=${errorCode}`);
    }
    return res.redirect(`${conf.frontendUrl}/login?error=${errorCode}`);
  };

  try {
    console.log("[OAuth Callback] A: Before getGoogleUser");

    // Exchange code → google user (dedup guard lives inside getGoogleUser)
    const googleUser = await getGoogleUser(code);

    console.log("[OAuth Callback] B: getGoogleUser completed", { email: googleUser?.email });

    console.log("[OAuth Callback] C: Before database operation (handleSocialAuth)");

    // Run social auth logic (creates/finds user, generates tokens)
    const result = await authService.handleSocialAuth(
      req,
      {
        email: googleUser.email,
        username: googleUser.name,
        picture: googleUser.picture,
        provider: "Google",
        providerId: googleUser.sub,
      },
      context,
    );

    console.log("[OAuth Callback] D: Database operation completed");

    // ── SDK Flow ────────────────────────────────────────────────────
    if (result.endUser) {
      req.query.sdk_request = result.sdkRequestId;
      return await handleSDKCallback(
        req,
        res,
        result.endUser,
        result.provider,
        result.sdkRequestId,
      );
    }

    // ── CLI Flow ────────────────────────────────────────────────────
    const { developer, accessToken, refreshToken, cli } = result;

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    if (cli === "true" || cli === true) {
      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);
      try {
        await fetch(
          `${conf.cliUrl}/cli-update?name=${developer.username}&email=${developer.email}&id=${developer._id}&provider=Google`,
        );
      } catch (cliErr) {
        console.error("[Google OAuth] CLI callback failed:", cliErr.message);
      }
      return res.send("<script>window.close();</script>");
    }

    console.log("[OAuth Callback] E: Before creating response (bridge token + redirect)");

    // ── Standard Developer Flow: Bridge Token Pattern ───────────────────
    // Instead of setting cookies here and redirecting, we:
    // 1. Set the cookies immediately (they travel with the redirect)
    // 2. Also store a short-lived bridge token in Redis so the frontend
    //    can verify the session was established (useful for SPAs)
    // 3. Redirect immediately — the callback URL NEVER stays in the browser
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Generate a short-lived bridge token for the frontend to optionally verify
    const bridgeToken = crypto.randomBytes(32).toString("hex");
    try {
      await redisService.client?.set(
        `oauth:bridge:${bridgeToken}`,
        JSON.stringify({ userId: developer._id, provider: "Google" }),
        "EX",
        60, // 60 second claim window
      );
    } catch (_e) {
      // Non-fatal: cookies are already set; bridge token is supplementary
    }

    console.log("[OAuth Callback] F: Response ready — redirecting to frontend");

    // Immediately redirect — callback URL must never linger in the browser
    return res.redirect(
      `${conf.frontendUrl}/auth/callback?token=${bridgeToken}`,
    );
  } catch (err) {
    console.error("[Google OAuth] Callback error:", err.message);

    switch (err.message) {
      case "DUPLICATE_CALLBACK":
        // A concurrent request already handled this — close silently
        return res.status(200).send("<script>window.close();</script>");

      case "INVALID_GRANT":
        return redirectError("session_expired");

      case "USERINFO_FETCH_FAILED":
      case "USERINFO_INVALID":
      case "TOKEN_EXCHANGE_FAILED":
        return redirectError("google_auth_failed");

      case "Invalid or expired SDK request":
        return redirectError("session_expired");

      default:
        return redirectError("auth_failed");
    }
  }
}

/**
 * Frontend calls this after being redirected to /auth/callback?token=...
 * It validates the bridge token and returns the authenticated user info.
 * Cookies were already set during the callback redirect above.
 *
 * GET /auth/session/:token
 */
export async function exchangeSession(req, res) {
  const { token } = req.params;
  if (!token) return res.status(400).json({ error: "Missing session token" });

  try {
    const key = `oauth:bridge:${token}`;
    const raw = await redisService.client?.get(key);
    if (!raw) {
      return res
        .status(400)
        .json({ error: "Session token expired or invalid" });
    }

    // One-time use: delete the bridge token immediately
    await redisService.client?.del(key);

    const { userId, provider } = JSON.parse(raw);
    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      provider,
      userId,
    });
  } catch (err) {
    console.error("[Auth] Session exchange error:", err.message);
    return res.status(500).json({ error: "Failed to exchange session token" });
  }
}

/* ============================================================
   GITHUB
 ============================================================ */
export async function githubLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    res.redirect(getGithubAuthURL(context));
  } catch (_err) {
    res.status(500).send("Could not start GitHub login");
  }
}

export async function githubCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing authorization code");

    let context = { cli: false, sdkRequest: null };
    if (state === "cli") context.cli = true;
    if (state && state.startsWith("sdk:"))
      context.sdkRequest = state.split(":")[1];

    const githubUser = await getGithubUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: githubUser.email,
        username: githubUser.login,
        picture: githubUser.avatar,
        provider: "GitHub",
        providerId: String(githubUser.id),
      },
      context,
    );
  } catch (err) {
    console.error("GitHub Callback Error:", err);
    res.status(500).send("GitHub authentication failed");
  }
}

/* ============================================================
   DISCORD
 ============================================================ */
export async function discordLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    res.redirect(getDiscordAuthURL(context));
  } catch (err) {
    console.error("Discord Login Error:", err);
    res.status(500).send("Could not start Discord login");
  }
}

export async function discordCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing authorization code");

    let context = { cli: false, sdkRequest: null };
    if (state === "cli") context.cli = true;
    if (state && state.startsWith("sdk:"))
      context.sdkRequest = state.split(":")[1];

    const discordUser = await getDiscordUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: discordUser.email,
        username: discordUser.username,
        picture: discordUser.avatar,
        provider: "Discord",
        providerId: discordUser.id,
      },
      context,
    );
  } catch (err) {
    console.error("Discord Callback Error:", err);
    res.status(500).send("Discord authentication failed");
  }
}

/* ============================================================
   OTHER PROVIDERS (LINKEDIN, GITLAB, TWITCH, BITBUCKET, MICROSOFT)
 ============================================================ */
export async function linkedinLogin(req, res) {
  try {
    res.redirect(getLinkedinAuthURL(getContextFromReq(req)));
  } catch (err) {
    console.error("LinkedIn Login Error:", err);
    res.status(500).send("LinkedIn login failed");
  }
}

export async function linkedinCallback(req, res) {
  try {
    const { code, state } = req.query;
    const context = {
      cli: state === "cli",
      sdkRequest: state?.startsWith("sdk:") ? state.split(":")[1] : null,
    };
    const user = await getLinkedinUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: user.email,
        username: user.username,
        picture: user.picture,
        provider: "LinkedIn",
        providerId: user.sub,
      },
      context,
    );
  } catch (err) {
    console.error("LinkedIn Callback Error:", err);
    res.status(500).send("LinkedIn authentication failed");
  }
}

export async function gitlabLogin(req, res) {
  try {
    res.redirect(getGitlabAuthURL(getContextFromReq(req)));
  } catch (err) {
    console.error("GitLab Login Error:", err);
    res.status(500).send("GitLab login failed");
  }
}

export async function gitlabCallback(req, res) {
  try {
    const { code, state } = req.query;
    const context = {
      cli: state === "cli",
      sdkRequest: state?.startsWith("sdk:") ? state.split(":")[1] : null,
    };
    const user = await getGitlabUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: user.email,
        username: user.username,
        picture: user.picture,
        provider: "GitLab",
        providerId: user.sub,
      },
      context,
    );
  } catch (err) {
    console.error("GitLab Callback Error:", err);
    res.status(500).send("GitLab authentication failed");
  }
}

export async function twitchLogin(req, res) {
  try {
    res.redirect(getTwitchAuthURL(getContextFromReq(req)));
  } catch (err) {
    console.error("Twitch Login Error:", err);
    res.status(500).send("Twitch login failed");
  }
}

export async function twitchCallback(req, res) {
  try {
    const { code, state } = req.query;
    const context = {
      cli: state === "cli",
      sdkRequest: state?.startsWith("sdk:") ? state.split(":")[1] : null,
    };
    const user = await getTwitchUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: user.email,
        username: user.username,
        picture: user.picture,
        provider: "Twitch",
        providerId: user.sub,
      },
      context,
    );
  } catch (err) {
    console.error("Twitch Callback Error:", err);
    res.status(500).send("Twitch authentication failed");
  }
}

export async function bitbucketLogin(req, res) {
  try {
    res.redirect(getBitbucketAuthURL(getContextFromReq(req)));
  } catch (err) {
    console.error("Bitbucket Login Error:", err);
    res.status(500).send("Bitbucket login failed");
  }
}

export async function bitbucketCallback(req, res) {
  try {
    const { code, state } = req.query;
    const context = {
      cli: state === "cli",
      sdkRequest: state?.startsWith("sdk:") ? state.split(":")[1] : null,
    };
    const user = await getBitbucketUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: user.email,
        username: user.username,
        picture: user.picture,
        provider: "Bitbucket",
        providerId: user.sub,
      },
      context,
    );
  } catch (err) {
    console.error("Bitbucket Callback Error:", err);
    res.status(500).send("Bitbucket authentication failed");
  }
}

export async function microsoftLogin(req, res) {
  try {
    res.redirect(getMicrosoftAuthURL(getContextFromReq(req)));
  } catch (err) {
    console.error("Microsoft Login Error:", err);
    res.status(500).send("Microsoft login failed");
  }
}

export async function microsoftCallback(req, res) {
  try {
    const { code, state } = req.query;
    const context = {
      cli: state === "cli",
      sdkRequest: state?.startsWith("sdk:") ? state.split(":")[1] : null,
    };
    const user = await getMicrosoftUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: user.email,
        username: user.username,
        picture: user.picture,
        provider: "Microsoft",
        providerId: user.sub,
      },
      context,
    );
  } catch (err) {
    console.error("Microsoft Callback Error:", err);
    res.status(500).send("Microsoft authentication failed");
  }
}
