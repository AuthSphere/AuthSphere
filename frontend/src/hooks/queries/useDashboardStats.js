import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/api/DeveloperAPI";

export const DASHBOARD_KEYS = {
  all: ["dashboard"],
  stats: () => [...DASHBOARD_KEYS.all, "stats"],
};

export const useDashboardStats = (options = {}) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.stats(),
    queryFn: async () => {
      const res = await getDashboardStats();
      if (!res?.success) {
        throw new Error(res?.message || "Failed to load dashboard telemetry");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
};

export default useDashboardStats;
