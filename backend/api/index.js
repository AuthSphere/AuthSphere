import connectDB from "../src/database/connectDB.js";
import app from "../src/app.js";

export default async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Critical: Vercel Serverless Function Crash:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error during function initialization",
      error: error.message,
    });
  }
};
