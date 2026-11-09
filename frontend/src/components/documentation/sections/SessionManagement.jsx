import React from "react";
import {
  KeyRound,
  RefreshCw,
  LogOut,
  ShieldCheck,
  History,
  Zap,
} from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";
import TechSeparator from "@/components/common/TechSeparator";

const SessionManagement = () => {
  return (
    <article className="space-y-8 text-foreground font-sans">
      {/* Eyebrow Header */}
      <div className="border-b border-border pb-4 space-y-2">
        <div className="flex items-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
          <span>06</span>
          <TechSeparator />
          <span>SESSION LIFECYCLE</span>
          <TechSeparator />
          <span>TOKENS &amp; ROTATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Session Tokens &amp; Rotation Mechanics
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed max-w-2xl">
          How AuthSphere combines short-lived stateless JWTs with opaque,
          server-revocable refresh tokens.
        </p>
      </div>

      <div className="space-y-8">
        {/* Token Specs */}
        <section className="space-y-4">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <span>[01]</span>
            <span>The Dual-Token Architecture</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground">
                  Access Token (JWT)
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  15 MIN LIFETIME
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                HMAC-SHA256 (HS256) token containing user claims (sub, email,
                username) and project ID. Designed for stateless API
                verification across your services.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground">
                  Refresh Token (Opaque)
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  7 DAYS TTL
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                High-entropy 40-byte random hex string stored in MongoDB with
                native TTL index. Used exclusively to rotate access tokens.
              </p>
            </div>
          </div>
        </section>

        {/* Automatic Refresh */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <span>[02]</span>
            <span>Automated Silent Refresh</span>
          </h2>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            When <code>autoRefresh: true</code> is enabled, the SDK starts a
            background timer that dispatches a refresh request 60 seconds before
            the access token expires:
          </p>
          <DocsCodeBlock
            id="silent-refresh-code"
            code={`// To manually trigger a session refresh:
try {
  const { tokens } = await AuthSphere.refreshToken();
  console.log('New Access Token minted:', tokens.accessToken);
} catch (error) {
  // Refresh token expired or revoked - user must re-authenticate
  window.location.href = '/login';
}`}
            language="javascript"
          />
        </section>

        {/* Session Revocation */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <span>[03]</span>
            <span>Terminating Active Sessions</span>
          </h2>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            Calling <code>logout()</code> invalidates the active session in
            MongoDB and purges local storage:
          </p>
          <DocsCodeBlock
            id="logout-code"
            code={`// Current device logout
await AuthSphere.logout();

// Redirect to login view
window.location.href = '/login';`}
            language="javascript"
          />
        </section>
      </div>
    </article>
  );
};

export default SessionManagement;
