import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";

const EmptyState = ({ onCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-16 text-center bg-muted/20">
      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-primary mb-4">
        <FolderPlus className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-bold mb-2">No projects yet</h3>

      <p className="text-muted-foreground mb-6 max-w-sm">
        Create your first authentication project to start securing your
        applications
      </p>

      <Button onClick={onCreate} className="gap-2">
        <FolderPlus className="h-4 w-4" />
        Create First Project
      </Button>

      <p className="mt-4 text-xs text-muted-foreground">
        Takes less than 30 seconds
      </p>
    </div>
  );
};

export default EmptyState;
