import AuditLog from "../../models/auditLog.model.js";

class AuditLogService {
  /**
   * Get logs for a specific project
   */
  async getProjectLogs(projectId, filters = {}, limit = 50) {
    const query = { projectId };
    if (filters.category) query.category = filters.category;
    if (filters.actorType) query["actor.type"] = filters.actorType;

    return await AuditLog.find(query).sort({ createdAt: -1 }).limit(limit).lean();
  }

  /**
   * Get global logs for a developer
   */
  async getGlobalLogs(developerId, filters = {}, limit = 50) {
    const query = { developerId };
    if (filters.category) query.category = filters.category;
    if (filters.actorType) query["actor.type"] = filters.actorType;

    return await AuditLog.find(query).sort({ createdAt: -1 }).limit(limit);
  }
}

export default new AuditLogService();
