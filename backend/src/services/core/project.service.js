import Project from "../../models/project.model.js";
import EndUser from "../../models/endUsers.models.js";
import crypto from "crypto";
import { logEvent } from "../../utils/auditLogger.js";
import { triggerWebhook } from "../../utils/webhookSender.js";

class ProjectService {
  /**
   * Verify if a developer owns a project
   */
  async verifyOwnership(projectId, developerId) {
    const project = await Project.findOne({
      _id: projectId,
      developer: developerId,
    });
    return !!project;
  }

  /**
   * Helper to find project by developer and name
   */
  async getProjectByDeveloperAndName(developerId, name) {
    return await Project.findOne({ name, developer: developerId });
  }

  /**
   * Create a new project
   */
  async createProject(developerId, data, reqInfo) {
    const { name, redirectUris, providers, logoUrl } = data;

    const publicKey = crypto.randomBytes(16).toString("hex");
    const privateKey = crypto.randomBytes(32).toString("hex");

    const project = await Project.create({
      name,
      publicKey,
      privateKey,
      developer: developerId,
      redirectUris,
      providers,
      logoUrl,
    });

    // Log the event
    await logEvent({
      developerId,
      projectId: project._id,
      action: "PROJECT_CREATED",
      description: `New project "${name}" was created.`,
      category: "project",
      metadata: {
        ip: reqInfo.ip,
        userAgent: reqInfo.userAgent,
      },
    });

    return project;
  }

  /**
   * Get all projects for a developer
   */
  async getProjectsByDeveloper(developerId) {
    return await Project.find({ developer: developerId }).sort({
      createdAt: -1,
    }).lean();
  }

  /**
   * Get a single project
   */
  async getProject(projectId, developerId) {
    return await Project.findOne({ _id: projectId, developer: developerId }).lean();
  }

  /**
   * Update project settings
   */
  async updateProject(projectId, developerId, updates, reqInfo) {
    const updated = await Project.findOneAndUpdate(
      { _id: projectId, developer: developerId },
      updates,
      { new: true, runValidators: true },
    );

    if (updated) {
      await logEvent({
        developerId,
        projectId: updated._id,
        action: "PROJECT_UPDATED",
        description: `Project settings for "${updated.name}" were updated.`,
        category: "project",
        metadata: {
          ip: reqInfo.ip,
          userAgent: reqInfo.userAgent,
          details: { updates: Object.keys(updates) },
        },
      });
    }

    return updated;
  }

  /**
   * Rotate project API keys
   */
  async rotateKeys(projectId, developerId, reqInfo) {
    const newPublicKey = crypto.randomBytes(16).toString("hex");
    const newPrivateKey = crypto.randomBytes(32).toString("hex");

    const project = await Project.findOneAndUpdate(
      { _id: projectId, developer: developerId },
      { publicKey: newPublicKey, privateKey: newPrivateKey },
      { new: true },
    );

    if (project) {
      await logEvent({
        developerId,
        projectId: project._id,
        action: "API_KEY_ROTATED",
        description: "Project API keys were rotated.",
        category: "security",
        metadata: {
          ip: reqInfo.ip,
          userAgent: reqInfo.userAgent,
        },
      });

      triggerWebhook(project._id, "api_key.rotated", {
        projectId: project._id,
        timestamp: new Date().toISOString(),
      });
    }

    return project;
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId, developerId, reqInfo) {
    const project = await Project.findOneAndDelete({
      _id: projectId,
      developer: developerId,
    });

    if (project) {
      await logEvent({
        developerId,
        action: "PROJECT_DELETED",
        description: `Project "${project.name}" was deleted permanently.`,
        category: "project",
        metadata: {
          ip: reqInfo.ip,
          userAgent: reqInfo.userAgent,
          resourceId: project._id,
        },
      });
    }

    return project;
  }

  /**
   * Users related to a project
   */
  async getProjectUsers(projectId) {
    return await EndUser.find({ projectId })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
  }

  async deleteProjectUser(projectId, userId, developerId, reqInfo) {
    const project = await Project.findOne({
      _id: projectId,
      developer: developerId,
    });
    if (!project) return null;

    const user = await EndUser.findOneAndDelete({ _id: userId, projectId });
    if (user) {
      await logEvent({
        developerId,
        projectId,
        action: "USER_DELETED",
        description: `User "${user.email}" was deleted from project "${project.name}".`,
        category: "user",
        metadata: {
          ip: reqInfo.ip,
          userAgent: reqInfo.userAgent,
          resourceId: user._id,
        },
      });

      triggerWebhook(projectId, "user.deleted", {
        userId: user._id,
        email: user.email,
        projectId: project._id,
      });
    }

    return user;
  }

  async toggleUserVerification(projectId, userId, developerId, reqInfo) {
    const project = await Project.findOne({
      _id: projectId,
      developer: developerId,
    });
    if (!project) return { error: "Project not found" };

    const user = await EndUser.findOne({ _id: userId, projectId });
    if (!user) return { error: "User not found" };

    user.isVerified = !user.isVerified;
    await user.save();

    await logEvent({
      developerId,
      projectId,
      action: "USER_VERIFICATION_TOGGLED",
      description: `Verification for user "${user.email}" was toggled to ${user.isVerified ? "verified" : "unverified"}.`,
      category: "user",
      metadata: {
        ip: reqInfo.ip,
        userAgent: reqInfo.userAgent,
        resourceId: user._id,
      },
    });

    return { user };
  }

  async toggleUserBlock(projectId, userId, developerId, reqInfo) {
    const project = await Project.findOne({
      _id: projectId,
      developer: developerId,
    });
    if (!project) return { error: "Project not found" };

    const user = await EndUser.findOne({ _id: userId, projectId });
    if (!user) return { error: "User not found" };

    user.isBlocked = !user.isBlocked;
    await user.save();

    await logEvent({
      developerId,
      projectId,
      action: user.isBlocked ? "USER_BLOCKED" : "USER_UNBLOCKED",
      description: `User "${user.email}" was ${user.isBlocked ? "blocked from" : "unblocked for"} authentication in project "${project.name}".`,
      category: "user",
      metadata: {
        ip: reqInfo.ip,
        userAgent: reqInfo.userAgent,
        resourceId: user._id,
      },
    });

    return { user };
  }

  async addWebhook(projectId, developerId, webhookData) {
    const { url, events } = webhookData;
    const secret = crypto.randomBytes(32).toString("hex");

    return await Project.findOneAndUpdate(
      { _id: projectId, developer: developerId },
      {
        $push: {
          webhooks: { url, events, secret },
        },
      },
      { new: true, runValidators: true },
    );
  }

  async deleteWebhook(projectId, developerId, webhookId) {
    return await Project.findOneAndUpdate(
      { _id: projectId, developer: developerId },
      {
        $pull: {
          webhooks: { _id: webhookId },
        },
      },
      { new: true },
    );
  }
}

export default new ProjectService();
