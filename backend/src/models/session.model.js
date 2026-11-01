import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, index: true },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    endUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EndUser",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    isValid: { type: Boolean, default: true },
  },
  { timestamps: true },
);

sessionSchema.index({ endUserId: 1, createdAt: -1 });
sessionSchema.index({ isValid: 1, expiresAt: 1 });
sessionSchema.index({ projectId: 1, createdAt: -1 });

const Session = mongoose.model("Session", sessionSchema);
export default Session;
