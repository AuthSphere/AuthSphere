import React from "react";
import {
  KeyRound,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Zap,
  History,
} from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";
import { Badge } from "@/components/ui/badge";

const SessionManagement = () => {
  return (
    <article className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-3">
        <Badge
          variant="outline"
          className="bg-primary/5 text-primary border-primary/20"
        >
          Protocol: Stateless JWT / Opaque RT
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          Session lifecycle & Token Architecture
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          AuthSphere utilizes a hardened multi-token propagation model designed
          for high availability and zero-trust verification across distributed
          microservices.
        </p>
      </div>

      <div className="space-y-16">
        {/* Token Architecture */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Dual-Token propagation Model</h3>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Our architecture decouples identity assertion from session
            persistence. This allows for immediate revocation of access without
            sacrificing the performance of stateless verification.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border bg-card/50 space-y-3 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <h4 className="text-sm font-bold">Access Token (JWT)</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Short-lived (15 minutes). Signed using <strong>RS256</strong>.
                Contains user claims and scopes. Designed for high-frequency API
                authorization with zero database lookups.
              </p>
              <code className="text-[10px] text-primary/80 font-mono">
                header.payload.signature
              </code>
            </div>
            <div className="p-5 rounded-2xl border bg-card/50 space-y-3 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-blue-500" />
                <h4 className="text-sm font-bold">Refresh Token (Opaque)</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Long-lived (7 days). Fully opaque and encrypted via{" "}
                <strong>AES-256-GCM</strong> on the server. Used to negotiate
                new access tokens and rotate the session state.
              </p>
              <code className="text-[10px] text-primary/80 font-mono">
                rt_as_7721ab99...
              </code>
            </div>
          </div>
        </section>

        {/* Silent Refresh & Rotation */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <RefreshCw className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Silent Rotation Handshake</h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The SDK implementation includes a{" "}
              <strong>Proactive Refresh Listener</strong>. If an access token is
              within its renewal window (default: 60s), a silent background
              thread dispatches a rotation request. If rotation fails due to
              refresh token expiry, the <code>onSessionExpired</code>
              event is triggered.
            </p>
            <DocsCodeBlock
              id="manual-refresh"
              code={`// The SDK handles this automatically, but you can trigger it manually:\nconst isValid = await AuthSphere.ensureAuthenticated();\nif (!isValid) {\n  window.location.href = '/login';\n}`}
              language="javascript"
            />
          </div>
        </section>

        {/* Secure Termination */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
              <LogOut className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">State Termination (Logout)</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <code>AuthSphere.logout()</code> performs a destructive cleanup.
                It notifies the cluster to
                <strong>blacklist</strong> the current refresh token preventing
                any further rotations, and purges the local storage/cookie store
                on the client.
              </p>
              <div className="p-4 rounded-xl bg-muted/40 border space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Cross-Tab Synchronization
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                  The SDK uses BroadcastChannel API to ensure that logging out
                  in one tab immediately invalidates the session across all open
                  browser instances of your app.
                </p>
              </div>
            </div>
            <DocsCodeBlock
              id="logout-code"
              code={`// Perform a sign-out\nawait AuthSphere.logout();\nwindow.location.href = '/login';`}
              language="javascript"
            />
          </div>
        </section>
      </div>
    </article>
  );
};

export default SessionManagement;
