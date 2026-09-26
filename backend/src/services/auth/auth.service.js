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


class AuthService {
  /**
   * Handle Social Auth (Developer or SDK)
   */
  async handleSocialAuth(req, userData, context = {}) {
    const { sdkRequest, cli } = context;
    console.log("[Social Auth] 1. Started — provider:", userData.provider, "| email:", userData.email, "| sdkRequest:", !!sdkRequest);

    // ---------- SDK FLOW ----------
    if (sdkRequest) {
      return await this.handleSDKFlow(req, userData, sdkRequest);
    }

    // ---------- REGULAR DEVELOPER LOGIN ----------
    console.log("[Social Auth] 2. Looking up developer by email...");
    console.log("[Social Auth] 2A. Before database query");
    let developer = await Developer.findOne({ email: userData.email });
    console.log("[Social Auth] 2B. Database query completed", !!developer);
    console.log("[Social Auth] 3. Developer lookup done — found:", !!developer);

    if (!developer) {
      let baseUsername = userData.username || userData.email.split("@")[0];
      let username = baseUsername;

      console.log("[Social Auth] 4. Checking username uniqueness...");
      while (await Developer.findOne({ username })) {
        username = baseUsername + Math.floor(Math.random() * 10000);
      }
      console.log("[Social Auth] 5. Username resolved:", username);

      console.log("[Social Auth] 6. Creating new developer...");
      developer = await Developer.create({
        email: userData.email,
        username,
        picture: userData.picture || null,
        provider: userData.provider,
        providerId: userData.providerId,
      });
      console.log("[Social Auth] 7. Developer created:", developer._id.toString());

      // 🔥 Fire-and-forget — audit log must NOT block the auth response
      console.log("[Social Auth] 8. Firing ACCOUNT_CREATED log (non-blocking)...");
      logEvent({
        developerId: developer._id,
        action: "ACCOUNT_CREATED",
        description: `New developer account created via ${userData.provider}. Welcome to AuthSphere!`,
        category: "project",
        metadata: {
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        },
      }).catch((err) =>
        console.error("[Social Auth] ACCOUNT_CREATED logEvent failed:", err.message),
      );
    } else {
      developer.picture = userData.picture || developer.picture;
      developer.username = userData.username || developer.username;
      console.log("[Social Auth] 4. Saving updated developer picture/username...");
      await developer.save();
      console.log("[Social Auth] 5. Developer updated.");
    }

    // ── CRITICAL PATH: generate tokens and persist refreshToken ──────────────
    console.log("[Social Auth] 10. Generating tokens...");
    const accessToken = generateAccessToken(developer._id);
    const refreshToken = generateRefreshToken(developer._id);
    console.log("[Social Auth] 11. Tokens generated.");

    developer.refreshToken = refreshToken;
    console.log("[Social Auth] 12. Saving refreshToken to developer...");
    await developer.save({ validateBeforeSave: false });
    console.log("[Social Auth] 13. refreshToken saved — critical path done.");
    // ─────────────────────────────────────────────────────────────────────────

    // ---------- SESSION & AUDIT (non-blocking, best-effort) ----------
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress =
      req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress;
    console.log("[Social Auth] 14. Firing session + audit log (non-blocking)...");

    // Resolve geo location then create session & log — all fire-and-forget
    Promise.resolve()
      .then(async () => {
        let location = { city: "Unknown", country: "Unknown", countryCode: "???" };

        const isPrivateIP =
          !ipAddress ||
          ipAddress === "::1" ||
          ipAddress === "127.0.0.1" ||
          ipAddress === "localhost" ||
          ipAddress.startsWith("192.168.") ||
          ipAddress.startsWith("10.") ||
          ipAddress.startsWith("172.");

        if (!isPrivateIP) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const geoResponse = await fetch(
              `https://ipapi.co/${ipAddress}/json/`,
              { signal: controller.signal },
            )
              .then((res) => res.json())
              .catch(() => null)
              .finally(() => clearTimeout(timeoutId));

            if (geoResponse && !geoResponse.error) {
              location = {
                city: geoResponse.city,
                country: geoResponse.country_name,
                countryCode: geoResponse.country_code,
              };
            }
          } catch (_) { /* geo failure is non-fatal */ }
        }

        await DeveloperSession.create({
          developer: developer._id,
          refreshToken,
          ipAddress,
          userAgent,
          deviceInfo: parseUserAgent(userAgent),
          location,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        await logEvent({
          developerId: developer._id,
          action: "DEVELOPER_LOGIN",
          description: `Successful login via ${userData.provider || "Social Auth"} from ${location?.city || "unknown location"}.`,
          category: "security",
          metadata: { ip: ipAddress, userAgent, details: { location } },
        });
      })
      .catch((err) =>
        console.error("[Social Auth] Background session/log failed:", err.message),
      );

    console.log("[Social Auth] 22. Done — returning tokens.");
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
