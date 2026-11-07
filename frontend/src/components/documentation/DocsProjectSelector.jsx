import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, KeyRound } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TechSeparator from "@/components/common/TechSeparator";

const DocsProjectSelector = ({
  user,
  projects,
  selectedProject,
  onSelectProject,
}) => {
  if (!user) return null;

  return (
    <div className="mb-8 rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-[#181920] border border-neutral-200 dark:border-[#2a2b33] flex items-center justify-center text-neutral-900 dark:text-white shrink-0">
          <Code2 className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
            <span>INLINE TELEMETRY</span>
            <TechSeparator />
            <span>DYNAMIC CODE SAMPLES</span>
          </div>
          <h3 className="text-xs font-mono font-bold text-neutral-900 dark:text-white mt-0.5">
            Personalized Project Variables
          </h3>
          <p className="text-[11px] text-neutral-500 font-mono">
            Code snippets below are populated with your selected project's
            public keys.
          </p>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="flex items-center gap-2 w-full md:w-auto font-mono text-xs">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider whitespace-nowrap">
            PROJECT:
          </span>
          <Select value={selectedProject?._id} onValueChange={onSelectProject}>
            <SelectTrigger className="w-full md:w-48 h-8 text-xs font-mono bg-neutral-50 dark:bg-[#181920] border-neutral-200 dark:border-[#2a2b33]">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent className="font-mono text-xs border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316]">
              {projects.map((p) => (
                <SelectItem
                  key={p._id}
                  value={p._id}
                  className="font-mono text-xs"
                >
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <Button
          size="sm"
          variant="outline"
          asChild
          className="h-8 font-mono text-xs border-neutral-200 dark:border-[#2a2b33]"
        >
          <Link to="/dashboard">Create First Project →</Link>
        </Button>
      )}
    </div>
  );
};

export default DocsProjectSelector;
