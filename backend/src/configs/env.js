import dotenv from "dotenv";

dotenv.config();

const getEnv = (key) => {
  if (
    typeof globalThis !== "undefined" &&
    globalThis.workerEnv &&
    globalThis.workerEnv[key] !== undefined
  ) {
    return globalThis.workerEnv[key];
  }
  return process.env[key];
};

const _conf = {
  get port() {
    return Number(getEnv("PORT") || 8000);
  },
  get baseUrl() {
    return String(getEnv("BASE_URL") || "http://localhost:8000");
  },
  get mongodbUri() {
    return String(getEnv("MONGODB_URI"));
  },
  get corsOrigin() {
    return String(getEnv("CORS_ORIGIN") || "*").trim();
  },
  get accessTokenSecret() {
    return String(getEnv("ACCESS_TOKEN_SECRET")).trim();
  },
  get accessTokenExpiry() {
    return String(getEnv("ACCESS_TOKEN_EXPIRY") || "1d").trim();
  },
  get refreshTokenSecret() {
    return String(getEnv("REFRESH_TOKEN_SECRET")).trim();
  },
  get refreshTokenExpiry() {
    return String(getEnv("REFRESH_TOKEN_EXPIRY") || "10d").trim();
  },
  // URLs
  get frontendUrl() {
    return String(getEnv("FRONTEND_URL") || "http://localhost:5173").trim();
  },
  get cliUrl() {
    return String(getEnv("CLI_URL") || "http://localhost:5001").trim();
  },

  // Google
  get GOOGLE_CLIENT_ID() {
    return String(getEnv("GOOGLE_CLIENT_ID") || "")
      .trim()
      .replace(/^["'](.+)["']$/, "$1");
  },
  get GOOGLE_CLIENT_SECRET() {
    return String(getEnv("GOOGLE_CLIENT_SECRET") || "")
      .trim()
      .replace(/^["'](.+)["']$/, "$1");
  },
  get GOOGLE_REDIRECT_URI() {
    return String(getEnv("GOOGLE_REDIRECT_URI") || "")
      .trim()
      .replace(/^["'](.+)["']$/, "$1");
  },

  // GitHub
  get GITHUB_CLIENT_ID() {
    return getEnv("GITHUB_CLIENT_ID");
  },
  get GITHUB_CLIENT_SECRET() {
    return getEnv("GITHUB_CLIENT_SECRET");
  },
  get GITHUB_REDIRECT_URI() {
    return getEnv("GITHUB_REDIRECT_URI");
  },

  // Discord
  get DISCORD_CLIENT_ID() {
    return getEnv("DISCORD_CLIENT_ID");
  },
  get DISCORD_CLIENT_SECRET() {
    return getEnv("DISCORD_CLIENT_SECRET");
  },
  get DISCORD_REDIRECT_URI() {
    return getEnv("DISCORD_REDIRECT_URI");
  },

  // LinkedIn
  get LINKEDIN_CLIENT_ID() {
    return getEnv("LINKEDIN_CLIENT_ID");
  },
  get LINKEDIN_CLIENT_SECRET() {
    return getEnv("LINKEDIN_CLIENT_SECRET");
  },
  get LINKEDIN_REDIRECT_URI() {
    return getEnv("LINKEDIN_REDIRECT_URI");
  },

  // GitLab
  get GITLAB_CLIENT_ID() {
    return getEnv("GITLAB_CLIENT_ID");
  },
  get GITLAB_CLIENT_SECRET() {
    return getEnv("GITLAB_CLIENT_SECRET");
  },
  get GITLAB_REDIRECT_URI() {
    return getEnv("GITLAB_REDIRECT_URI");
  },

  // Twitch
  get TWITCH_CLIENT_ID() {
    return getEnv("TWITCH_CLIENT_ID");
  },
  get TWITCH_CLIENT_SECRET() {
    return getEnv("TWITCH_CLIENT_SECRET");
  },
  get TWITCH_REDIRECT_URI() {
    return getEnv("TWITCH_REDIRECT_URI");
  },

  // Bitbucket
  get BITBUCKET_CLIENT_ID() {
    return getEnv("BITBUCKET_CLIENT_ID");
  },
  get BITBUCKET_CLIENT_SECRET() {
    return getEnv("BITBUCKET_CLIENT_SECRET");
  },
  get BITBUCKET_REDIRECT_URI() {
    return getEnv("BITBUCKET_REDIRECT_URI");
  },

  get MICROSOFT_CLIENT_ID() {
    return getEnv("MICROSOFT_CLIENT_ID");
  },
  get MICROSOFT_CLIENT_SECRET() {
    return getEnv("MICROSOFT_CLIENT_SECRET");
  },
  get MICROSOFT_REDIRECT_URI() {
    return getEnv("MICROSOFT_REDIRECT_URI");
  },

  // SMTP Settings
  get smtpHost() {
    return getEnv("SMTP_HOST") || "smtp.ethereal.email";
  },
  get smtpPort() {
    return getEnv("SMTP_PORT") || 587;
  },
  get smtpUser() {
    return getEnv("SMTP_USER");
  },
  get smtpPass() {
    return getEnv("SMTP_PASS");
  },
};

export const conf = Object.freeze(_conf);

// Helper to validate required env vars
export const validateEnv = () => {
  checkRequiredEnvVars();
};

export const checkRequiredEnvVars = () => {
  const requiredEnvVars = [
    "MONGODB_URI",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "JWT_SECRET",
    "FRONTEND_URL",
    "CLI_URL",
    "CORS_ORIGIN",
    // Add any other mandatory vars here
  ];
  const missingVars = requiredEnvVars.filter((key) => !getEnv(key));
  if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
  }
};
