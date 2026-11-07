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
        toast.success("Cryptographic keys rotated successfully");
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
      {/* ─── MAIN COLUMN ─── */}
      <div className="flex-1 space-y-6 min-w-0 w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest flex items-center">
                <span>01</span>
                <TechSeparator />
                <span>CRYPTOGRAPHIC VAULT</span>
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              API Credentials &amp; Discovery Endpoints
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              Cryptographic client identifier, project keys, and RFC-compliant
              OpenID configuration.
            </p>
          </div>

          {/* Key Rotation Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={rotating}
                className="h-8 px-3 font-mono text-xs gap-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw
                  className={`h-3 w-3 ${rotating ? "animate-spin" : ""}`}
                />
                <span>Rotate Keys</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#0c0d10]">
              <AlertDialogHeader>
                <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <AlertDialogTitle className="text-center font-bold text-lg text-neutral-900 dark:text-white">
                  Rotate API Keys?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-xs font-mono text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  This will immediately revoke and invalidate the active public
                  key and regenerate cryptographic signing credentials. Existing
                  client sessions and integrated SDK instances must be updated
                  with the new key.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="font-mono text-xs">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRotateKeys}
                  className="font-mono text-xs bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirm Key Rotation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* ─── GRID: CLIENT ID & API REFERENCE ─── */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Card 1: Credentials */}
          <div className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="px-5 py-3 border-b border-[#eaeaea] dark:border-[#222329] flex items-center justify-between text-xs font-mono bg-neutral-50/70 dark:bg-[#14151a]">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-neutral-400" />
                <span>ACTIVE CREDENTIALS</span>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10">
                PROD
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Public Key (Client ID) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    PUBLIC_KEY (CLIENT_ID)
                  </span>
                  <span className="text-[10px] text-neutral-400">HS256</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-[#181920] rounded-lg border border-[#eaeaea] dark:border-[#26262b] font-mono text-xs">
                  <span className="text-neutral-900 dark:text-neutral-200 truncate select-all">
                    {project.publicKey}
                  </span>
                  <button
                    onClick={() => handleCopy(project.publicKey, setCopiedKey)}
                    className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors text-neutral-500 dark:text-neutral-400 ml-2 shrink-0 cursor-pointer"
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
                  <span className="text-neutral-500 dark:text-neutral-400">
                    PROJECT_ID (NAMESPACE)
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-[#181920] rounded-lg border border-[#eaeaea] dark:border-[#26262b] font-mono text-xs">
                  <span className="text-neutral-900 dark:text-neutral-200 truncate select-all">
                    {project._id}
                  </span>
                  <button
                    onClick={() => handleCopy(project._id, setCopiedId)}
                    className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors text-neutral-500 dark:text-neutral-400 ml-2 shrink-0 cursor-pointer"
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

            <div className="px-5 py-2.5 border-t border-[#eaeaea] dark:border-[#222329] bg-neutral-50/50 dark:bg-[#14151a]/50 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              Validated against RFC 7636 PKCE S256 handshake.
            </div>
          </div>

          {/* Card 2: Discovery Endpoints */}
          <div className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="px-5 py-3 border-b border-[#eaeaea] dark:border-[#222329] flex items-center justify-between text-xs font-mono bg-neutral-50/70 dark:bg-[#14151a]">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-neutral-400" />
                <span>OIDC PROTOCOL ENDPOINTS</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                PORT 443
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                  BASE AUTH URL
                </span>
                <code className="block text-xs font-mono text-neutral-900 dark:text-neutral-200 bg-neutral-50 dark:bg-[#181920] p-2.5 rounded-lg border border-[#eaeaea] dark:border-[#26262b] truncate">
                  {window.location.origin}/api/v1/auth
                </code>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                  OPENID DISCOVERY MANIFEST
                </span>
                <code className="block text-xs font-mono text-neutral-900 dark:text-neutral-200 bg-neutral-50 dark:bg-[#181920] p-2.5 rounded-lg border border-[#eaeaea] dark:border-[#26262b] truncate">
                  /.well-known/openid-configuration
                </code>
              </div>
            </div>

            <div className="px-5 py-2.5 border-t border-[#eaeaea] dark:border-[#222329] bg-neutral-50/50 dark:bg-[#14151a]/50 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
              <span>ALGORITHM: HS256</span>
              <span>FORMAT: JWT</span>
            </div>
          </div>
        </div>

        {/* ─── ENVIRONMENT VARIABLES HELPER ─── */}
        <div className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] rounded-xl shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-[#eaeaea] dark:border-[#222329] flex items-center justify-between text-xs font-mono bg-neutral-50/70 dark:bg-[#14151a]">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
              <Code2 className="h-3.5 w-3.5 text-neutral-400" />
              <span>ENVIRONMENT VARIABLES (.env)</span>
            </span>
            <button
              onClick={() =>
                handleCopy(
                  `AUTH_SPHERE_CLIENT_ID=${project.publicKey}\nAUTH_SPHERE_PROJECT_ID=${project._id}`,
                  setCopiedEnv,
                )
              }
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
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
        <div className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] rounded-xl shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-[#eaeaea] dark:border-[#222329] flex items-center justify-between text-xs font-mono bg-neutral-50/70 dark:bg-[#14151a]">
            <div className="flex items-center gap-2">
              <TerminalIcon className="h-3.5 w-3.5 text-neutral-400" />
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                CLIENT INTEGRATION SUITE
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
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
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
        <div className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] rounded-xl shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-[#eaeaea] dark:border-[#222329] flex items-center justify-between text-xs font-mono bg-neutral-50/70 dark:bg-[#14151a]">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>RUNTIME STATUS</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="p-4 space-y-3.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-500">ENVIRONMENT</span>
              <span className="font-semibold text-neutral-900 dark:text-white">
                PRODUCTION
              </span>
            </div>

            <div className="h-px bg-[#eaeaea] dark:bg-[#222329]" />

            <div>
              <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2 uppercase">
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
                      className="h-7 px-2 rounded-md border border-[#eaeaea] dark:border-[#26262b] bg-neutral-50 dark:bg-[#181920] flex items-center gap-1.5 text-[11px] font-mono text-neutral-800 dark:text-neutral-200"
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
        <div className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] rounded-xl shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-[#eaeaea] dark:border-[#222329] text-xs font-mono font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-50/70 dark:bg-[#14151a]">
            PRE-FLIGHT CHECKLIST
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
                  <div className="h-3.5 w-3.5 rounded-full border border-dashed border-neutral-400 shrink-0" />
                )}
                <span
                  className={
                    item.status
                      ? "text-neutral-900 dark:text-neutral-200"
                      : "text-neutral-400"
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
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
            <Lock className="h-3.5 w-3.5" />
            <span>SECURITY ADVISORY</span>
          </div>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
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
