import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_REQUIRED = ["PORT", "MONGODB_URI", "ACCESS_TOKEN_SECRET"];
const FRONTEND_REQUIRED = ["VITE_API_URL", "VITE_BACKEND_URL"];

function checkEnv(filePath, requiredKeys, name) {
  if (!fs.existsSync(filePath)) {
    console.error(`\x1b[31m❌ Missing .env file for ${name}\x1b[0m`);
    console.error(
      `👉 Please ensure you have a .env file configured for the ${name}.`,
    );
    console.error(`   You can use the root .env.example as a reference.\n`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const missing = [];

  for (const key of requiredKeys) {
    // Check if key exists and has a value
    const regex = new RegExp(`^${key}=(.*)`, "m");
    const match = content.match(regex);
    if (!match || !match[1].trim()) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error(
      `\x1b[31m❌ Missing or empty required environment variables in ${name} (.env):\x1b[0m`,
    );
    missing.forEach((k) => console.error(`   - ${k}`));
    process.exit(1);
  }

  console.log(`\x1b[32m✅ ${name} environment variables verified.\x1b[0m`);
}

console.log("\x1b[36m🔍 Verifying environment variables...\x1b[0m");
checkEnv(path.join(__dirname, "../backend/.env"), BACKEND_REQUIRED, "Backend");
checkEnv(
  path.join(__dirname, "../frontend/.env"),
  FRONTEND_REQUIRED,
  "Frontend",
);
console.log("\x1b[32m🎉 All required environment variables are set!\x1b[0m\n");
