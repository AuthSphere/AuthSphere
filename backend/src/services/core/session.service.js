import DeveloperSession from "../../models/developerSession.model.js";
import Developer from "../../models/developer.model.js";
import { logEvent } from "../../utils/auditLogger.js";

class SessionService {
  /**
   * Get all valid sessions for a developer
   */
  async getSessions(developerId, currentRefreshToken) {
    const sessions = await DeveloperSession.find({
      developer: developerId,
      isValid: true,
    }).sort({ lastActive: -1 }).lean();

    return sessions.map((session) => ({
      _id: session._id,
      deviceInfo: session.deviceInfo,
      location: session.location,
      ipAddress: session.ipAddress,
      lastActive: session.lastActive,
      createdAt: session.createdAt,
      current: session.refreshToken === currentRefreshToken,
    }));
  }

  /**
   * Revoke a single session
   */
  async revokeSession(sessionId, developerId, reqInfo) {
    const session = await DeveloperSession.findOneAndUpdate(
      { _id: sessionId, developer: developerId },
      { isValid: false },
      { new: true },
    );

    if (session) {
      await logEvent({
        developerId,
        action: "SESSION_REVOKED",
        description: `Active session on ${session.deviceInfo?.os || "unknown device"} was revoked.`,
        category: "security",
        metadata: {
          ip: reqInfo.ip,
          userAgent: reqInfo.userAgent,
          resourceId: sessionId,
          details: { deviceInfo: session.deviceInfo },
        },
      });
    }

    return session;
  }

  /**
   * Revoke all other sessions for a developer
   */
  async revokeAllOtherSessions(developerId, currentRefreshToken, reqInfo) {
    const result = await DeveloperSession.updateMany(
      {
        developer: developerId,
        refreshToken: { $ne: currentRefreshToken },
      },
      { isValid: false },
    );

    await logEvent({
      developerId,
      action: "OTHER_SESSIONS_REVOKED",
      description: "All other active sessions were revoked.",
      category: "security",
      metadata: {
        ip: reqInfo.ip,
        userAgent: reqInfo.userAgent,
      },
    });

    return result;
  }

  /**
   * Revoke all sessions for a developer
   */
  async revokeAllSessions(developerId, reqInfo) {
    const result = await DeveloperSession.updateMany(
      { developer: developerId },
      { isValid: false },
    );

    // Also clear refresh token in developer model
    await Developer.findByIdAndUpdate(developerId, { refreshToken: null });

    await logEvent({
      developerId,
      action: "ALL_SESSIONS_REVOKED",
      description: "All active sessions (including current) were revoked.",
      category: "security",
      metadata: {
        ip: reqInfo.ip,
        userAgent: reqInfo.userAgent,
      },
    });

    return result;
  }
}

export default new SessionService();
