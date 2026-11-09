import React, { useState } from "react";
import {
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  Globe,
  ShieldCheck,
  AlertTriangle,
  Code2,
  Terminal as TerminalIcon,
  CheckCircle2,
  Lock,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { rotateProjectKeys } from "@/api/ProjectAPI";
import { allProvidersList } from "@/lib/providers";
import TechSeparator from "@/components/common/TechSeparator";

const ProjectKeysCard = ({ project, onKeysRotated }) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [codeTab, setCodeTab] = useState("npm");
  const [rotating, setRotating] = useState(false);

  const handleCopy = async (text, setter) => {
    await navigator.clipboard.writeText(text);
    setter(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setter(false), 2000);
  };

  const handleRotateKeys = async () => {
    try {
      setRotating(true);
      const res = await rotateProjectKeys(project._id);
      if (res.success) {
        toast.success("API keys rotated successfully");
        onKeysRotated?.();
      } else {
        toast.error(res.message || "Failed to rotate keys");
      }
    } catch (err) {
      toast.error(err.message || "Server error while rotating keys");
    } finally {
      setRotating(false);
    }
  };

  const getCodeSnippet = () => {
    if (codeTab === "npm") {
      return `npm install @authspherejs/sdk`;
    }
    if (codeTab === "pnpm") {
      return `pnpm add @authspherejs/sdk`;
    }
    if (codeTab === "react") {
      return `import { AuthSphereProvider } from "@authspherejs/react";

export function App() {
  return (
    <AuthSphereProvider
      projectId="${project._id}"
      publicKey="${project.publicKey}"
      redirectUri={window.location.origin + "/callback"}
    >
      <YourApp />
    </AuthSphereProvider>
  );
}`;
    }
    return `curl -X POST "${window.location.origin}/api/v1/auth/token" \\
  -H "Content-Type: application/json" \\
  -d '{"client_id": "${project.publicKey}", "grant_type": "authorization_code"}'`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start mt-2">
      <div className="flex-1 space-y-6 min-w-0 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              API Credentials &amp; Discovery Endpoints
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              Client identifier, project keys, and OpenID configuration
              endpoints.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={rotating}
                className="h-8 px-3 font-mono text-xs gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw
                  className={`h-3 w-3 ${rotating ? "animate-spin" : ""}`}
                />
                <span>Rotate Keys</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border border-border bg-card text-card-foreground">
              <AlertDialogHeader>
                <div className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <AlertDialogTitle className="text-center font-bold text-lg text-foreground">
                  Rotate API Keys?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-xs font-mono text-muted-foreground leading-relaxed">
                  This will immediately invalidate the active API keys and
                  generate new credentials. Existing client integrations will
                  need to be updated with the new key.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="font-mono text-xs">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRotateKeys}
                  className="font-mono text-xs bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Confirm Key Rotation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* ─── GRID: CLIENT ID & API REFERENCE ─── */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="border border-border bg-card text-card-foreground rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between text-xs font-mono bg-muted/50">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                <span>ACTIVE CREDENTIALS</span>
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">
                    PUBLIC KEY (CLIENT ID)
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-muted/60 rounded-lg border border-border font-mono text-xs">
                  <span className="text-foreground truncate select-all">
                    {project.publicKey}
                  </span>
                  <button
                    onClick={() => handleCopy(project.publicKey, setCopiedKey)}
                    className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground ml-2 shrink-0 cursor-pointer"
                    title="Copy Public Key"
                  >
                    {copiedKey ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Project ID */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">PROJECT ID</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-muted/60 rounded-lg border border-border font-mono text-xs">
                  <span className="text-foreground truncate select-all">
                    {project._id}
                  </span>
                  <button
                    onClick={() => handleCopy(project._id, setCopiedId)}
                    className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground ml-2 shrink-0 cursor-pointer"
                    title="Copy Project ID"
                  >
                    {copiedId ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="px-5 py-2.5 border-t border-border bg-muted/30 text-[11px] font-mono text-muted-foreground">
              Configured for OAuth 2.0 PKCE authentication.
            </div>
          </div>

          {/* Card 2: Discovery Endpoints */}
          <div className="border border-border bg-card text-card-foreground rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between text-xs font-mono bg-muted/50">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                <span>OIDC PROTOCOL ENDPOINTS</span>
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-muted-foreground">
                  BASE AUTH URL
                </span>
                <code className="block text-xs font-mono text-foreground bg-muted/60 p-2.5 rounded-lg border border-border truncate">
                  {window.location.origin}/api/v1/auth
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* ─── ENVIRONMENT VARIABLES HELPER ─── */}
        <div className="border border-border bg-card text-card-foreground rounded-xl shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between text-xs font-mono bg-muted/50">
            <span className="font-semibold text-foreground flex items-center gap-2">
              <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span>ENVIRONMENT VARIABLES (.env)</span>
            </span>
            <button
              onClick={() =>
                handleCopy(
                  `AUTH_SPHERE_CLIENT_ID=${project.publicKey}\nAUTH_SPHERE_PROJECT_ID=${project._id}`,
                  setCopiedEnv,
                )
              }
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {copiedEnv ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>COPY ALL</span>
                </>
              )}
            </button>
          </div>

          <div className="p-5">
            <div className="relative group bg-[#0a0b0e] rounded-lg p-4 font-mono text-xs text-neutral-300 border border-[#22242c] space-y-1.5 overflow-x-auto">
              <div className="text-neutral-500">
                # AuthSphere Project Credentials
              </div>
              <div>
                <span className="text-neutral-400">AUTH_SPHERE_CLIENT_ID=</span>
                <span className="text-emerald-400 font-semibold">
                  "{project.publicKey}"
                </span>
              </div>
              <div>
                <span className="text-neutral-400">
                  AUTH_SPHERE_PROJECT_ID=
                </span>
                <span className="text-emerald-400 font-semibold">
                  "{project._id}"
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── QUICK INTEGRATION SDK HUB ─── */}
        <div className="border border-border bg-card text-card-foreground rounded-xl shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between text-xs font-mono bg-muted/50">
            <div className="flex items-center gap-2">
              <TerminalIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold text-foreground">
                SDK QUICK START
              </span>
            </div>
            {/* Tabs */}
            <div className="flex items-center gap-1">
              {["npm", "pnpm", "react", "curl"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCodeTab(tab)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer uppercase ${
                    codeTab === tab
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            <div className="relative group bg-[#0a0b0e] rounded-lg p-4 font-mono text-xs text-neutral-300 border border-[#22242c] overflow-x-auto">
              <button
                onClick={() => handleCopy(getCodeSnippet(), setCopiedCode)}
                className="absolute top-3 right-3 p-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Copy snippet"
              >
                {copiedCode ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              <pre className="text-xs font-mono leading-relaxed text-neutral-200">
                {getCodeSnippet()}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SIDEBAR COLUMN ─── */}
      <aside className="w-full lg:w-72 shrink-0 space-y-5 lg:sticky lg:top-24">
        {/* Runtime Checklist */}
        <div className="border border-border bg-card text-card-foreground rounded-xl shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between text-xs font-mono bg-muted/50">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>RUNTIME STATUS</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="p-4 space-y-3.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">ENVIRONMENT</span>
              <span className="font-semibold text-foreground">PRODUCTION</span>
            </div>

            <div className="h-px bg-border" />

            <div>
              <p className="text-[11px] font-mono text-muted-foreground mb-2 uppercase">
                ACTIVE PROVIDERS ({project.providers?.length || 0})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.providers?.map((providerId) => {
                  const p = allProvidersList.find(
                    (item) => item.id === providerId,
                  );
                  return (
                    <div
                      key={providerId}
                      className="h-7 px-2 rounded-md border border-border bg-muted/60 flex items-center gap-1.5 text-[11px] font-mono text-foreground"
                      title={p?.name || providerId}
                    >
                      {p?.logo && (
                        <img
                          src={p.logo}
                          alt={providerId}
                          className="h-3.5 w-3.5 object-contain"
                        />
                      )}
                      <span>{p?.name || providerId}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="border border-border bg-card text-card-foreground rounded-xl shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-border text-xs font-mono font-semibold text-foreground bg-muted/50">
            SETUP CHECKLIST
          </div>
          <div className="p-4 space-y-2.5 font-mono text-xs">
            {[
              {
                label: "Public Key Generated",
                status: Boolean(project.publicKey),
              },
              {
                label: "Allowed Redirect URIs",
                status: project.redirectUris?.length > 0,
              },
              {
                label: "CORS Allowed Origins",
                status: project.allowedOrigins?.length > 0,
              },
              {
                label: "Identity Providers Enrolled",
                status: project.providers?.length > 0,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px]">
                {item.status ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <div className="h-3.5 w-3.5 rounded-full border border-dashed border-muted-foreground shrink-0" />
                )}
                <span
                  className={
                    item.status ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Advisory */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs font-mono space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
            <Lock className="h-3.5 w-3.5" />
            <span>SECURITY ADVISORY</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Never expose secret tokens in front-end repositories. AuthSphere
            PKCE ensures client keys can safely initiate auth flows without
            secrets.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default ProjectKeysCard;
