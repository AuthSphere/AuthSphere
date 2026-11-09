import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject } from "@/api/ProjectAPI";
import EmailTemplateEditor from "@/components/project/details/EmailTemplateEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import TechSeparator from "@/components/common/TechSeparator";

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
    let ignore = false;
    if (!projectId) return;

    getProject(projectId)
      .then((res) => {
        if (!ignore) {
          if (!res?.success) {
            setError(res?.message || "Failed to load project");
          } else {
            setProject(res.data);
          }
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">
          Loading email templates...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-xl border border-destructive/30 bg-card text-card-foreground p-6 text-center space-y-4">
          <div className="h-10 w-10 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold font-mono">
            Error Loading Template Settings
          </h2>
          <p className="text-xs text-muted-foreground font-mono">{error}</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              asChild
              className="h-8 font-mono text-xs border-border"
            >
              <Link to={`/projects/${projectId}`}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                Back to Project
              </Link>
            </Button>
            <Button onClick={loadProject} className="h-8 font-mono text-xs">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased relative isolate selection:bg-primary selection:text-primary-foreground">
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-background">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-muted/50 dark:to-background/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-2">
          <div className="flex items-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
            <Link
              to={`/projects/${projectId}`}
              className="hover:text-foreground inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{project?.name || "PROJECT"}</span>
            </Link>
          </div>
        </div>

        <EmailTemplateEditor project={project} onUpdated={loadProject} />
      </div>
    </div>
  );
};

export default EmailCustomizationPage;
