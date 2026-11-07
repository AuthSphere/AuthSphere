import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ChevronRight, Key, Globe } from "lucide-react";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/projects/${project._id}`);
  };

  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently deployed";

  const providersCount = project.providers?.length || 1;

  return (
    <Card
      onClick={handleNavigate}
      className="group cursor-pointer bg-white dark:bg-[#0c0d10] border border-[#eaeaea] dark:border-[#222329] hover:border-black dark:hover:border-white transition-all duration-200 rounded-lg shadow-2xs hover:shadow-xs relative overflow-hidden"
    >
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="h-9 w-9 rounded border border-[#eaeaea] dark:border-[#222329] bg-neutral-50 dark:bg-[#14151a] flex items-center justify-center text-neutral-900 dark:text-white transition-transform group-hover:scale-105">
            <Shield className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
            <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        <CardTitle className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white group-hover:text-black dark:group-hover:text-white">
          {project.name}
        </CardTitle>
        <CardDescription className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-1">
          Created: {formattedDate}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-3 space-y-3">
        <div className="flex items-center justify-between pt-3 border-t border-[#eaeaea] dark:border-[#222329] text-xs font-mono text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Key className="h-3 w-3 text-neutral-500" />
            <span>ID: {project._id?.slice(-6) || "prod"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="h-3 w-3 text-neutral-500" />
            <span>
              {providersCount} {providersCount === 1 ? "Provider" : "Providers"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
