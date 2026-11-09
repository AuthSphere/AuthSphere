import React from "react";
import ProjectDetail from "@/components/project/details/ProjectDetail";

const ProjectDetailPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground relative isolate">
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-background">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-muted/30 dark:to-background/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectDetail />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
