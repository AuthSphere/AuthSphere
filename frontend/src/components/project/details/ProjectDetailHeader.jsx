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
      {/* ─── TECHNICAL EYEBROW & BREADCRUMB ─── */}
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

        {/* Live Security Enclave Tag */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>RUNTIME ACTIVE</span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground hidden sm:inline">
            SPEC: RFC-7636 / HS256
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
                Authentication namespace, cryptographic signing keys, and
                identity runtime policies.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/projects/${project._id}/analytics`)}
            className="h-9 px-3 text-xs font-mono border-border bg-card hover:bg-accent text-foreground cursor-pointer"
          >
            <BarChart3 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span>Analytics Engine</span>
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

      {/* ─── TELEMETRY & METADATA BAR ─── */}
      <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
        {/* Project ID Pill */}
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

        {/* Created Timestamp */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-card text-muted-foreground text-[11px]">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>
            CREATED: {new Date(project.createdAt).toISOString().split("T")[0]}
          </span>
        </div>

        {/* Identity Providers Count */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-card text-muted-foreground text-[11px]">
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{activeProvidersCount} PROVIDERS CONFIGURED</span>
        </div>

        {/* Security Specs */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-card text-muted-foreground text-[11px]">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>PKCE S256 ENFORCED</span>
        </div>

        {/* Engine Version */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-card text-muted-foreground text-[11px] ml-auto">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span>v2.6.0 CORE</span>
        </div>
      </div>
    </header>
  );
};

export default ProjectDetailHeader;
