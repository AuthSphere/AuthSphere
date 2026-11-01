import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject } from "@/api/ProjectAPI";
import EmailTemplateEditor from "@/components/project/details/EmailTemplateEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const EmailCustomizationPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProject = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getProject(projectId);
      if (!res?.success)
        throw new Error(res?.message || "Failed to load project");
      setProject(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    const fetchProject = async () => {
      if (projectId) await loadProject();
    };
    fetchProject();
  }, [projectId, loadProject]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading email settings...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 px-6">
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="h-16 w-16 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Error Loading Settings</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <Link to={`/projects/${projectId}`}>
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Project
                </Button>
              </Link>
              <Button onClick={loadProject} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[91vh] w-[93vw] mx-auto flex flex-col gap-2 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 pb-3 border-b">
        <div className="flex items-center gap-4">
          <Link to={`/projects/${projectId}`}>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-muted-foreground">
                {project.name}
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs text-muted-foreground">Email</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Email Customization
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Production
        </div>
      </div>

      {/* Editor fills remaining space */}
      <EmailTemplateEditor project={project} onUpdated={loadProject} />
    </div>
  );
};

export default EmailCustomizationPage;
