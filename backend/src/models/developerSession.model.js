import mongoose from "mongoose";

const developerSessionSchema = new mongoose.Schema(
  {
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Developer",
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    ipAddress: String,
    userAgent: String,
    deviceInfo: {
      browser: String,
      os: String,
      device: String,
    },
    location: {
      city: String,
      country: String,
      countryCode: String,
      latitude: Number,
      longitude: Number,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

// Auto-delete expired sessions
developerSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
developerSessionSchema.index({ developer: 1, isValid: 1 });

const DeveloperSession = mongoose.model(
  "DeveloperSession",
  developerSessionSchema,
);
export default DeveloperSession;
