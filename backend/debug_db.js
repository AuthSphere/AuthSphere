import dotenv from "dotenv";
import mongoose from "mongoose";
import Project from "./src/models/project.model.js";
import Session from "./src/models/session.model.js";
import EndUser from "./src/models/endUsers.models.js";

dotenv.config();

async function check() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI is not set in .env");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  const projects = await Project.find({});
  console.log("Projects Count:", projects.length);
  projects.forEach((p) => {
    console.log(
      `- Project: ${p.name}, ID: ${p._id}, PublicKey: ${p.publicKey}`,
    );
  });

  const targetPublicKey = "1b2eb92b0fff434e40146da67219a346";
  const targetProject = await Project.findOne({ publicKey: targetPublicKey });

  if (targetProject) {
    console.log("\nTarget Project Found:", targetProject.name);
    console.log("Target Project ID:", targetProject._id);
    const endUsersCount = await EndUser.countDocuments({
      projectId: targetProject._id,
    });
    console.log("End Users Count:", endUsersCount);

    // Check sessions for this project
    const sessionsCount = await Session.countDocuments({
      projectId: targetProject._id,
    });
    console.log("Sessions Count for this project:", sessionsCount);

    // List all sessions to see what their project IDs are
    const allSessions = await Session.find({}).limit(10);
    console.log("\nRecent Sessions (any project):");
    allSessions.forEach((s) => {
      console.log(
        `- Session ID: ${s._id}, CreatedAt: ${s.createdAt}, projectId: ${s.projectId}, endUserId: ${s.endUserId}`,
      );
    });

    const recentSessionsForProject = await Session.find({
      projectId: targetProject._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);
    console.log("\nRecent Sessions for TARGET project:");
    recentSessionsForProject.forEach((s) => {
      console.log(
        `- Session ID: ${s._id}, CreatedAt: ${s.createdAt}, endUserId: ${s.endUserId}`,
      );
    });
  } else {
    console.log("\nTarget Project NOT FOUND with PublicKey:", targetPublicKey);
  }

  await mongoose.disconnect();
  process.exit(0);
}

check().catch((err) => {
  console.error(err);
  process.exit(1);
});
