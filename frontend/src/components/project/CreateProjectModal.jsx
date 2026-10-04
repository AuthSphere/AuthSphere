import { useState, useEffect } from "react";
import { FolderPlus, X, Globe, Zap } from "lucide-react";
import { toast } from "sonner";

import { createProject } from "@/api/ProjectAPI";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CreateProjectModal = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName("");
      setRedirectUri("");
      setLoading(false);
    }
  }, [open]);

  const handleCreate = async () => {
    if (!name.trim() || !redirectUri.trim()) return;

    try {
      setLoading(true);

      const res = await createProject({
        name: name.trim(),
        redirectUris: [redirectUri.trim()],
        providers: ["google"],
      });

      if (res?.success) {
        toast.success("Project created successfully");
        setName("");
        setRedirectUri("");
        onCreated(res.data);
        onClose();
      }
    } catch {
      toast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Set up a new authentication project for your application
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <div className="relative">
              <Input
                id="name"
                autoFocus
                placeholder="My App Production"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="pl-10"
              />
              <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="redirectUri">Callback URL</Label>
            <div className="relative">
              <Input
                id="redirectUri"
                placeholder="https://app.com/callback"
                value={redirectUri}
                onChange={(e) => setRedirectUri(e.target.value)}
                disabled={loading}
                className="pl-10 font-mono text-sm"
              />
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              OAuth redirects will be locked to this domain
            </p>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg border text-sm">
            <p className="text-muted-foreground">
              Creates a dedicated AES-256 encrypted database partition for your
              users
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            onClick={handleCreate}
            disabled={loading || !name.trim() || !redirectUri.trim()}
            className="gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <FolderPlus className="h-4 w-4" />
                Create Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
