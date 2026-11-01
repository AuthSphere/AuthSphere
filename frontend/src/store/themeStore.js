import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    (set) => ({
      theme: "dark", // Default to dark initially as requested
      setTheme: (theme) => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
        set({ theme });
      },
    }),
    {
      name: "authsphere-ui-theme",
      onRehydrateStorage: () => (state) => {
        // Ensure class is applied on initial load
        if (state) {
          const root = window.document.documentElement;
          root.classList.remove("light", "dark");
          if (state.theme === "system") {
            const systemTheme = window.matchMedia(
              "(prefers-color-scheme: dark)",
            ).matches
              ? "dark"
              : "light";
            root.classList.add(systemTheme);
          } else {
            root.classList.add(state.theme);
          }
        }
      },
    },
  ),
);

export default useThemeStore;
