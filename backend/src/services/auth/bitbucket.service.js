import axios from "axios";
import { conf } from "../../configs/env.js";
import { AppError } from "../../utils/AppError.js";
import logger from "../../utils/logger.js";

/**
 * Returns Bitbucket OAuth 2.0 authorization URL
 */
export function getBitbucketAuthURL(context = { type: "dev" }) {
  let state = "dev";
  if (context.type === "sdk" && context.sdk_request)
    state = `sdk:${context.sdk_request}`;
  if (context.type === "cli") state = "cli";

  const params = new URLSearchParams({
    client_id: conf.BITBUCKET_CLIENT_ID,
    redirect_uri: conf.BITBUCKET_REDIRECT_URI,
    response_type: "code",
    state,
  });

  return `https://bitbucket.org/site/oauth2/authorize?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token and fetches user info
 */
export async function getBitbucketUser(code) {
  if (!code)
    throw new AppError("No code provided from Bitbucket callback", 400);

  const auth = Buffer.from(
    `${conf.BITBUCKET_CLIENT_ID}:${conf.BITBUCKET_CLIENT_SECRET}`,
  ).toString("base64");

  let tokenRes;
  try {
    tokenRes = await axios.post(
      "https://bitbucket.org/site/oauth2/access_token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
      }),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
  } catch (err) {
    logger.error(
      "[Bitbucket OAuth] Token exchange failed:",
      err.response?.data || err.message,
    );
    throw new AppError("Bitbucket token exchange failed", 502);
  }

  const { access_token } = tokenRes.data;
  if (!access_token) {
    throw new AppError("Bitbucket token exchange failed", 502);
  }

  let userRes;
  try {
    userRes = await axios.get("https://api.bitbucket.org/2.0/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
  } catch (err) {
    logger.error(
      "[Bitbucket OAuth] User fetch failed:",
      err.response?.data || err.message,
    );
    throw new AppError("Bitbucket user info fetch failed", 502);
  }

  let primaryEmail;
  try {
    const emailRes = await axios.get(
      "https://api.bitbucket.org/2.0/user/emails",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );
    primaryEmail =
      emailRes.data.values.find((e) => e.is_primary)?.email ||
      emailRes.data.values[0]?.email;
  } catch (err) {
    logger.warn(
      "[Bitbucket OAuth] Email fetch failed, continuing without email:",
      err.message,
    );
  }

  return {
    sub: userRes.data.uuid,
    email: primaryEmail,
    name: userRes.data.display_name,
    picture: userRes.data.links?.avatar?.href,
    username: userRes.data.username,
  };
}
