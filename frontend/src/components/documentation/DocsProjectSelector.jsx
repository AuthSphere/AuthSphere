import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DocsProjectSelector = ({
  user,
  projects,
  selectedProject,
  onSelectProject,
}) => {
  if (!user) return null;

  return (
    <div className="mb-10 p-6 rounded-2xl border bg-linear-to-br from-background to-muted/50 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top duration-500 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
          <Code2 className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Personalized Guide</h3>
          <p className="text-sm text-muted-foreground">
            The examples below are tailored to your project configuration.
          </p>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="flex items-center gap-3 w-full md:w-auto bg-background p-1.5 rounded-lg border shadow-sm">
          <span className="text-xs font-bold uppercase text-muted-foreground whitespace-nowrap px-2">
            Project:
          </span>
          <Select value={selectedProject?._id} onValueChange={onSelectProject}>
            <SelectTrigger className="w-full md:w-[200px] bg-transparent border-0 h-8 focus:ring-0">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <Button size="sm" variant="default" asChild className="shadow-md">
          <Link to="/dashboard">Create First Project</Link>
        </Button>
      )}
    </div>
  );
};

export default DocsProjectSelector;
