import React from "react";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";

const EmptyState = ({ onCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#eaeaea] dark:border-[#222329] p-12 sm:p-16 text-center bg-white dark:bg-[#0c0d10]">
      <div className="h-12 w-12 rounded-lg border border-[#eaeaea] dark:border-[#222329] bg-neutral-50 dark:bg-[#14151a] flex items-center justify-center text-neutral-900 dark:text-white mb-4">
        <FolderPlus className="h-6 w-6" />
      </div>

      <div className="inline-flex items-center gap-2 mb-1.5">
        <span className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          ZERO NAMESPACES
        </span>
      </div>

      <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1.5">
        No active projects found
      </h3>

      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 max-w-sm leading-relaxed">
        Initialize an identity namespace to register OAuth callback URIs,
        acquire client credentials, and start securing your applications.
      </p>

      <Button
        onClick={onCreate}
        className="h-9 px-4 text-xs font-semibold bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 gap-2 cursor-pointer shadow-xs"
      >
        <FolderPlus className="h-4 w-4" />
        Create First Project
      </Button>

      <p className="mt-3 font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
        Setup time &lt; 30 seconds · PKCE enforced
      </p>
    </div>
  );
};

export default EmptyState;
