import mongoose from "mongoose";

const developerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    picture: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
      enum: [
        "local",
        "Google",
        "GitHub",
        "Discord",
        "LinkedIn",
        "GitLab",
        "Twitch",
        "Bitbucket",
        "Microsoft",
      ],
      default: "local",
    },
    providerId: {
      type: String,
      unique: true,
      sparse: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    refreshTokenExpiry: {
      type: Date,
      default: null,
    },
    // Developer Preferences & Settings
    preferences: {
      notifications: {
        email: {
          projectUpdates: { type: Boolean, default: true },
          securityAlerts: { type: Boolean, default: true },
          weeklyDigest: { type: Boolean, default: false },
          newUserSignups: { type: Boolean, default: false },
        },
        inApp: {
          enabled: { type: Boolean, default: true },
          sound: { type: Boolean, default: false },
        },
      },
      api: {
        defaultRateLimit: { type: Number, default: 1000 }, // requests per hour
        enableCors: { type: Boolean, default: true },
        allowedIPs: [{ type: String }], // IP whitelist
      },
      dashboard: {
        defaultView: { type: String, enum: ["grid", "list"], default: "grid" },
        itemsPerPage: { type: Number, default: 10 },
        showAnalytics: { type: Boolean, default: true },
      },
    },
    // Developer Metadata
    organization: { type: String, default: "" },
    website: { type: String, default: "" },
    bio: { type: String, maxlength: 500, default: "" },
  },
  { timestamps: true },
);

const Developer = mongoose.model("Developer", developerSchema);
export default Developer;
