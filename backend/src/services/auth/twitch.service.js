import axios from "axios";
import { conf } from "../../configs/env.js";
import { AppError } from "../../utils/AppError.js";
import logger from "../../utils/logger.js";

/**
 * Returns Twitch OAuth 2.0 authorization URL
 */
export function getTwitchAuthURL(context = { type: "dev" }) {
  let state = "dev";
  if (context.type === "sdk" && context.sdk_request)
    state = `sdk:${context.sdk_request}`;
  if (context.type === "cli") state = "cli";

  const params = new URLSearchParams({
    client_id: conf.TWITCH_CLIENT_ID,
    redirect_uri: conf.TWITCH_REDIRECT_URI,
    response_type: "code",
    scope: "user:read:email openid",
    state,
  });

  return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token and fetches user info
 */
export async function getTwitchUser(code) {
  if (!code) throw new AppError("No code provided from Twitch callback", 400);

  let tokenRes;
  try {
    tokenRes = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      new URLSearchParams({
        client_id: conf.TWITCH_CLIENT_ID,
        client_secret: conf.TWITCH_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: conf.TWITCH_REDIRECT_URI,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );
  } catch (err) {
    logger.error(
      "[Twitch OAuth] Token exchange failed:",
      err.response?.data || err.message,
    );
    throw new AppError("Twitch token exchange failed", 502);
  }

  const { access_token } = tokenRes.data;
  if (!access_token) {
    throw new AppError("Twitch token exchange failed", 502);
  }

  let userRes;
  try {
    userRes = await axios.get("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Client-Id": conf.TWITCH_CLIENT_ID,
      },
    });
  } catch (err) {
    logger.error(
      "[Twitch OAuth] Userinfo fetch failed:",
      err.response?.data || err.message,
    );
    throw new AppError("Twitch user info fetch failed", 502);
  }

  const userData = userRes.data.data?.[0];
  if (!userData) {
    throw new AppError("Twitch user data not found", 502);
  }

  return {
    sub: userData.id,
    email: userData.email,
    name: userData.display_name,
    picture: userData.profile_image_url,
    username: userData.login,
  };
}
