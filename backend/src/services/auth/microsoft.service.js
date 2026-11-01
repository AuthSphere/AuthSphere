import axios from "axios";
import { conf } from "../../configs/env.js";
import { AppError } from "../../utils/AppError.js";
import logger from "../../utils/logger.js";

/**
 * Returns Microsoft (Azure AD) OAuth 2.0 authorization URL
 */
export function getMicrosoftAuthURL(context = { type: "dev" }) {
  let state = "dev";
  if (context.type === "sdk" && context.sdk_request)
    state = `sdk:${context.sdk_request}`;
  if (context.type === "cli") state = "cli";

  const params = new URLSearchParams({
    client_id: conf.MICROSOFT_CLIENT_ID,
    redirect_uri: conf.MICROSOFT_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email User.Read",
    response_mode: "query",
    state,
  });

  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token and fetches user info
 */
export async function getMicrosoftUser(code) {
  if (!code)
    throw new AppError("No code provided from Microsoft callback", 400);

  let tokenRes;
  try {
    tokenRes = await axios.post(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      new URLSearchParams({
        client_id: conf.MICROSOFT_CLIENT_ID,
        client_secret: conf.MICROSOFT_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: conf.MICROSOFT_REDIRECT_URI,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );
  } catch (err) {
    logger.error(
      "[Microsoft OAuth] Token exchange failed:",
      err.response?.data || err.message,
    );
    throw new AppError("Microsoft token exchange failed", 502);
  }

  const { access_token } = tokenRes.data;
  if (!access_token) {
    throw new AppError("Microsoft token exchange failed", 502);
  }

  let userRes;
  try {
    userRes = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
  } catch (err) {
    logger.error(
      "[Microsoft OAuth] Userinfo fetch failed:",
      err.response?.data || err.message,
    );
    throw new AppError("Microsoft user info fetch failed", 502);
  }

  return {
    sub: userRes.data.id,
    email: userRes.data.mail || userRes.data.userPrincipalName,
    name: userRes.data.displayName,
    picture: null,
    username: userRes.data.displayName?.split(" ")[0]?.toLowerCase(),
  };
}
