import React from "react";
import {
  ShieldCheck,
  Lock,
  Database,
  Cpu,
  KeyRound,
  FileCode2,
  Terminal,
  Zap,
} from "lucide-react";
import TechSeparator from "@/components/common/TechSeparator";

const Introduction = () => {
  const specs = [
    { label: "Token Format", value: "JWT (RFC-7519) / HMAC-SHA256 (HS256)" },
    {
      label: "Password Hashing",
      value: "Bcrypt (10 salt rounds) + HaveIBeenPwned check",
    },
    {
      label: "Session Store",
      value: "MongoDB with native TTL index expiration",
    },
    {
      label: "OAuth Protocol",
      value: "OAuth 2.0 & OIDC with RFC-7636 PKCE S256",
    },
    {
      label: "Access Token Lifetime",
      value: "15 minutes (900 seconds, configurable)",
    },
    {
      label: "Refresh Token Lifetime",
      value: "7 days (40-byte cryptographically random hex)",
    },
  ];

  const coreModules = [
    {
      title: "Standard JWT Access Tokens",
      tag: "RFC-7519",
      description:
        "Every session receives an HMAC-SHA256 access token containing the user subject, project ID, email, and username. Verify tokens in your backends using standard libraries like jsonwebtoken or jose.",
    },
    {
      title: "OAuth 2.0 & OIDC Providers",
      tag: "RFC-7636",
      description:
        "Pre-wired support for Google, GitHub, Discord, Microsoft, LinkedIn, GitLab, Twitch, and Bitbucket with PKCE S256 challenge validation, CSRF state verification, and normalized user schemas.",
    },
    {
      title: "Email & One-Time Passcodes",
      tag: "RFC-6238",
      description:
        "Transactional email verification with customizable templates, brute-force lockout thresholds, and HaveIBeenPwned k-anonymity breach validation on registration.",
    },
    {
      title: "Database Session Lifecycle",
      tag: "SOCKET.IO",
      description:
        "Active sessions are persisted in MongoDB with automatic TTL cleanup. Terminating a session emits a real-time event to invalidate connected clients immediately.",
    },
  ];

  return (
    <article className="space-y-8 text-foreground font-sans">
      {/* Eyebrow Header */}
      <div className="border-b border-border pb-4 space-y-2">
        <div className="flex items-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
          <span>01</span>
          <TechSeparator />
          <span>SPECIFICATION OVERVIEW</span>
          <TechSeparator />
          <span>INTRODUCTION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          AuthSphere Architecture &amp; Fundamentals
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed max-w-3xl">
          AuthSphere is a developer-focused authentication engine that decouples
          user identity, session state, and cryptographic token minting into a
          clean, observable runtime.
        </p>
      </div>

      {/* How it Works / Core Overview */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <span>[01]</span>
          <span>How It Works Under the Hood</span>
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed font-mono">
          When an application connects to AuthSphere, identity ingress is
          handled either through local password authentication (salted with
          Bcrypt and checked against HaveIBeenPwned breach records) or via OAuth
          providers. Once verified, AuthSphere mints a short-lived HS256-signed
          JWT for API requests and an opaque 40-byte refresh token tracked in
          MongoDB.
        </p>

        {/* Technical Specs Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-2.5 border-b border-border bg-muted/40 text-[11px] font-mono text-muted-foreground font-semibold uppercase tracking-wider flex items-center justify-between">
            <span>ENGINE CRYPTOGRAPHIC SPECIFICATIONS</span>
            <span>SYSTEM METRICS</span>
          </div>
          <div className="divide-y divide-border">
            {specs.map((item, idx) => (
              <div
                key={idx}
                className="px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Building Blocks */}
      <div className="space-y-4 pt-2">
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <span>[02]</span>
          <span>Core Subsystems</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coreModules.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground">{m.title}</span>
                <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted border border-border">
                  {m.tag}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Philosophy Note */}
      <div className="p-5 rounded-xl border border-border bg-muted/30 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
          <KeyRound className="h-4 w-4 text-emerald-500" />
          <span>OPEN STANDARD TOKENS</span>
        </div>
        <p className="text-xs text-muted-foreground font-mono leading-relaxed">
          AuthSphere does not lock you into proprietary token formats or
          black-box SDK wrappers. Tokens follow standard RFC-7519 JSON Web Token
          specs signed with HMAC-SHA256, allowing you to verify tokens using any
          standard library like <code>jsonwebtoken</code>, <code>jose</code>, or
          Go's <code>golang-jwt</code>.
        </p>
      </div>
    </article>
  );
};

export default Introduction;
