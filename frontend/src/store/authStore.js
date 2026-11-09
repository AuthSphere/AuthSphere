import { create } from "zustand";
import { persist } from "zustand/middleware";
import api, { setAxiosAuthCallbacks } from "../api/axios";

/**
 * Production Auth Store for AuthSphere
 * Defines explicit session lifecycle: unknown -> checking -> authenticated | unauthenticated.
 * Treats the backend session as the single source of truth while persisting display data
 * to localStorage for non-blocking UI initial rendering.
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      status: "unknown", // "unknown" | "checking" | "authenticated" | "unauthenticated"
      loading: true,
      loggingOut: false,

      setUser: (user) => {
        set({
          user,
          status: user ? "authenticated" : "unauthenticated",
          loading: false,
        });
      },

      setLoading: (loading) => set({ loading }),

      checkAuth: async (force = false) => {
        // Prevent duplicate concurrent verification runs
        if (get().status === "checking" && !force) {
          return;
        }

        const currentUser = get().user;
        set({ status: "checking", loading: true });

        try {
          // If no local user exists, do not attempt automatic token refresh on 401
          const res = await api.get("/developers/me", {
            _skipRefresh: !currentUser,
          });

          if (res.data?.success && res.data.data) {
            set({
              user: res.data.data,
              status: "authenticated",
              loading: false,
            });
          } else {
            set({
              user: null,
              status: "unauthenticated",
              loading: false,
            });
            localStorage.removeItem("auth-storage");
          }
        } catch (err) {
          set({
            user: null,
            status: "unauthenticated",
            loading: false,
          });
          localStorage.removeItem("auth-storage");

          if (err.response?.status !== 401) {
            console.error("Auth session check failed:", err.message);
          }
        }
      },

      logout: async () => {
        set({ loggingOut: true });
        try {
          await api.post("/developers/logout");
        } catch (error) {
          console.error("Logout request failed:", error);
        } finally {
          set({
            user: null,
            status: "unauthenticated",
            loading: false,
            loggingOut: false,
          });
          localStorage.removeItem("auth-storage");
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

// Register Axios auth callbacks directly without global window DOM events
setAxiosAuthCallbacks({
  onTokenRefreshed: async () => {
    try {
      const res = await api.get("/developers/me", { _skipRefresh: true });
      if (res.data?.success && res.data.data) {
        useAuthStore.getState().setUser(res.data.data);
      }
    } catch (err) {
      console.error("Failed to re-fetch user identity after refresh:", err);
      useAuthStore.getState().setUser(null);
    }
  },
  onAuthFailure: () => {
    useAuthStore.getState().setUser(null);
    localStorage.removeItem("auth-storage");
  },
});

/**
 * Kept for backward compatibility with existing component calls.
 * Returns a no-op cleanup function.
 */
export const setupAuthListeners = () => () => {};

export default useAuthStore;
