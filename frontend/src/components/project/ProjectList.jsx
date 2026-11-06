import React, { useState } from "react";
import { useProjects } from "@/hooks/useProjects";

import ProjectCard from "./ProjectCard";
import CreateProjectModal from "./CreateProjectModal";
import ProjectSkeleton from "./ProjectSkeleton";
import EmptyState from "./EmptyState";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

const ProjectList = () => {
  const { data: projects = [], isLoading: loading, refetch } = useProjects();
  const [createOpen, setCreateOpen] = useState(false);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectSkeleton />
        <ProjectSkeleton />
        <ProjectSkeleton />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-0.5 bg-black dark:bg-white" />
            <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              FIG. 03 // NAMESPACE MANAGEMENT
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Projects &amp; Namespaces
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Manage your isolated authentication applications, callback URIs, and
            client secrets.
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="h-9 px-4 text-xs font-semibold bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          New Project
        </Button>
      </div>

      <Separator className="bg-[#eaeaea] dark:bg-[#222329]" />

      {/* Content */}
      {projects.length === 0 ? (
        <EmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}

          {/* Create CTA */}
          <button
            onClick={() => setCreateOpen(true)}
            className="group relative h-full min-h-[180px] rounded-lg border border-dashed border-[#eaeaea] dark:border-[#26262b] hover:border-black dark:hover:border-white hover:bg-neutral-50/60 dark:hover:bg-[#121316]/50 flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer p-6"
          >
            <div className="h-10 w-10 rounded border border-[#eaeaea] dark:border-[#26262b] bg-neutral-100 dark:bg-[#1a1b20] flex items-center justify-center group-hover:scale-105 transition-all text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white">
              <Plus className="h-5 w-5" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold text-xs text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                Deploy New Project
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Fresh identity namespace &amp; keys
              </p>
            </div>

            {/* Industrial corner accents */}
            <div className="absolute top-2 left-2 h-1.5 w-1.5 border-t border-l border-neutral-300 dark:border-neutral-700 group-hover:border-black dark:group-hover:border-white transition-colors" />
            <div className="absolute top-2 right-2 h-1.5 w-1.5 border-t border-r border-neutral-300 dark:border-neutral-700 group-hover:border-black dark:group-hover:border-white transition-colors" />
            <div className="absolute bottom-2 left-2 h-1.5 w-1.5 border-b border-l border-neutral-300 dark:border-neutral-700 group-hover:border-black dark:group-hover:border-white transition-colors" />
            <div className="absolute bottom-2 right-2 h-1.5 w-1.5 border-b border-r border-neutral-300 dark:border-neutral-700 group-hover:border-black dark:group-hover:border-white transition-colors" />
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          refetch();
        }}
      />
    </section>
  );
};

export default ProjectList;
