import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Hash,
  Activity,
  BarChart3,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProjectDetailHeader = ({ project }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(project._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-6 border-b">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">{project.name}</span>
      </nav>

      {/* Main Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge variant="secondary" className="gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Manage authentication settings and monitor user activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/projects/${project._id}/analytics`)}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={copyId}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-mono text-xs">{project._id}</span>
                {copied ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>Click to copy ID</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-4" />

        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span className="text-xs">
            Created {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">v2.1.0</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailHeader;
