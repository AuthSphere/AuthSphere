import DeveloperSession from "../models/developerSession.model.js";
import { parseUserAgent } from "../utils/userAgentParser.js";

/**
 * Middleware to update lastActive timestamp for the current session
 */
export const trackSessionActivity = async (req, res, next) => {
  try {
    if (req.developer && req.cookies.refreshToken) {
      const refreshToken = req.cookies.refreshToken;
      const developerId = req.developer._id;

      // Check if session exists
      const existingSession = await DeveloperSession.findOne({
        refreshToken,
        developer: developerId,
      });

      if (existingSession) {
        // Just update last active
        existingSession.lastActive = new Date();
        await existingSession.save();
      } else {
        // Create the missing session record (self-healing for legacy/missed sessions)
        const userAgent = req.headers["user-agent"] || "";
        const ipAddress =
          req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        await DeveloperSession.create({
          developer: developerId,
          refreshToken: refreshToken,
          ipAddress: ipAddress,
          userAgent: userAgent,
          deviceInfo: parseUserAgent(userAgent),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
          location: {
            city: "Detected",
            country: "Current",
            countryCode: "LOC",
          },
        });
      }
    }
    next();
  } catch (error) {
    console.error("Session tracking error:", error);
    next();
  }
};
