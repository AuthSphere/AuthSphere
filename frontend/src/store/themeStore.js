import { create } from "zustand";
import { persist } from "zustand/middleware";

let mediaQueryListener = null;

const applyThemeToDOM = (theme) => {
  if (typeof window === "undefined") return;
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");

  const media = window.matchMedia("(prefers-color-scheme: dark)");

  if (mediaQueryListener) {
    media.removeEventListener("change", mediaQueryListener);
    mediaQueryListener = null;
  }

  if (theme === "system") {
    const resolved = media.matches ? "dark" : "light";
    root.classList.add(resolved);

    mediaQueryListener = (e) => {
      root.classList.remove("light", "dark");
      root.classList.add(e.matches ? "dark" : "light");
    };
    media.addEventListener("change", mediaQueryListener);
  } else {
    root.classList.add(theme);
  }
};

const useThemeStore = create(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => {
        applyThemeToDOM(theme);
        set({ theme });
      },
    }),
    {
      name: "authsphere-ui-theme",
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyThemeToDOM(state.theme);
        }
      },
    },
  ),
);

export default useThemeStore;
