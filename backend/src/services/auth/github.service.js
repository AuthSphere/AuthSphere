import axios from "axios";
import { conf } from "../../configs/env.js";
import { AppError } from "../../utils/AppError.js";
import logger from "../../utils/logger.js";

/**
 * Returns GitHub OAuth authorization URL
 */
export function getGithubAuthURL(context = { type: "dev" }) {
  let state = "dev";
  if (context.type === "sdk" && context.sdk_request) {
    state = `sdk:${context.sdk_request}`;
  }
  if (context.type === "cli") state = "cli";

  const params = new URLSearchParams({
    client_id: conf.GITHUB_CLIENT_ID,
    redirect_uri: conf.GITHUB_REDIRECT_URI,
    scope: "read:user user:email",
    allow_signup: "true",
    state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/**
 * Exchange code for access token and get user info
 */
export async function getGithubUser(code) {
  if (!code) throw new AppError("No code provided from GitHub callback", 400);

  let tokenRes;
  try {
    tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: conf.GITHUB_CLIENT_ID,
        client_secret: conf.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: conf.GITHUB_REDIRECT_URI,
      },
      {
        headers: {
          Accept: "application/json",
        },
      },
    );
  } catch (err) {
    logger.error(
      "[GitHub OAuth] Token exchange failed:",
      err.response?.data || err.message,
    );
    throw new AppError("GitHub token exchange failed", 502);
  }

  const { access_token } = tokenRes.data;
  if (!access_token) {
    throw new AppError("GitHub token exchange failed", 502);
  }

  let userRes;
  try {
    userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
  } catch (err) {
    logger.error(
      "[GitHub OAuth] User fetch failed:",
      err.response?.data || err.message,
    );
    throw new AppError("GitHub user info fetch failed", 502);
  }

  let primaryEmail;
  try {
    const emailsRes = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    primaryEmail = emailsRes.data.find((e) => e.primary)?.email;
  } catch (err) {
    logger.warn(
      "[GitHub OAuth] Email fetch failed, continuing without email:",
      err.message,
    );
  }

  return {
    id: userRes.data.id,
    login: userRes.data.login,
    name: userRes.data.name,
    email: primaryEmail,
    avatar: userRes.data.avatar_url,
  };
}
