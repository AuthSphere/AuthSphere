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

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Collections:",
      collections.map((c) => c.name),
    );

    const projects = await mongoose.connection.db
      .collection("projects")
      .find({})
      .toArray();
    console.log("Projects found:", projects.length);
    projects.forEach((p) => console.log(`- ${p.name}: ${p.publicKey}`));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
