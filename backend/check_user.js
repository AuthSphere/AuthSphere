import mongoose from "mongoose";
import { config } from "dotenv";
import EndUser from "./src/models/endUsers.models.js";
import path from "path";

// Load env vars
config({ path: path.join(process.cwd(), ".env") });

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    const email = "madhavsemwal9@gmail.com";
    const projectId = "6974743656f9c58eb6ae4203";

    const user = await EndUser.findOne({ email, projectId });

    if (user) {
      console.log(`User FOUND for project ${projectId}`);
      console.log("ID:", user._id);
      console.log("Email:", user.email);
      console.log("Verified:", user.isVerified);
      console.log("Provider:", user.provider);
    } else {
      console.log(`User NOT FOUND for email ${email} and project ${projectId}`);
      console.log("Listing all users for this project:");
      const allUsers = await EndUser.find({ projectId }).limit(5);
      console.log(allUsers.map((u) => u.email));
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

checkUser();
