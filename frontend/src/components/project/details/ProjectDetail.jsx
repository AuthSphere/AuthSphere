import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject } from "@/api/ProjectAPI";

// Component Imports
import ProjectDetailHeader from "./ProjectDetailHeader";
import ProjectKeysCard from "./ProjectKeysCard";
import ProjectSettings from "./ProjectSettings";
import ProvidersPage from "@/pages/project/ProvidersPage";

import ProjectUsersCard from "./ProjectUsersCard";
import ProjectWebhooksCard from "./ProjectWebhooksCard";
import ProjectLogsCard from "./ProjectLogsCard";
import LiveEventsStream from "../LiveEventsStream";

// UI Imports
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Loader2,
  Key,
  Users,
  Settings2,
  Globe,
  ShieldCheck,
  Activity,
  Webhook,
  Terminal,
} from "lucide-react";

const ProjectDetail = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProject = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getProject(projectId);

      if (!res?.success) {
        throw new Error(res?.message || "Failed to load project");
      }

      setProject(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (projectId) loadProject();
  }, [projectId, loadProject]);

  /* LOADING STATE */
  if (loading) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  /* ERROR STATE */
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="h-16 w-16 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Error Loading Project</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/dashboard">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
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

  /* MAIN RENDER */
  return (
    <div className="w-full px-4 md:px-8 lg:px-12 space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <ProjectDetailHeader project={project} />

      <Tabs defaultValue="keys" className="space-y-8 bg-transparent">
        <div className="sticky top-16 z-10 py-4 bg-transparent backdrop-blur-sm border-b border-white/5">
          <TabsList className="h-12 p-1 bg-transparent rounded-xl border border-white/5">
            <TabsTrigger
              value="keys"
              className="rounded-lg px-6 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="rounded-lg px-6 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-lg px-6 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              Security & Logs
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-lg px-6 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Settings2 className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger
              value="catalog"
              className="rounded-lg px-6 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Globe className="h-4 w-4" />
              Catalog
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- TABS CONTENT --- */}

        <TabsContent
          value="keys"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <ProjectKeysCard project={project} onKeysRotated={loadProject} />
        </TabsContent>

        <TabsContent
          value="users"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <ProjectUsersCard projectId={projectId} />
        </TabsContent>

        {/* SECURITY & LOGS TAB (Nested Logic) */}
        <TabsContent
          value="security"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <Tabs defaultValue="audit" className="w-full space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-muted/50 border border-white/5">
                <TabsTrigger value="audit" className="gap-2 text-xs">
                  <Activity className="h-3 w-3" /> Audit Logs
                </TabsTrigger>
                <TabsTrigger value="live" className="gap-2 text-xs">
                  <Terminal className="h-3 w-3" /> Live Stream
                </TabsTrigger>
                <TabsTrigger value="webhooks" className="gap-2 text-xs">
                  <Webhook className="h-3 w-3" /> Webhooks
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="audit" className="mt-0">
              <ProjectLogsCard projectId={projectId} />
            </TabsContent>

            <TabsContent value="live" className="mt-0">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    Real-time Telemetry
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Watch authentication events stream in directly from the core
                    engine.
                  </p>
                </div>
                <LiveEventsStream projectId={projectId} />
              </div>
            </TabsContent>

            <TabsContent value="webhooks" className="mt-0">
              <ProjectWebhooksCard project={project} onUpdated={loadProject} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent
          value="settings"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <ProjectSettings project={project} onUpdated={loadProject} />
        </TabsContent>

        <TabsContent
          value="catalog"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <div className="bg-card/50 rounded-2xl border border-primary/10 overflow-hidden p-8">
            <ProvidersPage embedded={true} onUpdated={loadProject} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
