#!/usr/bin/env node

import dotenv from "dotenv";
import mongoose from "mongoose";
import chalk from "chalk";

dotenv.config();

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function pass(message) {
  console.log(chalk.green("✓"), message);
  checks.passed++;
}

function fail(message) {
  console.log(chalk.red("✖"), message);
  checks.failed++;
}

function warn(message) {
  console.log(chalk.yellow("⚠"), message);
  checks.warnings++;
}

function section(title) {
  console.log("\n" + chalk.blue.bold(`━━━ ${title} ━━━`));
}

async function diagnose() {
  console.log(chalk.bold("\n🔍 AuthSphere System Diagnostic\n"));

  // ===== ENVIRONMENT VARIABLES =====
  section("Environment Variables");

  const requiredEnvVars = [
    "MONGODB_URI",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "CORS_ORIGIN",
  ];

  const optionalEnvVars = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "DISCORD_CLIENT_ID",
    "DISCORD_CLIENT_SECRET",
  ];

  requiredEnvVars.forEach((key) => {
    if (process.env[key]) {
      pass(`${key} is set`);
    } else {
      fail(`${key} is missing`);
    }
  });

  let hasAtLeastOneProvider = false;
  optionalEnvVars.forEach((key) => {
    if (process.env[key]) {
      pass(`${key} is set`);
      if (key.includes("CLIENT_ID")) hasAtLeastOneProvider = true;
    } else {
      warn(`${key} is not set (optional)`);
    }
  });

  if (!hasAtLeastOneProvider) {
    fail("No OAuth providers configured");
  } else {
    pass("At least one OAuth provider configured");
  }

  // ===== SECRET STRENGTH =====
  section("Security");

  if (
    process.env.ACCESS_TOKEN_SECRET &&
    process.env.ACCESS_TOKEN_SECRET.length >= 32
  ) {
    pass("ACCESS_TOKEN_SECRET is strong (32+ chars)");
  } else {
    fail("ACCESS_TOKEN_SECRET is too weak (should be 32+ chars)");
  }

  if (
    process.env.REFRESH_TOKEN_SECRET &&
    process.env.REFRESH_TOKEN_SECRET.length >= 32
  ) {
    pass("REFRESH_TOKEN_SECRET is strong (32+ chars)");
  } else {
    fail("REFRESH_TOKEN_SECRET is too weak (should be 32+ chars)");
  }

  if (process.env.NODE_ENV === "production") {
    if (process.env.CORS_ORIGIN !== "*") {
      pass("CORS is properly restricted");
    } else {
      fail("CORS allows all origins (security risk)");
    }
  }

  // ===== DATABASE CONNECTION =====
  section("Database");

  if (process.env.MONGODB_URI) {
    try {
      console.log("⏳ Connecting to MongoDB...");
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      pass("MongoDB connection successful");
      pass(`Connected to: ${mongoose.connection.host}`);
      pass(`Database: ${mongoose.connection.name}`);
      await mongoose.connection.close();
    } catch (error) {
      fail(`MongoDB connection failed: ${error.message}`);
    }
  } else {
    fail("MONGODB_URI not set");
  }

  // ===== PORT AVAILABILITY =====
  section("Network");

  const port = process.env.PORT || 8000;
  pass(`Server will use port: ${port}`);

  if (process.env.CORS_ORIGIN) {
    const corsUrl = process.env.CORS_ORIGIN;
    if (corsUrl.startsWith("http://") || corsUrl.startsWith("https://")) {
      pass(`CORS configured: ${corsUrl}`);
    } else {
      fail(`CORS_ORIGIN should start with http:// or https://`);
    }
  }

  // ===== OAUTH REDIRECT URIS =====
  section("OAuth Configuration");

  const providers = ["GOOGLE", "GITHUB", "DISCORD"];
  providers.forEach((provider) => {
    const clientId = process.env[`${provider}_CLIENT_ID`];
    const redirectUri = process.env[`${provider}_REDIRECT_URI`];

    if (clientId) {
      if (redirectUri) {
        const expectedRedirect = `http://localhost:${port}/auth/${provider.toLowerCase()}/callback`;
        if (redirectUri === expectedRedirect) {
          pass(`${provider} redirect URI matches expected format`);
        } else {
          warn(`${provider} redirect URI: ${redirectUri}`);
          console.log(chalk.gray(`  Expected: ${expectedRedirect}`));
        }
      } else {
        fail(`${provider}_REDIRECT_URI not set`);
      }
    }
  });

  // ===== DEPENDENCIES =====
  section("Dependencies");

  const requiredDeps = [
    "express",
    "mongoose",
    "jsonwebtoken",
    "bcryptjs",
    "cors",
    "cookie-parser",
    "dotenv",
  ];

  let missingDeps = [];
  for (const dep of requiredDeps) {
    try {
      await import(dep);
      pass(`${dep} is installed`);
    } catch {
      fail(`${dep} is not installed`);
      missingDeps.push(dep);
    }
  }

  if (missingDeps.length > 0) {
    console.log(chalk.yellow("\n💡 Install missing dependencies:"));
    console.log(chalk.gray(`   npm install ${missingDeps.join(" ")}`));
  }

  // ===== SUMMARY =====
  section("Summary");

  console.log(`\nPassed: ${chalk.green(checks.passed)}`);
  console.log(`Failed: ${chalk.red(checks.failed)}`);
  console.log(`Warnings: ${chalk.yellow(checks.warnings)}`);

  if (checks.failed === 0) {
    console.log(chalk.green.bold("\n✓ All critical checks passed!\n"));
    console.log("You can start the server with: npm run dev\n");
  } else {
    console.log(
      chalk.red.bold("\n✖ Some checks failed. Please fix the issues above.\n"),
    );
    process.exit(1);
  }
}

diagnose().catch((err) => {
  console.error(chalk.red("\n✖ Diagnostic failed:"), err.message);
  process.exit(1);
});
