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
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";
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
        const params = new URLSearchParams({
          name: developer.username,
          email: developer.email,
          id: String(developer._id),
          provider: userData.provider,
        });
        await fetch(`${conf.cliUrl}/cli-update?${params.toString()}`);
        return res.send("<script>window.close();</script>");
      } catch (error) {
        logger.error("[Social Auth] CLI callback failed:", error.message);
        return res.send("<script>window.close();</script>");
      }
    }

    return res.redirect(`${conf.frontendUrl}/dashboard`);
  } catch (err) {
    logger.error("[Social Auth] Process error:", err.message);
    if (res.headersSent) return;
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
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
  } catch (err) {
    logger.error("[Google Login] Error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Could not start Google login" });
  }
}

export async function googleCallback(req, res) {
  const { code, state } = req.query;

  if (!code) {
    return res.redirect(`${conf.frontendUrl}/auth/callback?error=missing_code`);
  }

  let context = { cli: false, sdkRequest: null };
  if (state === "cli") context.cli = true;
  if (state?.startsWith("sdk:")) context.sdkRequest = state.split(":")[1];

  let sdkErrorBase = null;
  if (context.sdkRequest) {
    try {
      const authReq = await sdkService.getAuthRequest(context.sdkRequest);
      if (authReq?.redirectUri) {
        const u = new URL(authReq.redirectUri);
        sdkErrorBase = u.origin + u.pathname;
      }
    } catch (_e) {
      /* fall back to AuthSphere */
    }
  }

  const redirectError = (errorCode) => {
    if (sdkErrorBase) {
      return res.redirect(`${sdkErrorBase}?error=${errorCode}`);
    }
    return res.redirect(`${conf.frontendUrl}/login?error=${errorCode}`);
  };

  try {
    const googleUser = await getGoogleUser(code);

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
        const params = new URLSearchParams({
          name: developer.username,
          email: developer.email,
          id: String(developer._id),
          provider: "Google",
        });
        await fetch(`${conf.cliUrl}/cli-update?${params.toString()}`);
      } catch (cliErr) {
        logger.error("[Google OAuth] CLI callback failed:", cliErr.message);
      }
      return res.send("<script>window.close();</script>");
    }

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    const bridgeToken = crypto.randomBytes(32).toString("hex");
    try {
      await redisService.client?.set(
        `oauth:bridge:${bridgeToken}`,
        JSON.stringify({ userId: developer._id, provider: "Google" }),
        "EX",
        60,
      );
    } catch (_e) {
      // Non-fatal: cookies are already set; bridge token is supplementary
    }

    return res.redirect(
      `${conf.frontendUrl}/auth/callback?token=${bridgeToken}`,
    );
  } catch (err) {
    logger.error("[Google OAuth] Callback error:", err.message);

    if (err instanceof AppError) {
      switch (err.message) {
        case "DUPLICATE_CALLBACK":
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

    return redirectError("auth_failed");
  }
}

/**
 * Frontend calls this after being redirected to /auth/callback?token=...
 */
export async function exchangeSession(req, res) {
  const { token } = req.params;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Missing session token" });
  }

  try {
    const key = `oauth:bridge:${token}`;
    const raw = await redisService.client?.get(key);
    if (!raw) {
      return res.status(400).json({
        success: false,
        message: "Session token expired or invalid",
      });
    }

    await redisService.client?.del(key);

    const { userId, provider } = JSON.parse(raw);
    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      provider,
      userId,
    });
  } catch (err) {
    logger.error("[Auth] Session exchange error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to exchange session token",
    });
  }
}

/* ============================================================
   GITHUB
   ============================================================ */
export async function githubLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    res.redirect(getGithubAuthURL(context));
  } catch (err) {
    logger.error("[GitHub Login] Error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Could not start GitHub login" });
  }
}

export async function githubCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Missing authorization code" });
    }

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
    logger.error("[GitHub Callback] Error:", err.message);
    if (res.headersSent) return;
    res
      .status(500)
      .json({ success: false, message: "GitHub authentication failed" });
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
    logger.error("[Discord Login] Error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Could not start Discord login" });
  }
}

export async function discordCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Missing authorization code" });
    }

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
    logger.error("[Discord Callback] Error:", err.message);
    if (res.headersSent) return;
    res
      .status(500)
      .json({ success: false, message: "Discord authentication failed" });
  }
}

/* ============================================================
   OTHER PROVIDERS (LINKEDIN, GITLAB, TWITCH, BITBUCKET, MICROSOFT)
   ============================================================ */
export async function linkedinLogin(req, res) {
  try {
    res.redirect(getLinkedinAuthURL(getContextFromReq(req)));
  } catch (err) {
    logger.error("[LinkedIn Login] Error:", err.message);
    res.status(500).json({ success: false, message: "LinkedIn login failed" });
  }
}

export async function linkedinCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Missing authorization code" });
    }
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
    logger.error("[LinkedIn Callback] Error:", err.message);
    if (res.headersSent) return;
    res
      .status(500)
      .json({ success: false, message: "LinkedIn authentication failed" });
  }
}

export async function gitlabLogin(req, res) {
  try {
    res.redirect(getGitlabAuthURL(getContextFromReq(req)));
  } catch (err) {
    logger.error("[GitLab Login] Error:", err.message);
    res.status(500).json({ success: false, message: "GitLab login failed" });
  }
}

export async function gitlabCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Missing authorization code" });
    }
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
    logger.error("[GitLab Callback] Error:", err.message);
    if (res.headersSent) return;
    res
      .status(500)
      .json({ success: false, message: "GitLab authentication failed" });
  }
}

export async function twitchLogin(req, res) {
  try {
    res.redirect(getTwitchAuthURL(getContextFromReq(req)));
  } catch (err) {
    logger.error("[Twitch Login] Error:", err.message);
    res.status(500).json({ success: false, message: "Twitch login failed" });
  }
}

export async function twitchCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Missing authorization code" });
    }
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
    logger.error("[Twitch Callback] Error:", err.message);
    if (res.headersSent) return;
    res
      .status(500)
      .json({ success: false, message: "Twitch authentication failed" });
  }
}

export async function bitbucketLogin(req, res) {
  try {
    res.redirect(getBitbucketAuthURL(getContextFromReq(req)));
  } catch (err) {
    logger.error("[Bitbucket Login] Error:", err.message);
    res.status(500).json({ success: false, message: "Bitbucket login failed" });
  }
}

export async function bitbucketCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Missing authorization code" });
    }
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
    logger.error("[Bitbucket Callback] Error:", err.message);
    if (res.headersSent) return;
    res
      .status(500)
      .json({ success: false, message: "Bitbucket authentication failed" });
  }
}

export async function microsoftLogin(req, res) {
  try {
    res.redirect(getMicrosoftAuthURL(getContextFromReq(req)));
  } catch (err) {
    logger.error("[Microsoft Login] Error:", err.message);
    res.status(500).json({ success: false, message: "Microsoft login failed" });
  }
}

export async function microsoftCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Missing authorization code" });
    }
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
    logger.error("[Microsoft Callback] Error:", err.message);
    if (res.headersSent) return;
    res
      .status(500)
      .json({ success: false, message: "Microsoft authentication failed" });
  }
}
