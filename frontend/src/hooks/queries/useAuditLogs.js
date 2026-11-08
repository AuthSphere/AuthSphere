import { useQuery } from "@tanstack/react-query";
import { getGlobalLogs, getProjectLogs } from "@/api/AuditLogAPI";

export const AUDIT_LOG_KEYS = {
  all: ["audit-logs"],
  global: () => [...AUDIT_LOG_KEYS.all, "global"],
  project: (projectId, params) => [
    ...AUDIT_LOG_KEYS.all,
    "project",
    projectId,
    params,
  ],
};

export const useGlobalAuditLogs = (options = {}) => {
  return useQuery({
    queryKey: AUDIT_LOG_KEYS.global(),
    queryFn: async () => {
      const res = await getGlobalLogs();
      if (!res?.success) {
        throw new Error(res?.message || "Failed to load audit logs");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
    ...options,
  });
};

export const useProjectAuditLogs = (projectId, params = {}, options = {}) => {
  return useQuery({
    queryKey: AUDIT_LOG_KEYS.project(projectId, params),
    queryFn: async () => {
      const res = await getProjectLogs(projectId, params);
      if (!res?.success) {
        throw new Error(res?.message || "Failed to load project audit logs");
      }
      return res.data;
    },
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 1,
    ...options,
  });
};

export default useGlobalAuditLogs;
