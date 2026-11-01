import { useState } from "react";
import {
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  Globe,
  ShieldCheck,
  AlertTriangle,
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
import { Separator } from "@/components/ui/separator";
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
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/ui/terminal";
import { allProvidersList } from "@/lib/providers";

const ProjectKeysCard = ({ project, onKeysRotated }) => {
  const [copied, setCopied] = useState(false);
  const [rotating, setRotating] = useState(false);

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRotateKeys = async () => {
    try {
      setRotating(true);
      const res = await rotateProjectKeys(project._id);
      if (res.success) {
        toast.success("Keys rotated successfully");
        onKeysRotated?.();
      } else {
        toast.error(res.message || "Failed to rotate keys");
      }
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setRotating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start mt-2">
      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              API Credentials
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Security identifiers for integrating AuthSphere.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={rotating}
                className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/5"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${rotating ? "animate-spin" : ""}`}
                />
                Rotate Keys
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <AlertDialogTitle className="text-center">
                  Rotate API Keys?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  This will invalidate all existing sessions and generate new
                  keys. Any applications using the current keys will stop
                  working immediately. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRotateKeys}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Rotate Keys
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Keys + API Reference */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Keys */}
          <Card className="bg-card/30 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Keys</CardTitle>
              <CardDescription className="text-xs">
                Public key and project identifier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium">
                    Public Key (Client ID)
                  </label>
                  <Badge variant="outline" className="text-[10px]">
                    Production
                  </Badge>
                </div>
                <div className="group flex items-center gap-2 p-2.5 bg-muted/30 rounded-lg border font-mono text-xs">
                  <KeyRound className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="flex-1 truncate select-all">
                    {project.publicKey}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(project.publicKey)}
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Project ID</label>
                <div className="group flex items-center gap-2 p-2.5 bg-muted/30 rounded-lg border font-mono text-xs">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="flex-1 truncate select-all">
                    {project._id}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(project._id)}
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Reference */}
          <Card className="bg-card/30 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">API Reference</CardTitle>
              <CardDescription className="text-xs">
                Endpoints for authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">
                  Base Auth URL
                </span>
                <code className="block text-xs font-mono text-foreground bg-muted/30 px-2.5 py-2 rounded-lg border truncate">
                  {window.location.origin}/api/v1/auth
                </code>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">
                  Discovery URL
                </span>
                <code className="block text-xs font-mono text-foreground bg-muted/30 px-2.5 py-2 rounded-lg border">
                  /.well-known/openid-configuration
                </code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* .env Helper */}
        <Card className="bg-card/30 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Environment Variables</CardTitle>
            <CardDescription className="text-xs">
              Add to your <code className="bg-muted px-1 rounded">.env</code>{" "}
              file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative group bg-zinc-950 rounded-lg p-4 font-mono text-xs text-zinc-400 space-y-1">
              <button
                onClick={() =>
                  handleCopy(
                    `AUTH_SPHERE_CLIENT_ID=${project.publicKey}\nAUTH_SPHERE_PROJECT_ID=${project._id}`,
                  )
                }
                className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 rounded"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <div>
                AUTH_SPHERE_CLIENT_ID=
                <span className="text-emerald-400">{project.publicKey}</span>
              </div>
              <div>
                AUTH_SPHERE_PROJECT_ID=
                <span className="text-emerald-400">{project._id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SDK Integration */}
        <Card className="bg-card/30 border-border/50">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm">Quick Integration</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Initialize the AuthSphere SDK in your app
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px]">
              SDK v2.1.0
            </Badge>
          </CardHeader>
          <CardContent>
            <Terminal
              copyable
              codeToCopy={`import AuthSphere from "@authspherejs/sdk";\n\nAuthSphere.initAuth({\n  publicKey: "${project.publicKey}",\n  projectId: "${project._id}",\n  redirectUri: window.location.origin + "/callback",\n  baseUrl: "https://auth-sphere-6s2v.vercel.app"\n});`}
              className="max-w-none bg-zinc-950 border-border/50"
              startOnView={false}
            >
              <TypingAnimation className="text-cyan-400">
                $ npm install @authspherejs/sdk
              </TypingAnimation>

              <AnimatedSpan className="text-zinc-500">
                <span># Initialize SDK</span>
              </AnimatedSpan>

              <AnimatedSpan className="text-slate-300">
                <pre className="font-mono text-[13px] leading-relaxed">
                  <span className="text-purple-400">import</span>{" "}
                  <span className="text-blue-300">AuthSphere</span>{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-emerald-400">"@authspherejs/sdk"</span>;
                  {"\n\n"}
                  <span className="text-blue-300">AuthSphere</span>.
                  <span className="text-yellow-300">initAuth</span>({`{`}
                  {"\n  "}publicKey:{" "}
                  <span className="text-emerald-400">
                    "{project.publicKey}"
                  </span>
                  ,{"\n  "}projectId:{" "}
                  <span className="text-emerald-400">"{project._id}"</span>,
                  {"\n  "}redirectUri:{" "}
                  <span className="text-emerald-400">
                    "window.location.origin + '/callback'"
                  </span>
                  ,{`\n}`});
                </pre>
              </AnimatedSpan>
            </Terminal>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <aside className="w-full lg:w-64 shrink-0 space-y-5 lg:sticky lg:top-24">
        {/* Deployment Status */}
        <Card className="bg-card/30 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium">Live in Production</span>
            </div>

            <Separator />

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Active Providers
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.providers?.map((providerId) => {
                  const p = allProvidersList.find(
                    (item) => item.id === providerId,
                  );
                  return (
                    <div
                      key={providerId}
                      className="h-7 w-7 rounded-md border bg-background flex items-center justify-center p-1.5"
                      title={p?.name || providerId}
                    >
                      <img
                        src={p?.logo}
                        alt={providerId}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Checklist */}
        <Card className="bg-card/30 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Setup Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { label: "Public Key Generated", status: true },
              {
                label: "URIs Whitelisted",
                status: project.redirectUris?.length > 0,
              },
              {
                label: "Origins Configured",
                status: project.allowedOrigins?.length > 0,
              },
              {
                label: "Providers Enabled",
                status: project.providers?.length > 0,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs">
                {item.status ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <div className="h-3.5 w-3.5 rounded-full border border-dashed border-muted-foreground/30 shrink-0" />
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
          </CardContent>
        </Card>

        {/* Security Note */}
        <Card className="bg-amber-500/5 border-amber-500/10">
          <CardContent className="p-4">
            <div className="flex gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Never expose backend secrets in client-side code.
                </p>
                <Button
                  variant="link"
                  className="text-[10px] h-auto p-0 text-amber-600"
                >
                  Security Best Practices →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
};

export default ProjectKeysCard;
