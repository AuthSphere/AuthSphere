import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Github, X, Menu } from "lucide-react";

const DocsHeader = ({
  sections,
  activeSection,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  return (
    <div className="sticky top-16 z-40 border-b bg-background/95">
      <div className="w-[90vw] mx-auto px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <Link
            to="/"
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            AuthSphere
            <ChevronDown className="h-3 w-3 -rotate-90" />
          </Link>
          <span className="text-xs font-medium text-muted-foreground">
            Documentation
          </span>
          <ChevronDown className="h-3 w-3 -rotate-90 text-muted-foreground/50" />
          <span className="text-xs font-bold truncate">
            {sections.find((s) => s.id === activeSection)?.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 pr-4 border-r">
            <Badge
              variant="secondary"
              className="text-[10px] h-5 bg-primary/5 text-primary border-primary/20"
            >
              v2.6.0
            </Badge>
            <a
              href="https://github.com/AuthSphere"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>

          <button
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground flex items-center gap-2"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <span className="text-xs font-bold uppercase tracking-widest">
              Menu
            </span>
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocsHeader;
