import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "MONGODB_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingVars.join(", ")}`,
  );
  // Do not call process.exit(1) in serverless; let the application handle missing vars or throw an error later.
}

const _conf = {
  port: String(process.env.PORT || 8000),
  baseUrl: String(process.env.BASE_URL || "http://localhost:8000"),
  mongodbUri: String(process.env.MONGODB_URI),
  corsOrigin: String(process.env.CORS_ORIGIN || "*").trim(),
  accessTokenSecret: String(process.env.ACCESS_TOKEN_SECRET).trim(),
  accessTokenExpiry: String(process.env.ACCESS_TOKEN_EXPIRY || "1d").trim(),
  refreshTokenSecret: String(process.env.REFRESH_TOKEN_SECRET).trim(),
  refreshTokenExpiry: String(process.env.REFRESH_TOKEN_EXPIRY || "10d").trim(),
  // URLs
  frontendUrl: String(
    process.env.FRONTEND_URL || "http://localhost:5173",
  ).trim(),
  cliUrl: String(process.env.CLI_URL || "http://localhost:5001").trim(),

  // Google
  GOOGLE_CLIENT_ID: String(process.env.GOOGLE_CLIENT_ID || "")
    .trim()
    .replace(/^["'](.+)["']$/, "$1"),
  GOOGLE_CLIENT_SECRET: String(process.env.GOOGLE_CLIENT_SECRET || "")
    .trim()
    .replace(/^["'](.+)["']$/, "$1"),
  GOOGLE_REDIRECT_URI: String(process.env.GOOGLE_REDIRECT_URI || "")
    .trim()
    .replace(/^["'](.+)["']$/, "$1"),

  // GitHub
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,

  // Discord
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,

  // LinkedIn
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
  LINKEDIN_REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI,

  // GitLab
  GITLAB_CLIENT_ID: process.env.GITLAB_CLIENT_ID,
  GITLAB_CLIENT_SECRET: process.env.GITLAB_CLIENT_SECRET,
  GITLAB_REDIRECT_URI: process.env.GITLAB_REDIRECT_URI,

  // Twitch
  TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
  TWITCH_REDIRECT_URI: process.env.TWITCH_REDIRECT_URI,

  // Bitbucket
  BITBUCKET_CLIENT_ID: process.env.BITBUCKET_CLIENT_ID,
  BITBUCKET_CLIENT_SECRET: process.env.BITBUCKET_CLIENT_SECRET,
  BITBUCKET_REDIRECT_URI: process.env.BITBUCKET_REDIRECT_URI,

  MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
  MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
  MICROSOFT_REDIRECT_URI: process.env.MICROSOFT_REDIRECT_URI,

  // SMTP Settings
  smtpHost: process.env.SMTP_HOST || "smtp.ethereal.email",
  smtpPort: process.env.SMTP_PORT || 587,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
};

export const conf = Object.freeze(_conf);
