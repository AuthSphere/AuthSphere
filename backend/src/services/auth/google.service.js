import axios from "axios";
import { conf } from "../../configs/env.js";
import { AppError } from "../../utils/AppError.js";
import redisService from "../core/redis.service.js";
import logger from "../../utils/logger.js";

/**
 * Returns Google OAuth 2.0 authorization URL
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
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token and fetches user info
 */
export async function getGoogleUser(code) {
  if (!code) throw new AppError("No code provided from Google callback", 400);

  // Atomic Deduplication Guard
  const codeKey = `oauth:google:code:${code.substring(0, 32)}`;
  try {
    const client = redisService.client;
    if (client) {
      const claimed = await client.set(codeKey, "1", "EX", 120, "NX");
      if (claimed === null) {
        throw new AppError("DUPLICATE_CALLBACK", 409);
      }
    }
  } catch (guardErr) {
    if (guardErr.message === "DUPLICATE_CALLBACK") throw guardErr;
    logger.warn(
      "[Google OAuth] Dedup guard skipped (Redis unavailable):",
      guardErr.message,
    );
  }

  // Exchange authorization code for access token
  const params = new URLSearchParams({
    client_id: conf.GOOGLE_CLIENT_ID,
    client_secret: conf.GOOGLE_CLIENT_SECRET,
    code,
    redirect_uri: conf.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  let tokenData;
  try {
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );
    tokenData = tokenRes.data;
  } catch (err) {
    logger.error(
      "[Google OAuth] Token exchange failed:",
      err.response?.data || err.message,
    );
    throw new AppError(
      err.response?.data?.error === "invalid_grant"
        ? "INVALID_GRANT"
        : "TOKEN_EXCHANGE_FAILED",
      502,
    );
  }

  if (!tokenData.access_token) {
    throw new AppError("TOKEN_EXCHANGE_FAILED", 502);
  }

  // Fetch user profile via OIDC userinfo endpoint
  let userData;
  try {
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } },
    );
    userData = userRes.data;
  } catch (err) {
    logger.error(
      "[Google OAuth] Userinfo fetch failed:",
      err.response?.data || err.message,
    );
    throw new AppError("USERINFO_FETCH_FAILED", 502);
  }

  if (!userData?.sub || !userData?.email) {
    throw new AppError("USERINFO_INVALID", 502);
  }

  return userData;
}
