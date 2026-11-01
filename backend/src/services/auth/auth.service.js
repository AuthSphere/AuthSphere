import Developer from "../../models/developer.model.js";
import EndUser from "../../models/endUsers.models.js";
import DeveloperSession from "../../models/developerSession.model.js";
import Project from "../../models/project.model.js";
import sdkService from "./sdk.service.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { logEvent } from "../../utils/auditLogger.js";
import { parseUserAgent } from "../../utils/userAgentParser.js";
import { triggerWebhook } from "../../utils/webhookSender.js";
import bcrypt from "bcryptjs";
import axios from "axios";

class AuthService {
  /**
   * Handle Social Auth (Developer or SDK)
   */
  async handleSocialAuth(req, userData, context = {}) {
    const { sdkRequest, cli } = context;

    // ---------- SDK FLOW ----------
    if (sdkRequest) {
      return await this.handleSDKFlow(req, userData, sdkRequest);
    }

    // ---------- REGULAR DEVELOPER LOGIN ----------
    let developer = await Developer.findOne({ email: userData.email });

    if (!developer) {
      let baseUsername = userData.username || userData.email.split("@")[0];
      let username = baseUsername;

      while (await Developer.findOne({ username })) {
        username = baseUsername + Math.floor(Math.random() * 10000);
      }

      developer = await Developer.create({
        email: userData.email,
        username,
        picture: userData.picture || null,
        provider: userData.provider,
        providerId: userData.providerId,
      });

      await logEvent({
        developerId: developer._id,
        action: "ACCOUNT_CREATED",
        description: `New developer account created via ${userData.provider}. Welcome to AuthSphere!`,
        category: "project",
        metadata: {
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
    } else {
      developer.picture = userData.picture || developer.picture;
      developer.username = userData.username || developer.username;
      await developer.save();
    }

    const accessToken = generateAccessToken(developer._id);
    const refreshToken = generateRefreshToken(developer._id);

    developer.refreshToken = refreshToken;
    await developer.save({ validateBeforeSave: false });

    // ---------- CREATE SESSION RECORD ----------
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress =
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    let location = { city: "Unknown", country: "Unknown", countryCode: "???" };
    try {
      const geoResponse = await axios
        .get(`https://ipapi.co/${ipAddress}/json/`)
        .catch(() => null);
      if (geoResponse && geoResponse.data && !geoResponse.data.error) {
        location = {
          city: geoResponse.data.city,
          country: geoResponse.data.country_name,
          countryCode: geoResponse.data.country_code,
        };
      }
    } catch (geoError) {
      console.error("Geo lookup failed in social auth:", geoError.message);
    }

    await DeveloperSession.create({
      developer: developer._id,
      refreshToken: refreshToken,
      ipAddress: ipAddress,
      userAgent: userAgent,
      deviceInfo: parseUserAgent(userAgent),
      location: location,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await logEvent({
      developerId: developer._id,
      action: "DEVELOPER_LOGIN",
      description: `Successful login via ${userData.provider || "Social Auth"} from ${location?.city || "unknown location"}.`,
      category: "security",
      metadata: {
        ip: ipAddress,
        userAgent: userAgent,
        details: { location },
      },
    });

    return { developer, accessToken, refreshToken, cli };
  }

  /**
   * Handle SDK Flow (End User Auth via Project)
   */
  async handleSDKFlow(req, userData, sdkRequestId) {
    const authRequest = await sdkService.getAuthRequest(sdkRequestId);

    if (!authRequest) {
      throw new Error("Invalid or expired SDK request");
    }

    const normalizedEmail = userData.email.toLowerCase().trim();
    let endUser = await EndUser.findOne({
      email: normalizedEmail,
      projectId: authRequest.projectId,
    });

    if (endUser && endUser.isBlocked) {
      throw new Error(
        "This account has been suspended by the project administrator.",
      );
    }

    if (!endUser) {
      const randomPassword = await bcrypt.hash(
        Math.random().toString(36) + Date.now(),
        10,
      );
      let baseUsername = userData.username || userData.email.split("@")[0];
      let username = baseUsername;

      while (
        await EndUser.findOne({ username, projectId: authRequest.projectId })
      ) {
        username = baseUsername + Math.floor(Math.random() * 10000);
      }

      const project = await Project.findById(authRequest.projectId);
      const isVerifiedDefault = project?.settings?.requireEmailVerification
        ? false
        : true;

      endUser = await EndUser.create({
        email: userData.email,
        username,
        password: randomPassword,
        projectId: authRequest.projectId,
        picture: userData.picture || "",
        provider: userData.provider || "local",
        providerId: userData.providerId || "",
        isVerified: isVerifiedDefault,
      });

      if (project) {
        await logEvent({
          developerId: project.developer,
          projectId: project._id,
          action: "USER_REGISTERED",
          description: `New user (${userData.email}) registered via ${userData.provider || "Email"}.`,
          category: "user",
          metadata: {
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            resourceId: endUser._id,
          },
        });
      }

      triggerWebhook(authRequest.projectId, "user.registered", {
        userId: endUser._id,
        email: endUser.email,
        username: endUser.username,
        provider: userData.provider || "social",
        timestamp: new Date().toISOString(),
      });
    } else {
      endUser.picture = userData.picture || endUser.picture;
      endUser.username = userData.username || endUser.username;
      await endUser.save();
    }

    return { endUser, provider: userData.provider, sdkRequestId };
  }
}

export default new AuthService();
