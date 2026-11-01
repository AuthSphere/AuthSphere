import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

async function run() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log("Connected");

    const result = await mongoose.connection.db
      .collection("projects")
      .updateOne(
        { name: "mmmmm" },
        {
          $set: {
            "settings.requireEmailVerification": true,
            providers: [
              "local",
              "google",
              "github",
              "discord",
              "linkedin",
              "gitlab",
              "twitch",
              "bitbucket",
              "microsoft",
            ],
          },
        },
      );

    if (result.matchedCount === 0) {
      console.log("Project 'mmmmm' not found");
    } else {
      console.log("✅ Updated project 'mmmmm'");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
