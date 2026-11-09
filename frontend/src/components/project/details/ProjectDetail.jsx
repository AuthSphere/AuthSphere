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

  if (loading) {
    return (
      <div className="min-h-120 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mb-2" />
        <p className="font-mono text-xs text-muted-foreground tracking-wider">
          Loading project...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-16 p-8 rounded-xl border border-destructive/30 bg-card text-card-foreground text-center space-y-4 shadow-sm">
        <div className="h-12 w-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Project Not Found
          </h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            {error}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs gap-2 border-border"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Dashboard
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={loadProject}
            className="font-mono text-xs gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <ProjectDetailHeader project={project} />

      <Tabs defaultValue="keys" className="space-y-6">
        <div className="sticky top-16 z-20 py-2.5 bg-background/90 backdrop-blur-md border-b border-border">
          <TabsList className="h-auto p-1 bg-muted rounded-lg border border-border flex flex-wrap gap-1">
            <TabsTrigger
              value="keys"
              className="rounded-md px-3.5 py-1.5 font-mono text-xs gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all cursor-pointer"
            >
              <Key className="h-3.5 w-3.5" />
              <span>API KEYS</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="rounded-md px-3.5 py-1.5 font-mono text-xs gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all cursor-pointer"
            >
              <Users className="h-3.5 w-3.5" />
              <span>USERS</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-md px-3.5 py-1.5 font-mono text-xs gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>SECURITY &amp; LOGS</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-md px-3.5 py-1.5 font-mono text-xs gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all cursor-pointer"
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span>SETTINGS</span>
            </TabsTrigger>
            <TabsTrigger
              value="catalog"
              className="rounded-md px-3.5 py-1.5 font-mono text-xs gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>PROVIDERS</span>
            </TabsTrigger>
          </TabsList>
        </div>

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

        <TabsContent
          value="security"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <Tabs defaultValue="audit" className="w-full space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <TabsList className="bg-muted border border-border p-1 rounded-md">
                <TabsTrigger
                  value="audit"
                  className="gap-2 font-mono text-xs data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-xs"
                >
                  <Activity className="h-3 w-3" /> Audit Trail
                </TabsTrigger>
                <TabsTrigger
                  value="live"
                  className="gap-2 font-mono text-xs data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-xs"
                >
                  <Terminal className="h-3 w-3" /> Live Events
                </TabsTrigger>
                <TabsTrigger
                  value="webhooks"
                  className="gap-2 font-mono text-xs data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-xs"
                >
                  <Webhook className="h-3 w-3" /> Webhooks
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="audit" className="mt-0">
              <ProjectLogsCard projectId={projectId} />
            </TabsContent>

            <TabsContent value="live" className="mt-0">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-emerald-500" />
                    Real-time Event Stream
                  </h3>
                  <p className="text-muted-foreground text-xs font-mono">
                    Streaming live authentication and session events for this
                    project.
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

        {/* 5. Providers Catalog */}
        <TabsContent
          value="catalog"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <div className="bg-card text-card-foreground rounded-xl border border-border overflow-hidden p-6 shadow-xs">
            <ProvidersPage embedded={true} onUpdated={loadProject} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
