import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      loggingOut: false,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),

      checkAuth: async (force = false) => {
        const currentUser = get().user;

        // If not logged in and not forced (e.g. from OAuth callback or explicit login),
        // we know there is no active session. Don't make an unnecessary API call that would 401.
        if (!currentUser && !force) {
          set({ loading: false });
          return;
        }

        set({ loading: true });
        try {
          const res = await api.get("/developers/me", {
            _skipRefresh: !currentUser,
          });
          if (res.data?.success) {
            set({ user: res.data.data });
          } else {
            set({ user: null });
          }
        } catch (err) {
          set({ user: null });
          if (err.response?.status !== 401) {
            console.error("Auth check failed:", err.message);
          }
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        set({ loggingOut: true });
        try {
          await api.post("/developers/logout");
        } catch (error) {
          console.error("Logout request failed:", error);
        } finally {
          set({ user: null, loggingOut: false });
          // Clear storage on logout to be safe
          localStorage.removeItem("auth-storage");
          window.location.href = "/login";
        }
      },
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({ user: state.user }), // only persist the user object
    },
  ),
);

// Setup listeners for axios interceptor events
// This should be called once in the app (e.g., in App.jsx or a focused component)
export const setupAuthListeners = () => {
  const { setUser } = useAuthStore.getState();

  const handleTokenRefreshed = async () => {
    try {
      const res = await api.get("/developers/me", { _skipRefresh: true });
      if (res.data?.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch user after token refresh:", err);
      setUser(null);
    }
  };

  const handleAuthFailed = () => {
    setUser(null);
  };

  window.addEventListener("token-refreshed", handleTokenRefreshed);
  window.addEventListener("auth-failed", handleAuthFailed);

  // Return generic cleanup function, though likely used at app root level
  return () => {
    window.removeEventListener("token-refreshed", handleTokenRefreshed);
    window.removeEventListener("auth-failed", handleAuthFailed);
  };
};

export default useAuthStore;
