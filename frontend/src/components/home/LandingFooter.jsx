import React from "react";
import { Link } from "react-router-dom";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";

export const LandingFooter = () => {
  return (
    <footer className="w-full bg-[#FAF8F3] dark:bg-[#0c0d10] border-t border-[#ded8cb] dark:border-[#222329] py-12 transition-colors duration-300 isolate">
      <div className="max-w-340 mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#ded8cb] dark:border-[#222329]">
        {/* Brand identity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <AuthSphereLogo className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white">
              AuthSphere
            </span>
          </div>
          <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
            Secure identity. Simple integration. Open source.
          </p>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
          <a
            className="text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            href="https://github.com/madhav9757/AuthSphere"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <Link
            className="text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            to="/docs"
          >
            Documentation
          </Link>
          <a
            className="text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            href="#community"
          >
            Community
          </a>
          <a
            className="text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            href="https://x.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            X / Twitter
          </a>
        </div>
      </div>

      {/* Bottom Legal & Telemetry */}
      <div className="max-w-340 mx-auto px-6 lg:px-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
        <div>© 2025 AuthSphere Core. MIT Licensed.</div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            System Status:{" "}
            <span className="text-neutral-900 dark:text-white font-semibold">
              Operational
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
