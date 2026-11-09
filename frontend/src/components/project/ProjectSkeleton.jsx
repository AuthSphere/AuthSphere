const ProjectSkeleton = () => {
  return (
    <div className="animate-pulse bg-muted/30 rounded-lg border border-border p-6 h-[200px] flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 bg-muted rounded-lg" />
          <div className="h-5 w-14 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-3/4 bg-muted rounded" />
          <div className="h-3 w-1/2 bg-muted/50 rounded" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-3 w-1/4 bg-muted/50 rounded" />
        <div className="h-8 w-full bg-muted rounded" />
      </div>
    </div>
  );
};

export default ProjectSkeleton;
