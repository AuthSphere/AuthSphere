import React from "react";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";

const EmptyState = ({ onCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 sm:p-16 text-center bg-card text-card-foreground">
      <div className="h-12 w-12 rounded-lg border border-border bg-muted flex items-center justify-center text-foreground mb-4">
        <FolderPlus className="h-6 w-6" />
      </div>

      <div className="inline-flex items-center gap-2 mb-1.5">
        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          ZERO NAMESPACES
        </span>
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1.5">
        No active projects found
      </h3>

      <p className="text-xs text-muted-foreground mb-6 max-w-sm leading-relaxed">
        Initialize an identity namespace to register OAuth callback URIs,
        acquire client credentials, and start securing your applications.
      </p>

      <Button
        onClick={onCreate}
        className="h-9 px-4 text-xs font-semibold gap-2 cursor-pointer shadow-xs"
      >
        <FolderPlus className="h-4 w-4" />
        Create First Project
      </Button>

      <p className="mt-3 font-mono text-[11px] text-muted-foreground">
        Setup time &lt; 30 seconds · PKCE enforced
      </p>
    </div>
  );
};

export default EmptyState;
