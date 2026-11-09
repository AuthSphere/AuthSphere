import React from "react";
import {
  Users,
  ShieldAlert,
  UserCheck,
  UserX,
  Clock,
  Terminal,
  KeyRound,
  FileText,
} from "lucide-react";
import TechSeparator from "@/components/common/TechSeparator";
import DocsCodeBlock from "../DocsCodeBlock";

const UserManagement = () => {
  const lifecycleStates = [
    {
      state: "PENDING_VERIFICATION",
      badgeColor:
        "text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-500/10",
      description:
        "User registered via email/password but has not cleared the 6-digit OTP challenge.",
      canMintTokens: "No (403 EMAIL_NOT_VERIFIED)",
      action: "Resend verification OTP or manually mark verified in dashboard.",
    },
    {
      state: "ACTIVE",
      badgeColor:
        "text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
      description:
        "Identity verified. Can authenticate, initiate OAuth flows, and mint HS256 JWTs.",
      canMintTokens: "Yes (15-min JWT + 7-day Refresh)",
      action: "Standard user operations and session rotation.",
    },
    {
      state: "BANNED",
      badgeColor:
        "text-red-600 dark:text-red-400 border-red-500/20 bg-red-500/10",
      description:
        "Administratively suspended due to malicious activity, abuse, or security request.",
      canMintTokens: "Hard Block (403 USER_BANNED)",
      action: "All active database sessions are immediately invalidated.",
    },
  ];

  return (
    <article className="space-y-8 text-foreground font-sans">
      {/* Eyebrow Header */}
      <div className="border-b border-border pb-4 space-y-2">
        <div className="flex items-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
          <span>08</span>
          <TechSeparator />
          <span>TENANT DIRECTORY</span>
          <TechSeparator />
          <span>USER MANAGEMENT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Identity Directory &amp; Administration
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed max-w-3xl">
          Lifecycle state machines, real-time session invalidation, manual
          administrative overrides, and programmatic directory control.
        </p>
      </div>

      <div className="space-y-8">
        {/* User Lifecycle States */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              [01]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
              Identity State Machine
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            Every user in your tenant directory exists in one of three
            deterministic states. State transitions trigger immediate
            cryptographic access adjustments:
          </p>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-2.5 border-b border-border bg-muted/40 text-[11px] font-mono text-muted-foreground font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>STATE &amp; STATUS</span>
              <span>TOKEN ISSUANCE &amp; ACTIONS</span>
            </div>
            <div className="divide-y divide-border">
              {lifecycleStates.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 text-xs font-mono"
                >
                  <div className="space-y-1.5 max-w-md">
                    <span
                      className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold ${item.badgeColor}`}
                    >
                      {item.state}
                    </span>
                    <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="space-y-1 text-left md:text-right">
                    <div className="text-foreground font-bold">
                      {item.canMintTokens}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-sans">
                      {item.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Immediate Invalidation */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              [02]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
              Session Invalidation Mechanics
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            When an administrator changes a user's status to <code>BANNED</code>{" "}
            or triggers "Revoke All Sessions", the following pipeline executes:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <span className="text-emerald-500">01.</span>
                <span>DATABASE REVOCATION</span>
              </div>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                All sessions mapped to the user in MongoDB are immediately
                marked invalid and removed.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <span className="text-emerald-500">02.</span>
                <span>ROTATION HALT</span>
              </div>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                Subsequent requests to <code>/sdk/refresh</code> fail with{" "}
                <code>TOKEN_REVOKED</code>, preventing new access token
                generation.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <span className="text-emerald-500">03.</span>
                <span>AUDIT RECORDING</span>
              </div>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                A non-repudiable audit event is appended to the ledger with
                admin ID, user ID, and revocation timestamp.
              </p>
            </div>
          </div>
        </section>

        {/* Admin API (Server-to-Server) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              [03]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
              Backend Administrative API
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            For backend scripts, user migrations, or automated customer support
            tools, use the server-side REST API authenticated with your
            project's <strong>Secret Key</strong> (never expose this key in
            client-side code):
          </p>

          <DocsCodeBlock
            id="admin-user-ban"
            code={`// Example: Suspending a compromised user from your Node.js backend
const response = await fetch('https://api.authsphere.io/api/v1/admin/users/usr_88a91c/status', {
  method: 'PATCH',
  headers: {
    'Authorization': \`Bearer \${process.env.AUTHSPHERE_SECRET_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'banned',
    reason: 'Security team: credential stuffing anomaly detected'
  })
});

const data = await response.json();
console.log('Revocation confirmed:', data.revokedSessionsCount);`}
            language="javascript"
          />
        </section>
      </div>
    </article>
  );
};

export default UserManagement;
