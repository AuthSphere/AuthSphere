import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
      className="group cursor-pointer bg-card border border-border hover:border-primary transition-all duration-200 rounded-lg shadow-2xs hover:shadow-xs relative overflow-hidden"
    >
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
          {project.name}
        </CardTitle>
        <CardDescription className="text-xs font-mono text-muted-foreground mt-1">
          Created: {formattedDate}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-3 space-y-3">
        <div className="flex items-center justify-between pt-3 border-t border-border text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Key className="h-3 w-3 text-muted-foreground" />
            <span>ID: {project._id?.slice(-6) || "prod"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="h-3 w-3 text-muted-foreground" />
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
