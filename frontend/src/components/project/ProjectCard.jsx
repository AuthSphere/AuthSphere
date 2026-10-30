import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KeyRound, Shield, Activity, ChevronRight } from "lucide-react";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/projects/${project._id}`);
  };

  return (
    <Card
      onClick={handleNavigate}
      className="group cursor-pointer bg-card border-border hover:border-primary/50 hover:shadow-sm transition-all duration-150"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <CardTitle className="text-xl">{project.name}</CardTitle>
        <CardDescription className="text-xs">
          Last deployed: {new Date().toLocaleDateString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-emerald-500" />
            <span>PKCE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="h-3 w-3 text-blue-500" />
            <span>1.2k Reqs</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
