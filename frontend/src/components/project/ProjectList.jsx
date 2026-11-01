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
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div className="space-y-1">
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-bold tracking-tighter px-2 h-5 bg-primary/5 text-primary border-primary/20"
          >
            Namespace Management
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Projects
          </h2>
          <p className="text-muted-foreground text-[13px] leading-relaxed">
            Manage your high-performance authentication infrastructure.
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 shadow-md shadow-primary/20"
        >
          <Plus className="h-3.5 w-3.5" />
          New Project
        </Button>
      </div>

      <Separator className="opacity-50" />

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
            className="group relative h-full min-h-[220px] rounded-xl border-2 border-dashed border-muted hover:border-primary/30 hover:bg-primary/2 flex flex-col items-center justify-center gap-4 transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all border border-transparent group-hover:border-primary/20">
              <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-bold text-[14px] uppercase tracking-widest">
                New Project
              </p>
              <p className="text-[11px] text-muted-foreground italic opacity-60">
                Deploy a fresh identity namespace
              </p>
            </div>

            {/* Industrial corner accents */}
            <div className="absolute top-2 left-2 h-2 w-2 border-t border-l border-muted group-hover:border-primary/40 transition-colors" />
            <div className="absolute top-2 right-2 h-2 w-2 border-t border-r border-muted group-hover:border-primary/40 transition-colors" />
            <div className="absolute bottom-2 left-2 h-2 w-2 border-b border-l border-muted group-hover:border-primary/40 transition-colors" />
            <div className="absolute bottom-2 right-2 h-2 w-2 border-b border-r border-muted group-hover:border-primary/40 transition-colors" />
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
