import { useState } from "react";
import { addWebhook, deleteWebhook, testWebhook } from "@/api/ProjectAPI";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Webhook,
  Plus,
  Trash2,
  Key,
  Globe,
  CheckCircle2,
  Check,
  Info,
  ShieldCheck,
  Zap,
  Activity,
  RefreshCw,
  Send,
  Lock,
  AlertCircle,
  Copy,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/ui/terminal";

const AVAILABLE_EVENTS = [
  {
    id: "user.registered",
    label: "User Registered",
    description:
      "Triggered when a new user successfully completes registration",
    icon: "👤",
  },
  {
    id: "user.login",
    label: "User Login",
    description: "Fired each time a user authenticates successfully",
    icon: "🔓",
  },
  {
    id: "user.deleted",
    label: "User Deleted",
    description: "Sent when a user account is permanently removed",
    icon: "🗑️",
  },
  {
    id: "api_key.rotated",
    label: "API Key Rotated",
    description: "Notifies when project API keys are regenerated for security",
    icon: "🔄",
  },
];

const ProjectWebhooksCard = ({ project, onUpdated }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState(["user.registered"]);

  // Test State
  const [testWebhookId, setTestWebhookId] = useState(null);
  const [testEvent, setTestEvent] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!url) return toast.error("Please enter a webhook URL");
    if (selectedEvents.length === 0)
      return toast.error("Select at least one event");

    try {
      setLoading(true);
      await addWebhook(project._id, { url, events: selectedEvents });
      toast.success("Webhook registered successfully");
      setUrl("");
      setSelectedEvents(["user.registered"]);
      setIsAdding(false);
      onUpdated();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (webhookId) => {
    if (!window.confirm("Are you sure you want to delete this webhook?"))
      return;

    try {
      await deleteWebhook(project._id, webhookId);
      toast.success("Webhook deleted");
      onUpdated();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTest = async () => {
    if (!testEvent) return toast.error("Please select an event type");

    try {
      setTesting(true);
      setTestResult(null);
      const res = await testWebhook(project._id, testWebhookId, testEvent);
      setTestResult({ success: true, message: res.message });
      toast.success("Test payload sent!");
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message || "Failed to send payload",
        details: error.details,
      });
      toast.error("Test delivery failed");
    } finally {
      setTesting(false);
    }
  };

  const openTestDialog = (webhook) => {
    setTestWebhookId(webhook._id);
    // Default to first available event or generic
    setTestEvent(webhook.events[0] || "user.registered");
    setTestResult(null);
  };

  const toggleEvent = (eventId) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId],
    );
  };

  const copySecret = (secret) => {
    navigator.clipboard.writeText(secret);
    toast.success("Signing secret copied to clipboard");
  };

  const currentTestWebhook = project.webhooks?.find(
    (w) => w._id === testWebhookId,
  );

  return (
    <div className="space-y-8">
      {/* Test Dialog */}
      <Dialog
        open={!!testWebhookId}
        onOpenChange={(open) => !open && setTestWebhookId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Test Webhook Delivery
            </DialogTitle>
            <DialogDescription>
              Send a mock event payload to verify your endpoint configuration.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Target URL</Label>
              <div className="p-2 bg-muted rounded border text-xs font-mono break-all text-muted-foreground">
                {currentTestWebhook?.url || "Loading..."}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select value={testEvent} onValueChange={setTestEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event to simulate" />
                </SelectTrigger>
                <SelectContent>
                  {currentTestWebhook?.events.map((ev) => {
                    const info = AVAILABLE_EVENTS.find((e) => e.id === ev);
                    return (
                      <SelectItem key={ev} value={ev}>
                        <div className="flex items-center gap-2">
                          <span>{info?.icon || "⚡"}</span>
                          <span>{info?.label || ev}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {testResult && (
              <div
                className={`p-4 rounded-lg text-xs leading-relaxed border ${testResult.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-destructive/10 border-destructive/20 text-destructive"}`}
              >
                <div className="font-semibold mb-1 flex items-center gap-2">
                  {testResult.success ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {testResult.success
                    ? "Delivery Successful"
                    : "Delivery Failed"}
                </div>
                <div>{testResult.message}</div>
                {testResult.details && (
                  <pre className="mt-2 p-2 bg-black/10 rounded overflow-x-auto">
                    {JSON.stringify(testResult.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTestWebhookId(null)}>
              Close
            </Button>
            <Button onClick={handleTest} disabled={testing} className="gap-2">
              {testing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send Test Payload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── HEADER SECTION ─── */}
      <div className="border border-border bg-card text-card-foreground rounded-xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between text-xs font-mono bg-muted/50">
          <span className="font-semibold text-foreground flex items-center gap-2">
            <Webhook className="h-4 w-4 text-emerald-500" />
            <span>EVENT DISPATCH &amp; WEBHOOK MATRIX</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            SPEC: HMAC SHA-256
          </span>
        </div>
        <div className="p-6 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Webhook Dispatch Endpoints
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Register HTTP destination endpoints to receive signed real-time
              event payloads from AuthSphere Core without polling.
            </p>
          </div>
          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              className="font-mono text-xs gap-1.5 h-9 px-4 cursor-pointer shadow-sm shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Endpoint</span>
            </Button>
          )}
        </div>
      </div>

      {/* What Are Webhooks - Educational Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">What Are Webhooks?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Webhooks are "reverse APIs" — instead of your application
                  requesting data from AuthSphere, we push event data to your
                  server the moment something happens. This eliminates the need
                  for constant polling.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Why Use Them?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Build real-time integrations: sync user data to your CRM, send
                  welcome emails instantly, update analytics dashboards, or
                  trigger custom workflows — all with zero latency.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Security Built-In</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every webhook request includes an HMAC-SHA256 signature in the{" "}
                  <code className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">
                    X-AuthSphere-Signature
                  </code>{" "}
                  header. Verify it using your signing secret to ensure
                  authenticity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Webhook Form */}
      {isAdding && (
        <Card className="bg-card/30 border-primary/30 shadow-lg">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Register New Webhook Endpoint
            </CardTitle>
            <CardDescription className="text-sm mt-2">
              Configure the URL where you want to receive event notifications
              and select which events to subscribe to.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleAdd} className="space-y-6">
              {/* URL Input */}
              <div className="space-y-3">
                <Label htmlFor="url" className="text-sm font-semibold">
                  Endpoint URL
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="url"
                    placeholder="https://api.yourapp.com/webhooks/authsphere"
                    className="pl-10 font-mono text-sm bg-background/50"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                    <span className="font-semibold text-foreground">
                      What happens:
                    </span>{" "}
                    AuthSphere will send HTTP POST requests to this URL whenever
                    subscribed events occur.
                  </p>
                  <Separator className="my-2 bg-blue-500/20" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">
                      Requirements:
                    </span>{" "}
                    Must be a publicly accessible HTTPS endpoint that returns a{" "}
                    <code className="px-1 py-0.5 bg-muted rounded font-mono text-[10px]">
                      200 OK
                    </code>{" "}
                    status within 5 seconds.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Event Selection */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">
                    Subscribe to Events
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose which authentication events should trigger
                    notifications to your endpoint. Select only the events your
                    application needs to process.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {AVAILABLE_EVENTS.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => toggleEvent(event.id)}
                      className={`group flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedEvents.includes(event.id)
                          ? "bg-primary/5 border-primary/50 shadow-sm"
                          : "hover:bg-muted/30 border-border/50"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                          selectedEvents.includes(event.id)
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/30 group-hover:border-primary/50"
                        }`}
                      >
                        {selectedEvents.includes(event.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{event.icon}</span>
                          <span className="text-sm font-semibold">
                            {event.label}
                          </span>
                          <code className="text-[10px] font-mono px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                            {event.id}
                          </code>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setUrl("");
                    setSelectedEvents(["user.registered"]);
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Register Webhook
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Active Webhooks List */}
      <Card className="bg-card/30 border-border/50">
        <CardHeader className="border-b">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Active Endpoints
            {project.webhooks?.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {project.webhooks.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-xs">
            Manage your registered webhook endpoints and their event
            subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {project.webhooks?.length > 0 ? (
            <div className="space-y-3">
              {project.webhooks.map((webhook) => (
                <div
                  key={webhook._id}
                  className="group p-5 rounded-xl border border-border/50 bg-background/30 hover:bg-muted/20 transition-all"
                >
                  <div className="space-y-4">
                    {/* URL and Status */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4 text-primary shrink-0" />
                          <code className="font-mono text-sm font-semibold truncate text-primary">
                            {webhook.url}
                          </code>
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shrink-0"
                          >
                            ● Active
                          </Badge>
                        </div>

                        {/* Events */}
                        <div className="flex flex-wrap gap-1.5">
                          {webhook.events.map((ev) => {
                            const eventInfo = AVAILABLE_EVENTS.find(
                              (e) => e.id === ev,
                            );
                            return (
                              <Badge
                                key={ev}
                                variant="outline"
                                className="text-[10px] font-normal px-2 py-0.5 border-primary/30 bg-primary/5"
                              >
                                {eventInfo?.icon} {ev}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openTestDialog(webhook)}
                          className="text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors shrink-0"
                          title="Test Delivery"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(webhook._id)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Signing Secret */}
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Lock className="h-4 w-4 text-amber-600" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                            Signing Secret
                          </p>
                          <code className="text-xs font-mono text-foreground">
                            {webhook.secret.substring(0, 12)}...
                            {webhook.secret.substring(
                              webhook.secret.length - 4,
                            )}
                          </code>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copySecret(webhook.secret)}
                        className="gap-2 text-xs"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                    </div>

                    <div className="p-2 bg-amber-500/5 rounded border border-amber-500/20">
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-foreground">
                          Security:
                        </span>{" "}
                        Use this secret to verify webhook signatures. Never
                        expose it publicly or commit it to version control.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Webhook className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No webhook endpoints configured
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2 max-w-sm">
                Register your first webhook endpoint to start receiving
                real-time event notifications from AuthSphere.
              </p>
              {!isAdding && (
                <Button
                  onClick={() => setIsAdding(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2 mt-6"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Webhook
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Implementation Guide */}
      <Card className="bg-card/30 border-border/50">
        <CardHeader className="border-b">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Implementation Guide
          </CardTitle>
          <CardDescription className="text-xs">
            Step-by-step instructions for integrating webhooks into your
            application.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Checklist */}
          <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
            <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Integration Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  step: "Create a public HTTPS endpoint",
                  detail: "Must accept POST requests and return 200 OK",
                },
                {
                  step: "Parse the JSON payload",
                  detail: "Extract event data from the request body",
                },
                {
                  step: "Verify the signature header",
                  detail: "Use HMAC-SHA256 with your signing secret",
                },
                {
                  step: "Respond quickly (< 5 seconds)",
                  detail: "Acknowledge receipt, then process async",
                },
                {
                  step: "Handle duplicate events",
                  detail: "Use event IDs for idempotency",
                },
                {
                  step: "Subscribe to relevant events only",
                  detail: "Reduce noise and processing overhead",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {item.step}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payload Structure */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Webhook Payload Structure
            </h4>
            <div className="p-4 bg-muted/30 rounded-lg border font-mono text-xs">
              <pre className="text-muted-foreground leading-relaxed">
                {`{
  "event": "user.registered",
  "timestamp": "2024-02-14T10:30:00Z",
  "data": {
    "userId": "usr_abc123",
    "email": "user@example.com",
    "username": "johndoe",
    "projectId": "proj_xyz789"
  }
}`}
              </pre>
            </div>
            <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">
                  Structure:
                </span>{" "}
                All webhooks include an{" "}
                <code className="px-1 py-0.5 bg-muted rounded font-mono text-[10px]">
                  event
                </code>{" "}
                type,{" "}
                <code className="px-1 py-0.5 bg-muted rounded font-mono text-[10px]">
                  timestamp
                </code>
                , and event-specific{" "}
                <code className="px-1 py-0.5 bg-muted rounded font-mono text-[10px]">
                  data
                </code>{" "}
                object.
              </p>
            </div>
          </div>

          <Separator />

          {/* Signature Verification */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              Signature Verification (Node.js)
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Verify that webhook requests are authentic by validating the HMAC
              signature in the{" "}
              <code className="px-1 py-0.5 bg-muted rounded font-mono text-[10px]">
                X-AuthSphere-Signature
              </code>{" "}
              header.
            </p>

            <Terminal
              copyable
              codeToCopy={`const crypto = require("crypto");

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(JSON.stringify(payload)).digest("hex");
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// Usage in your endpoint
app.post("/webhooks/authsphere", (req, res) => {
  const signature = req.headers["x-authsphere-signature"];
  const payload = req.body;
  const secret = process.env.WEBHOOK_SECRET;
  
  if (!verifyWebhookSignature(payload, signature, secret)) {
    return res.status(401).send("Invalid signature");
  }
  
  // Process the webhook event
  console.log("Event received:", payload.event);
  
  res.status(200).send("OK");
});`}
              className="max-w-none bg-black/90 backdrop-blur-xl border-white/10 shadow-2xl"
              startOnView={false}
            >
              <TypingAnimation className="text-cyan-400 font-bold">
                $ node webhook-server.js
              </TypingAnimation>

              <AnimatedSpan className="text-zinc-500 italic">
                <span># Webhook signature verification example</span>
              </AnimatedSpan>

              <AnimatedSpan className="text-slate-300">
                <pre className="font-mono text-[12px] leading-relaxed">
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-blue-300">crypto</span>{" "}
                  <span className="text-purple-400">= require</span>(
                  <span className="text-emerald-400">"crypto"</span>);
                  {"\n\n"}
                  <span className="text-purple-400">function</span>{" "}
                  <span className="text-yellow-300">
                    verifyWebhookSignature
                  </span>
                  ( payload, signature, secret) {"{"}
                  {"\n  "}
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-blue-300">hmac</span> =
                  crypto.createHmac(
                  <span className="text-emerald-400">"sha256"</span>, secret);
                  {"\n  "}
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-blue-300">digest</span> =
                  hmac.update(JSON.stringify(payload)).digest(
                  <span className="text-emerald-400">"hex"</span>);
                  {"\n  \n  "}
                  <span className="text-purple-400">return</span>{" "}
                  crypto.timingSafeEqual(
                  {"\n    "}
                  Buffer.from(signature),
                  {"\n    "}
                  Buffer.from(digest)
                  {"\n  "});
                  {"\n"}
                  {"}"}
                </pre>
              </AnimatedSpan>
            </Terminal>
          </div>

          {/* Best Practices */}
          <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">
                  Security Best Practices
                </h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 shrink-0">•</span>
                    <span>
                      Always verify the signature before processing webhook data
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 shrink-0">•</span>
                    <span>
                      Store signing secrets in environment variables, never in
                      code
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 shrink-0">•</span>
                    <span>
                      Use HTTPS endpoints only (HTTP is not supported)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 shrink-0">•</span>
                    <span>
                      Implement retry logic with exponential backoff for failed
                      processing
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 shrink-0">•</span>
                    <span>
                      Log webhook events for debugging and audit trails
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectWebhooksCard;
