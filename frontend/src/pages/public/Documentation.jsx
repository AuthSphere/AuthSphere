import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Zap,
  User,
  Globe,
  Layers,
  KeyRound,
  Settings2,
  Users,
  FileJson,
  Lock,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import useAuthStore from "@/store/authStore";
import { useProjects } from "@/hooks/useProjects";

// Documentation Components
import DocsHeader from "@/components/documentation/DocsHeader";
import DocsSidebar from "@/components/documentation/DocsSidebar";
import DocsProjectSelector from "@/components/documentation/DocsProjectSelector";

// Documentation Sections
import Introduction from "@/components/documentation/sections/Introduction";
import QuickStart from "@/components/documentation/sections/QuickStart";
import LocalAuth from "@/components/documentation/sections/LocalAuth";
import SocialLogin from "@/components/documentation/sections/SocialLogin";
import Frameworks from "@/components/documentation/sections/Frameworks";
import SessionManagement from "@/components/documentation/sections/SessionManagement";
import Configuration from "@/components/documentation/sections/Configuration";
import UserManagement from "@/components/documentation/sections/UserManagement";
import ApiReference from "@/components/documentation/sections/ApiReference";
import Security from "@/components/documentation/sections/Security";
import ErrorHandling from "@/components/documentation/sections/ErrorHandling";

const Documentation = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: projects = [] } = useProjects({ enabled: Boolean(user) });
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const selectedProject =
    projects.find((p) => p._id === selectedProjectId) || projects[0] || null;

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: BookOpen,
      component: Introduction,
    },
    {
      id: "quick-start",
      title: "Quick Start",
      icon: Zap,
      component: QuickStart,
    },
    {
      id: "local-auth",
      title: "Local Authentication",
      icon: User,
      component: LocalAuth,
    },
    {
      id: "authentication",
      title: "Social Login",
      icon: Globe,
      component: SocialLogin,
    },
    {
      id: "frameworks",
      title: "Framework Integration",
      icon: Layers,
      component: Frameworks,
    },
    {
      id: "session-management",
      title: "Session Management",
      icon: KeyRound,
      component: SessionManagement,
    },
    {
      id: "configuration",
      title: "Configuration",
      icon: Settings2,
      component: Configuration,
    },
    {
      id: "user-management",
      title: "User Management",
      icon: Users,
      component: UserManagement,
    },
    {
      id: "api-reference",
      title: "API Reference",
      icon: FileJson,
      component: ApiReference,
    },
    { id: "security", title: "Security", icon: Lock, component: Security },
    {
      id: "errors",
      title: "Error Handling",
      icon: AlertCircle,
      component: ErrorHandling,
    },
  ];

  const currentHash = location.hash ? location.hash.replace("#", "") : "";
  const validSectionIds = sections.map((s) => s.id);
  const activeSection = validSectionIds.includes(currentHash)
    ? currentHash
    : "introduction";

  const navigateTo = (id) => {
    navigate(`/docs#${id}`);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentIndex = sections.findIndex((s) => s.id === activeSection);
  const prevSection = sections[currentIndex - 1];
  const nextSection = sections[currentIndex + 1];

  const ActiveComponent = sections[currentIndex].component;
  const projectProps = {
    publicKey: selectedProject?.publicKey || "YOUR_PUBLIC_KEY",
    projectId: selectedProject?._id || "YOUR_PROJECT_ID",
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased relative isolate selection:bg-primary selection:text-primary-foreground">
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-background">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-muted/40 dark:to-black/60" />
      </div>

      <DocsHeader
        sections={sections}
        activeSection={activeSection}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="max-w-7xl mx-auto flex items-start">
        <DocsSidebar
          sections={sections}
          activeSection={activeSection}
          onNavigate={navigateTo}
          isOpen={isSidebarOpen}
        />

        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 min-w-0">
          <DocsProjectSelector
            user={user}
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={(val) => setSelectedProjectId(val)}
          />

          {/* Render Active Section Content */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            <ActiveComponent {...projectProps} />
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevSection ? (
              <button
                onClick={() => navigateTo(prevSection.id)}
                className="flex flex-col items-start p-4 rounded-xl border border-border bg-card hover:border-foreground/40 transition-all text-left group cursor-pointer shadow-xs"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
                  <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                  PREVIOUS SECTION
                </span>
                <span className="font-mono text-xs font-bold text-foreground">
                  {prevSection.title}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextSection && (
              <button
                onClick={() => navigateTo(nextSection.id)}
                className="flex flex-col items-end p-4 rounded-xl border border-border bg-card hover:border-foreground/40 transition-all text-right group cursor-pointer shadow-xs"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
                  NEXT SECTION
                  <ArrowLeft className="h-3 w-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="font-mono text-xs font-bold text-foreground">
                  {nextSection.title}
                </span>
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Documentation;
