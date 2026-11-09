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
      <DialogContent className="sm:max-w-125 bg-card border border-border p-6 shadow-lg rounded-xl text-card-foreground">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              NEW NAMESPACE
            </span>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Create Identity Project
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Provision a new isolated authentication namespace and generate
            client credentials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-xs font-semibold text-foreground"
            >
              Project Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                autoFocus
                placeholder="e.g. Acme Web App"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="pl-9 h-9 text-xs bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
              <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="redirectUri"
              className="text-xs font-semibold text-foreground"
            >
              OAuth Callback URL
            </Label>
            <div className="relative">
              <Input
                id="redirectUri"
                placeholder="https://app.yourdomain.com/callback"
                value={redirectUri}
                onChange={(e) => setRedirectUri(e.target.value)}
                disabled={loading}
                className="pl-9 h-9 font-mono text-xs bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="text-[11px] font-mono text-muted-foreground">
              Strict redirect validation enforced via RFC-6749.
            </p>
          </div>

          <div className="p-3 bg-muted rounded border border-border text-xs font-mono text-muted-foreground flex items-center justify-between">
            <span>CRYPTO SCHEME</span>
            <span className="font-semibold text-foreground">
              AES-256 + PKCE SHA-256
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="h-9 px-4 text-xs font-mono border-border cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreate}
            disabled={loading || !name.trim() || !redirectUri.trim()}
            className="h-9 px-4 text-xs font-semibold gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Provisioning...</span>
              </>
            ) : (
              <>
                <FolderPlus className="h-3.5 w-3.5" />
                <span>Create Namespace</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
