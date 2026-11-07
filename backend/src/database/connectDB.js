import mongoose from "mongoose";
import { conf } from "../configs/env.js";
import logger from "../utils/logger.js";

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!conf.mongodbUri) {
    const errorMsg =
      "MONGODB_URI environment variable is missing or empty. Please set MONGODB_URI in your Vercel project environment variables.";
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (!cachedPromise) {
    logger.info("Connecting to MongoDB Atlas...");
    cachedPromise = mongoose
      .connect(conf.mongodbUri, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 10000,
      })
      .then((conn) => {
        logger.info(`MongoDB connected to host: ${conn.connection.host}`);
        logger.info(`Database: ${conn.connection.name}`);
        return conn;
      })
      .catch((error) => {
        cachedPromise = null;
        logger.error("MongoDB connection failed", {
          message: error.message,
          name: error.name,
          reason: error.reason?.message,
        });
        throw error;
      });
  }

  return cachedPromise;
};

export const closeDB = async () => {
  await mongoose.disconnect();
  logger.info("MongoDB connection closed");
};

export default connectDB;
