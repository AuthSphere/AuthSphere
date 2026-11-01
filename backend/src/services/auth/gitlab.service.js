import axios from "axios";
import { conf } from "../../configs/env.js";
import { AppError } from "../../utils/AppError.js";
import logger from "../../utils/logger.js";

/**
 * Returns GitLab OAuth 2.0 authorization URL
 */
export function getGitlabAuthURL(context = { type: "dev" }) {
  let state = "dev";
  if (context.type === "sdk" && context.sdk_request)
    state = `sdk:${context.sdk_request}`;
  if (context.type === "cli") state = "cli";

  const params = new URLSearchParams({
    client_id: conf.GITLAB_CLIENT_ID,
    redirect_uri: conf.GITLAB_REDIRECT_URI,
    response_type: "code",
    scope: "read_user openid email profile",
    state,
  });

  return `https://gitlab.com/oauth/authorize?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token and fetches user info
 */
export async function getGitlabUser(code) {
  if (!code) throw new AppError("No code provided from GitLab callback", 400);

  let tokenRes;
  try {
    tokenRes = await axios.post("https://gitlab.com/oauth/token", {
      client_id: conf.GITLAB_CLIENT_ID,
      client_secret: conf.GITLAB_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: conf.GITLAB_REDIRECT_URI,
    });
  } catch (err) {
    logger.error(
      "[GitLab OAuth] Token exchange failed:",
      err.response?.data || err.message,
    );
    throw new AppError("GitLab token exchange failed", 502);
  }

  const { access_token } = tokenRes.data;
  if (!access_token) {
    throw new AppError("GitLab token exchange failed", 502);
  }

  let userRes;
  try {
    userRes = await axios.get("https://gitlab.com/api/v4/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
  } catch (err) {
    logger.error(
      "[GitLab OAuth] Userinfo fetch failed:",
      err.response?.data || err.message,
    );
    throw new AppError("GitLab user info fetch failed", 502);
  }

  return {
    sub: String(userRes.data.id),
    email: userRes.data.email,
    name: userRes.data.name || userRes.data.username,
    picture: userRes.data.avatar_url,
    username: userRes.data.username,
  };
}
