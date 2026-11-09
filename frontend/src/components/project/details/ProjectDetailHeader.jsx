import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Hash,
  Activity,
  BarChart3,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Layers,
  KeyRound,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TechSeparator from "@/components/common/TechSeparator";

const ProjectDetailHeader = ({ project }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(project._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeProvidersCount = project.providers?.length || 0;

  return (
    <header className="space-y-5 pb-6 border-b border-border">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>CONSOLE</span>
          </button>
          <TechSeparator />
          <span className="text-muted-foreground uppercase">PROJECTS</span>
          <TechSeparator />
          <span className="font-semibold text-foreground uppercase tracking-wider">
            {project.name}
          </span>
        </div>
      </div>

      {/* ─── MAIN TITLE & ACTIONS ROW ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {project.name}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Manage authentication settings, API keys, and identity providers
                for this project.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/projects/${project._id}/analytics`)}
            className="h-9 px-3 text-xs font-mono border-border bg-card hover:bg-accent text-foreground cursor-pointer"
          >
            <BarChart3 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span>Analytics</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-9 px-3 text-xs font-mono border-border bg-card hover:bg-accent text-foreground cursor-pointer"
          >
            <a href="/documentation" target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <span>Specs &amp; Docs</span>
            </a>
          </Button>
        </div>
      </div>

      <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={copyId}
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border bg-muted hover:bg-accent text-foreground transition-colors cursor-pointer"
              >
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-mono tracking-tight">
                  {project._id}
                </span>
                {copied ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {copied ? "Copied to clipboard!" : "Click to copy Project ID"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-card text-muted-foreground text-[11px]">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>
            CREATED: {new Date(project.createdAt).toISOString().split("T")[0]}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-card text-muted-foreground text-[11px]">
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{activeProvidersCount} PROVIDERS CONFIGURED</span>
        </div>
      </div>
    </header>
  );
};

export default ProjectDetailHeader;
