import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Github, X, Menu } from "lucide-react";
import TechSeparator from "@/components/common/TechSeparator";

const DocsHeader = ({
  sections,
  activeSection,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  return (
    <div className="sticky top-16 z-30 border-b border-neutral-200 dark:border-[#222329] bg-white/80 dark:bg-[#09090c]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-xs font-mono text-neutral-500">
          <Link
            to="/"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            AUTHTOKEN
          </Link>
          <TechSeparator />
          <span>SPECIFICATION</span>
          <TechSeparator />
          <span className="font-bold text-neutral-900 dark:text-white truncate uppercase">
            {sections.find((s) => s.id === activeSection)?.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-neutral-200 dark:border-[#222329]">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-neutral-200 dark:border-[#2a2b33] bg-neutral-100 dark:bg-[#15161b] text-neutral-600 dark:text-neutral-400 font-semibold">
              v2.6.0 SPEC
            </span>
            <a
              href="https://github.com/AuthSphere"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>

          <button
            className="md:hidden p-1.5 text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1.5 font-mono text-xs cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <span>{isSidebarOpen ? "CLOSE" : "MENU"}</span>
            {isSidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocsHeader;
