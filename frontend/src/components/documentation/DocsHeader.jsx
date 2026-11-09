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
    <div className="sticky top-16 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-xs font-mono text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            AUTHTOKEN
          </Link>
          <TechSeparator />
          <span>SPECIFICATION</span>
          <TechSeparator />
          <span className="font-bold text-foreground truncate uppercase">
            {sections.find((s) => s.id === activeSection)?.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-border">
            <a
              href="https://github.com/AuthSphere/AuthSphere/tree/main/docs"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>

          <button
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-mono text-xs cursor-pointer"
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
