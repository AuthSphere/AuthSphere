import { QueryClient } from "@tanstack/react-query";

/**
 * Centralized TanStack Query client instance.
 * Default options are tuned for AuthSphere's production performance and data freshness:
 * - 2-minute default stale time to minimize redundant network traffic
 * - 10-minute cache retention (gcTime)
 * - Safe retries that avoid spamming on 401, 403, and 404 client errors
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403 || status === 404) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;
