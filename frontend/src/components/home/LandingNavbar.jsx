import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";
import useThemeStore from "@/store/themeStore";
import useAuthStore from "@/store/authStore";

export const LandingNavbar = () => {
  const { theme, setTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#F6F4EE]/90 dark:bg-[#09090c]/90 backdrop-blur-md border-b border-[#e2ded4] dark:border-[#222329] transition-colors duration-300">
      <div className="h-16 max-w-340 mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
        {/* Brand Logo / Wordmark */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="AuthSphere Home"
          >
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <AuthSphereLogo className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-105" />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-neutral-900 dark:text-neutral-100">
              AuthSphere
            </span>
          </Link>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider text-neutral-600 dark:text-neutral-400 bg-[#ece8de] dark:bg-[#18191d] border border-[#ded8cb] dark:border-[#2b2c34]">
            OSS
          </span>
        </div>

        {/* Center Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 h-16 text-[13px] font-medium tracking-tight">
          <a
            href="#overview"
            className="text-neutral-900 dark:text-white transition-colors h-full flex items-center border-b-2 border-neutral-900 dark:border-white font-semibold"
          >
            Overview
          </a>
          <a
            href="#features"
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent"
          >
            Features
          </a>
          <Link
            to="/docs"
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent"
          >
            Documentation
          </Link>
          <a
            href="#community"
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent"
          >
            Community
          </a>
        </nav>

        {/* Right Action CTAs + Sleek Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="inline-flex items-center justify-center gap-1.5 h-9 px-2.5 rounded-md bg-white dark:bg-[#14151a] border border-neutral-300 dark:border-[#2a2b33] text-black dark:text-neutral-200 hover:border-black dark:hover:border-neutral-400 transition-all text-xs font-mono shadow-sm cursor-pointer"
            id="theme-toggle-btn"
            title="Toggle Light / Dark mode"
          >
            <span className="material-symbols-outlined text-[17px] text-amber-700 dark:hidden">
              light_mode
            </span>
            <span className="material-symbols-outlined text-[17px] hidden dark:inline text-neutral-300">
              dark_mode
            </span>
            <span className="hidden lg:inline text-[11px] font-mono capitalize">
              {isDark ? "Dark" : "Light"}
            </span>
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/madhav9757/AuthSphere"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 h-9 px-3.5 rounded-md bg-white dark:bg-[#14151a] border border-neutral-300 dark:border-[#2a2b33] text-black dark:text-neutral-200 hover:border-black dark:hover:border-white transition-all text-xs font-mono font-semibold shadow-sm"
          >
            <svg
              aria-hidden="true"
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 24 24"
            >
              <path
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                fillRule="evenodd"
              />
            </svg>
            <span>GitHub</span>
          </a>

          {/* Primary CTA */}
          <Link
            to={user ? "/dashboard" : "/login"}
            className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-black dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-mono font-bold transition-all shadow-sm"
          >
            {user ? "Dashboard" : "Get Started"}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md bg-white dark:bg-[#14151a] border border-neutral-300 dark:border-[#2a2b33] text-neutral-800 dark:text-neutral-200"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e2ded4] dark:border-[#222329] bg-[#F6F4EE] dark:bg-[#09090c] px-6 py-4 flex flex-col gap-3 font-mono text-xs">
          <a
            href="#overview"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-neutral-900 dark:text-white font-medium border-b border-neutral-200 dark:border-neutral-800"
          >
            Overview
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-neutral-700 dark:text-neutral-300 font-medium border-b border-neutral-200 dark:border-neutral-800"
          >
            Features
          </a>
          <Link
            to="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-neutral-700 dark:text-neutral-300 font-medium border-b border-neutral-200 dark:border-neutral-800"
          >
            Documentation
          </Link>
          <a
            href="#community"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-neutral-700 dark:text-neutral-300 font-medium border-b border-neutral-200 dark:border-neutral-800"
          >
            Community
          </a>
          <div className="pt-2 flex items-center justify-between">
            <a
              href="https://github.com/madhav9757/AuthSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200 font-medium"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
              >
                <path
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  fillRule="evenodd"
                />
              </svg>
              <span>GitHub (1.2k★)</span>
            </a>
            <Link
              to={user ? "/dashboard" : "/login"}
              className="px-3 py-1.5 rounded bg-black dark:bg-white text-white dark:text-neutral-900 font-bold"
            >
              {user ? "Dashboard" : "Get Started"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
