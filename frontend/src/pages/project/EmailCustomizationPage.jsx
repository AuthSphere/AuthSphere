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
        <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
        <span className="text-neutral-500">
          QUERYING SMTP &amp; TEMPLATE CONFIGURATION...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fbf9f9] dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-xl border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-[#121316] p-6 text-center space-y-4">
          <div className="h-10 w-10 bg-rose-500/10 rounded-lg flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold font-mono">
            Error Loading Template Settings
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
            {error}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              asChild
              className="h-8 font-mono text-xs border-neutral-200 dark:border-[#2a2b33]"
            >
              <Link to={`/projects/${projectId}`}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                RETURN TO PROJECT
              </Link>
            </Button>
            <Button
              onClick={loadProject}
              className="h-8 font-mono text-xs bg-black dark:bg-white text-white dark:text-black"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              RETRY HANDSHAKE
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f9] dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 antialiased relative isolate selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Precision Engineering Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#fbf9f9] dark:bg-[#09090c]">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/50 dark:to-black/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Engineering Eyebrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 dark:border-[#222329] pb-3 gap-2">
          <div className="flex items-center text-xs font-mono text-neutral-500 uppercase tracking-widest">
            <Link
              to={`/projects/${projectId}`}
              className="hover:text-black dark:hover:text-white inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{project?.name || "PROJECT"}</span>
            </Link>
            <TechSeparator />
            <span>COMMUNICATION RUNTIME</span>
            <TechSeparator />
            <span>EMAIL CUSTOMIZER</span>
          </div>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>RFC-5322 COMPLIANT // ACTIVE</span>
          </div>
        </div>

        {/* Editor component */}
        <EmailTemplateEditor project={project} onUpdated={loadProject} />
      </div>
    </div>
  );
};

export default EmailCustomizationPage;
