import { conf } from "../../configs/env.js";
// import redisService from "../core/redis.service.js";

/**
 * Returns Google OAuth 2.0 authorization URL
 * @param {object} context
 * @param {"dev" | "sdk" | "cli"} context.type
 * @param {string} [context.sdk_request]
 */
export function getGoogleAuthURL(context = { type: "dev" }) {
  let state = "dev";

  if (context.type === "sdk" && context.sdk_request) {
    state = `sdk:${context.sdk_request}`;
  }

  if (context.type === "cli") {
    state = "cli";
  }

  const params = new URLSearchParams({
    client_id: conf.GOOGLE_CLIENT_ID,
    redirect_uri: conf.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state, // 🔥 REQUIRED
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token and fetches user info
 * @param {string} code - Authorization code from Google
 * @returns {Promise<object>} - Google user info (sub, email, name, picture)
 */
export async function getGoogleUser(code) {
  console.log("[Google OAuth] Step 1: getGoogleUser called, code present:", !!code);
  if (!code) throw new Error("No code provided from Google callback");

  // ── Atomic Deduplication Guard (NX = set-if-not-exists) ──────────────────
  // Google authorization codes are single-use. On Vercel (serverless),
  // the edge network can deliver the callback URL twice nearly simultaneously
  // (duplicate HTTP requests). We do an atomic SET NX to claim the code;
  // if it returns null, another instance already claimed it → abort.
  // const codeKey = `oauth:google:code:${code.substring(0, 32)}`;
  // try {
  //   const client = redisService.client;
  //   if (client) {
  //     const claimed = await client.set(codeKey, "1", "EX", 120, "NX");
  //     if (claimed === null) {
  //       console.warn(
  //         "[Google OAuth] Duplicate callback detected — code already claimed.",
  //       );
  //       throw new Error("DUPLICATE_CALLBACK");
  //     }
  //   }
  // } catch (guardErr) {
  //   if (guardErr.message === "DUPLICATE_CALLBACK") throw guardErr;
  //   // Redis unavailable: log and proceed (auth unblocked, but no dedup protection)
  //   console.warn(
  //     "[Google OAuth] Dedup guard skipped (Redis unavailable):",
  //     guardErr.message,
  //   );
  // }
  // ─────────────────────────────────────────────────────────────────────────

  // Only log credential debug info in non-production environments
  if (process.env.NODE_ENV !== "production") {
    console.log("[Google OAuth] Exchanging code:", {
      client_id: conf.GOOGLE_CLIENT_ID,
      redirect_uri: conf.GOOGLE_REDIRECT_URI,
      code_received: !!code,
    });
  }

  // Exchange authorization code for access token
  console.log("[Google OAuth] Step 2: Starting token exchange with Google...");
  const params = new URLSearchParams({
    client_id: conf.GOOGLE_CLIENT_ID,
    client_secret: conf.GOOGLE_CLIENT_SECRET,
    code,
    redirect_uri: conf.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  let tokenData;
  try {
    const tokenController = new AbortController();
    const tokenTimeout = setTimeout(() => tokenController.abort(), 10_000);

    console.log("[Google OAuth] Step 3: Sending POST to oauth2.googleapis.com/token...");
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      cache: "no-store",
      signal: tokenController.signal,
    }).finally(() => clearTimeout(tokenTimeout));

    console.log("[Google OAuth] Step 4: Token response received, status:", tokenRes.status);
    const data = await tokenRes.json();
    if (!tokenRes.ok) {
      throw { response: { data } };
    }
    tokenData = data;
    console.log("[Google OAuth] Step 5: Token exchange successful, access_token present:", !!tokenData.access_token);
  } catch (err) {
    const googleError = err.response?.data?.error;
    console.error(
      "[Google OAuth] Token exchange failed:",
      err.response?.data || err.message,
    );
    throw new Error(
      googleError === "invalid_grant"
        ? "INVALID_GRANT"
        : "TOKEN_EXCHANGE_FAILED",
    );
  }

  if (!tokenData.access_token) {
    console.error("[Google OAuth] No access_token in response:", tokenData);
    throw new Error("TOKEN_EXCHANGE_FAILED");
  }

  // Fetch user profile via OIDC userinfo endpoint
  console.log("[Google OAuth] Step 6: Starting userinfo fetch...");
  let userData;
  try {
    const userController = new AbortController();
    const userTimeout = setTimeout(() => userController.abort(), 10_000);

    console.log("[Google OAuth] Step 7: Sending GET to googleapis.com/oauth2/v3/userinfo...");
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
        cache: "no-store",
        signal: userController.signal,
      },
    ).finally(() => clearTimeout(userTimeout));

    console.log("[Google OAuth] Step 8: Userinfo response received, status:", userRes.status);
    const data = await userRes.json();
    if (!userRes.ok) {
      throw { response: { data } };
    }
    userData = data;
    console.log("[Google OAuth] Step 9: Userinfo fetched, email:", userData?.email);
  } catch (err) {
    console.error(
      "[Google OAuth] Userinfo fetch failed:",
      err.response?.data || err.message,
    );
    throw new Error("USERINFO_FETCH_FAILED");
  }

  if (!userData?.sub || !userData?.email) {
    console.error(
      "[Google OAuth] Invalid user data (missing sub/email):",
      userData,
    );
    throw new Error("USERINFO_INVALID");
  }

  console.log("[Google OAuth] Step 10: All done, returning user:", { sub: userData.sub, email: userData.email });
  return userData; // { sub, email, name, picture, ... }
}
