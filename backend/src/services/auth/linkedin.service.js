import axios from "axios";
import { conf } from "../../configs/env.js";
import { AppError } from "../../utils/AppError.js";
import logger from "../../utils/logger.js";

/**
 * Returns LinkedIn OAuth 2.0 authorization URL
 */
export function getLinkedinAuthURL(context = { type: "dev" }) {
  let state = "dev";
  if (context.type === "sdk" && context.sdk_request)
    state = `sdk:${context.sdk_request}`;
  if (context.type === "cli") state = "cli";

  const params = new URLSearchParams({
    client_id: conf.LINKEDIN_CLIENT_ID,
    redirect_uri: conf.LINKEDIN_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
    state,
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token and fetches user info
 */
export async function getLinkedinUser(code) {
  if (!code) throw new AppError("No code provided from LinkedIn callback", 400);

  let tokenRes;
  try {
    tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: conf.LINKEDIN_CLIENT_ID,
        client_secret: conf.LINKEDIN_CLIENT_SECRET,
        redirect_uri: conf.LINKEDIN_REDIRECT_URI,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );
  } catch (err) {
    logger.error(
      "[LinkedIn OAuth] Token exchange failed:",
      err.response?.data || err.message,
    );
    throw new AppError("LinkedIn token exchange failed", 502);
  }

  const { access_token } = tokenRes.data;
  if (!access_token) {
    throw new AppError("LinkedIn token exchange failed", 502);
  }

  let userRes;
  try {
    userRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
  } catch (err) {
    logger.error(
      "[LinkedIn OAuth] Userinfo fetch failed:",
      err.response?.data || err.message,
    );
    throw new AppError("LinkedIn user info fetch failed", 502);
  }

  return {
    sub: userRes.data.sub,
    email: userRes.data.email,
    name: userRes.data.name,
    picture: userRes.data.picture,
    username: userRes.data.given_name || userRes.data.name?.split(" ")[0],
  };
}
