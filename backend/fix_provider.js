import mongoose from "mongoose";
import { config } from "dotenv";
import Project from "./src/models/project.model.js";
import path from "path";

// Load env vars
config({ path: path.join(process.cwd(), ".env") });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

const updateProject = async () => {
  await connectDB();
  const projectId = "6974743656f9c58eb6ae4203";

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      console.log("Project not found");
      return;
    }

    console.log("Current providers:", project.providers);

    if (!project.providers.includes("local")) {
      project.providers.push("local");
      await project.save();
      console.log("Successfully added 'local' to providers.");
    } else {
      console.log("'local' is already in providers.");
    }
  } catch (error) {
    console.error("Error updating project:", error);
  } finally {
    await mongoose.disconnect();
  }
};

updateProject();
