import React from "react";
import ProjectDetail from "@/components/project/details/ProjectDetail";

const ProjectDetailPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 antialiased selection:bg-black selection:text-white relative isolate">
      {/* Precision Engineering Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/30 dark:to-black/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectDetail />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
