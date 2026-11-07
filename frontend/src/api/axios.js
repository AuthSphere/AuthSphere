import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(api(prom.request));
    }
  });

  failedQueue = [];
};

// Endpoints that should NEVER trigger a token refresh attempt on 401
const NO_REFRESH_URLS = [
  "/developers/refresh-token",
  "/developers/login",
  "/developers/register",
  "/developers/forgot-password",
  "/developers/reset-password",
  "/auth/",
];

// Public pages where an unauthenticated state should NOT trigger a forced redirect to /login
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/pricing",
  "/docs",
  "/verify",
  "/auth/callback",
];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if this request should skip the refresh token flow
    const isExcluded =
      !originalRequest ||
      originalRequest._skipRefresh ||
      originalRequest._retry ||
      NO_REFRESH_URLS.some((url) => originalRequest.url?.includes(url));

    if (error.response?.status === 401 && !isExcluded) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // queue the request until refresh is done
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, request: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        await api.post("/developers/refresh-token", {}, { _skipRefresh: true });

        // ✅ DISPATCH EVENT TO UPDATE AUTH CONTEXT
        window.dispatchEvent(new Event("token-refreshed"));

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // ✅ CLEAR SESSION
        window.dispatchEvent(new Event("auth-failed"));

        // Only redirect if the user is on a protected route
        const currentPath = window.location.pathname;
        const isPublic = PUBLIC_ROUTES.some((route) =>
          route === "/" ? currentPath === "/" : currentPath.startsWith(route),
        );

        if (!isPublic) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
