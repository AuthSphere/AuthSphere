import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");

export const api = axios.create({
  baseURL: cleanBaseUrl,
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

// Injected callbacks to avoid circular dependencies between Axios and state stores
let authCallbacks = {
  onTokenRefreshed: null,
  onAuthFailure: null,
};

export const setAxiosAuthCallbacks = ({ onTokenRefreshed, onAuthFailure }) => {
  if (onTokenRefreshed) authCallbacks.onTokenRefreshed = onTokenRefreshed;
  if (onAuthFailure) authCallbacks.onAuthFailure = onAuthFailure;
};

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

        // Synchronize auth state without window DOM events
        if (authCallbacks.onTokenRefreshed) {
          await authCallbacks.onTokenRefreshed();
        }

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        // Notify auth store of invalid session
        if (authCallbacks.onAuthFailure) {
          authCallbacks.onAuthFailure();
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
