import projectService from "../services/core/project.service.js";
import { sendVerificationOTP } from "../services/auth/email.service.js";
import { invalidateSdkCorsCache } from "../middlewares/sdkCors.middleware.js";

/* ============================================================
   CREATE PROJECT
 ============================================================ */
export const createProject = async (req, res) => {
  try {
    const { name, redirectUris, providers } = req.body;
    const developerId = req.developer._id;

    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Project name is required" });
    if (
      !redirectUris ||
      !Array.isArray(redirectUris) ||
      redirectUris.length === 0
    )
      return res
        .status(400)
        .json({ success: false, message: "Redirect URIs are required" });
    if (!providers || !Array.isArray(providers) || providers.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "At least one provider is required" });

    const exists = await projectService.getProjectByDeveloperAndName(
      developerId,
      name,
    );
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "Project already exists" });

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const project = await projectService.createProject(
      developerId,
      req.body,
      reqInfo,
    );

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    console.error("Create Project Error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

/* ============================================================
   GET ALL PROJECTS
 ============================================================ */
export const getProjects = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const projects = await projectService.getProjectsByDeveloper(developerId);
    return res.status(200).json({ success: true, data: projects });
  } catch (err) {
    console.error("Get Projects Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   GET SINGLE PROJECT
 ============================================================ */
export const getProject = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId } = req.params;

    const project = await projectService.getProject(projectId, developerId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({ success: true, data: project });
  } catch (err) {
    console.error("Get Project Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   UPDATE PROJECT
 ============================================================ */
export const updateProject = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId } = req.params;

    const allowedUpdates = [
      "name",
      "settings",
      "redirectUris",
      "providers",
      "allowedOrigins",
      "logoUrl",
      "emailTemplate",
    ];
    const updates = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const updated = await projectService.updateProject(
      projectId,
      developerId,
      updates,
      reqInfo,
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Bust the SDK CORS cache so the new allowedOrigins take effect instantly
    if (updates.allowedOrigins !== undefined) {
      invalidateSdkCorsCache(updated.publicKey);
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("Update Project Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   ROTATE PROJECT KEYS
 ============================================================ */
export const rotateKeys = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId } = req.params;

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const project = await projectService.rotateKeys(
      projectId,
      developerId,
      reqInfo,
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Keys rotated successfully",
      data: project,
    });
  } catch (err) {
    console.error("Rotate Keys Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   DELETE PROJECT
 ============================================================ */
export const deleteProject = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId } = req.params;

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const project = await projectService.deleteProject(
      projectId,
      developerId,
      reqInfo,
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error("Delete Project Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   GET PROJECT USERS
 ============================================================ */
export const getProjectUsers = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId } = req.params;

    if (!(await projectService.verifyOwnership(projectId, developerId))) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const users = await projectService.getProjectUsers(projectId);

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error("Get Project Users Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   DELETE PROJECT USER
 ============================================================ */
export const deleteProjectUser = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId, userId } = req.params;

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const user = await projectService.deleteProjectUser(
      projectId,
      userId,
      developerId,
      reqInfo,
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User or Project not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete Project User Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   TOGGLE USER VERIFICATION
 ============================================================ */
export const toggleUserVerification = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId, userId } = req.params;

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const result = await projectService.toggleUserVerification(
      projectId,
      userId,
      developerId,
      reqInfo,
    );

    if (result.error) {
      return res.status(404).json({ success: false, message: result.error });
    }

    return res.status(200).json({
      success: true,
      message: `User ${result.user.isVerified ? "verified" : "unverified"} successfully`,
      data: result.user,
    });
  } catch (err) {
    console.error("Toggle User Verification Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   TOGGLE USER BLOCK STATUS
 ============================================================ */
export const toggleUserBlock = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId, userId } = req.params;

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const result = await projectService.toggleUserBlock(
      projectId,
      userId,
      developerId,
      reqInfo,
    );

    if (result.error) {
      return res.status(404).json({ success: false, message: result.error });
    }

    return res.status(200).json({
      success: true,
      message: `User account ${result.user.isBlocked ? "blocked" : "unblocked"} successfully`,
      data: result.user,
    });
  } catch (err) {
    console.error("Toggle User Block Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   GET CONFIGURED PROVIDERS
 ============================================================ */
export const getConfiguredProviders = async (req, res) => {
  try {
    const getProviderStatus = (clientId, clientSecret) => {
      const isConfigured = !!(clientId && clientSecret);
      return {
        isConfigured,
        status: isConfigured ? "ready" : "not_configured",
        message: isConfigured
          ? "Ready to integrate"
          : "Not yet configured. Add credentials to enable this provider.",
      };
    };

    const providers = {
      local: {
        isConfigured: true,
        status: "ready",
        message: "Always available",
      },
      google: getProviderStatus(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
      ),
      github: getProviderStatus(
        process.env.GITHUB_CLIENT_ID,
        process.env.GITHUB_CLIENT_SECRET,
      ),
      discord: getProviderStatus(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_CLIENT_SECRET,
      ),
      gitlab: getProviderStatus(
        process.env.GITLAB_CLIENT_ID,
        process.env.GITLAB_CLIENT_SECRET,
      ),
      twitch: getProviderStatus(
        process.env.TWITCH_CLIENT_ID,
        process.env.TWITCH_CLIENT_SECRET,
      ),
      microsoft: getProviderStatus(
        process.env.MICROSOFT_CLIENT_ID,
        process.env.MICROSOFT_CLIENT_SECRET,
      ),
      facebook: getProviderStatus(
        process.env.FACEBOOK_CLIENT_ID,
        process.env.FACEBOOK_CLIENT_SECRET,
      ),
      twitter: getProviderStatus(
        process.env.TWITTER_CLIENT_ID,
        process.env.TWITTER_CLIENT_SECRET,
      ),
      slack: getProviderStatus(
        process.env.SLACK_CLIENT_ID,
        process.env.SLACK_CLIENT_SECRET,
      ),
      apple: getProviderStatus(
        process.env.APPLE_CLIENT_ID,
        process.env.APPLE_CLIENT_SECRET,
      ),
      spotify: getProviderStatus(
        process.env.SPOTIFY_CLIENT_ID,
        process.env.SPOTIFY_CLIENT_SECRET,
      ),
      reddit: getProviderStatus(
        process.env.REDDIT_CLIENT_ID,
        process.env.REDDIT_CLIENT_SECRET,
      ),
      linkedin: getProviderStatus(
        process.env.LINKEDIN_CLIENT_ID,
        process.env.LINKEDIN_CLIENT_SECRET,
      ),
      hubspot: getProviderStatus(
        process.env.HUBSPOT_CLIENT_ID,
        process.env.HUBSPOT_CLIENT_SECRET,
      ),
      instagram: getProviderStatus(
        process.env.INSTAGRAM_CLIENT_ID,
        process.env.INSTAGRAM_CLIENT_SECRET,
      ),
      pinterest: getProviderStatus(
        process.env.PINTEREST_CLIENT_ID,
        process.env.PINTEREST_CLIENT_SECRET,
      ),
    };

    return res.status(200).json({ success: true, data: providers });
  } catch (err) {
    console.error("Get Configured Providers Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   SEND TEST EMAIL
 ============================================================ */
export const sendTestEmail = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const project = await projectService.getProject(projectId, developerId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const mockOtp = "123456";
    const mockMetadata = {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      location: "Preview Render",
      requestId: "test_" + Math.random().toString(36).substring(7),
      projectId: project._id,
    };

    await sendVerificationOTP(
      email,
      mockOtp,
      project.name,
      project.emailTemplate,
      mockMetadata,
    );

    return res.status(200).json({
      success: true,
      message: `Test email successfully sent to ${email}`,
    });
  } catch (err) {
    console.error("Send Test Email Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send test email",
    });
  }
};

/* ============================================================
   WEBHOOK MANAGEMENT
 ============================================================ */
export const addWebhook = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { url, events } = req.body;
    const developerId = req.developer._id;

    if (!url || !events || !Array.isArray(events) || events.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "URL and events are required" });
    }

    const project = await projectService.addWebhook(
      projectId,
      developerId,
      req.body,
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(201).json({
      success: true,
      message: "Webhook added successfully",
      data: project.webhooks[project.webhooks.length - 1],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteWebhook = async (req, res) => {
  try {
    const { projectId, webhookId } = req.params;
    const developerId = req.developer._id;

    const project = await projectService.deleteWebhook(
      projectId,
      developerId,
      webhookId,
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project or Webhook not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Webhook deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const testWebhook = async (req, res) => {
  try {
    const { projectId, webhookId } = req.params;
    const { event } = req.body;
    const developerId = req.developer._id;

    if (!event) {
      return res
        .status(400)
        .json({ success: false, message: "Event required" });
    }

    const project = await projectService.getProject(projectId, developerId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Find webhook
    // Project model likely has webhooks array.
    const webhook = project.webhooks.id(webhookId);
    if (!webhook) {
      return res
        .status(404)
        .json({ success: false, message: "Webhook not found" });
    }

    const mockPayload = {
      event,
      timestamp: new Date().toISOString(),
      projectId: project._id,
      data: {
        userId: "test_" + Math.random().toString(36).substring(7),
        email: "test@example.com",
        username: "test_user",
        provider: "local",
        isTest: true,
      },
    };

    const crypto = await import("crypto");
    const signature = crypto.default
      .createHmac("sha256", webhook.secret)
      .update(JSON.stringify(mockPayload))
      .digest("hex");

    const axios = (await import("axios")).default;

    try {
      const response = await axios.post(webhook.url, mockPayload, {
        headers: {
          "Content-Type": "application/json",
          "X-AuthSphere-Signature": signature,
          "X-AuthSphere-Event": event,
          "X-AuthSphere-Delivery": "test",
        },
        timeout: 5000,
      });

      return res.status(200).json({
        success: true,
        message: `High-Five! Webhook delivered. remote_server_responded: ${response.status} ${response.statusText}`,
      });
    } catch (deliveryError) {
      return res.status(502).json({
        success: false,
        message: `Delivery Failed: ${deliveryError.message}`,
        details: deliveryError.response ? deliveryError.response.data : null,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
