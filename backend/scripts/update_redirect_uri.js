import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../src/models/project.model.js";

dotenv.config();

const updateRedirectUri = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const projects = await Project.find({});

    for (const project of projects) {
      // Add http://localhost:3000/callback if not present
      if (!project.redirectUris.includes("http://localhost:3000/callback")) {
        project.redirectUris.push("http://localhost:3000/callback");
        await project.save();
        console.log(`Updated project ${project.name} with new redirect URI`);
      } else {
        console.log(`Project ${project.name} already has the redirect URI`);
      }
    }

    console.log("Done");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

updateRedirectUri();
