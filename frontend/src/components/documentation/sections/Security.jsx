import React from "react";
import {
  ShieldCheck,
  Lock,
  Database,
  KeyRound,
  Layers,
  Cpu,
  FileCheck2,
} from "lucide-react";
import TechSeparator from "@/components/common/TechSeparator";
import DocsCodeBlock from "../DocsCodeBlock";

const Security = () => {
  const passwordSpecs = [
    {
      param: "Hashing Algorithm",
      value: "Bcrypt (bcryptjs)",
      note: "Adaptive salted password hashing",
    },
    {
      param: "Salt Rounds",
      value: "10 rounds",
      note: "CPU work factor balanced for security and throughput",
    },
    {
      param: "Salt Generation",
      value: "CSPRNG (bcrypt.genSalt)",
      note: "Cryptographically secure pseudo-random salt per credential",
    },
    {
      param: "Breach Detection",
      value: "HaveIBeenPwned Range API",
      note: "k-Anonymity query with 5-character SHA-1 prefix",
    },
    {
      param: "Breach Rejection",
      value: "Instant 400 Bad Request",
      note: "Prevents registration with known leaked passwords",
    },
  ];

  const tokenSpecs = [
    {
      param: "Token Format",
      value: "RFC-7519 JSON Web Token",
      note: "Compact, URL-safe claims representation",
    },
    {
      param: "Signing Algorithm",
      value: "HMAC-SHA256 (HS256)",
      note: "Symmetric key cryptographic signature",
    },
    {
      param: "Access Token Lifetime",
      value: "15 minutes (900s)",
      note: "Configurable per-project in Dashboard",
    },
    {
      param: "Refresh Token Format",
      value: "40-byte random hex string",
      note: "crypto.randomBytes(40).toString('hex')",
    },
    {
      param: "Refresh Token Store",
      value: "MongoDB with TTL index",
      note: "Automatic native expiration after 7 days",
    },
  ];

  return (
    <article className="space-y-8 text-foreground font-sans">
      {/* Eyebrow Header */}
      <div className="border-b border-border pb-4 space-y-2">
        <div className="flex items-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
          <span>10</span>
          <TechSeparator />
          <span>CRYPTOGRAPHIC ASSURANCE</span>
          <TechSeparator />
          <span>SECURITY PROTOCOLS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Cryptographic Architecture &amp; Security Standards
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed max-w-3xl">
          Adaptive Bcrypt password derivation, HaveIBeenPwned k-anonymity
          validation, HS256 JWT access tokens, and RFC-7636 PKCE S256 challenge
          exchange.
        </p>
      </div>

      <div className="space-y-8">
        {/* Bcrypt & HaveIBeenPwned */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              [01]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
              Password Storage: Bcrypt (10 Salt Rounds) &amp; Breach Detection
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            Local credentials are never stored in plaintext. Passwords are
            salted and hashed using Bcrypt with 10 rounds of computation. Before
            hashing, AuthSphere checks the password against HaveIBeenPwned's
            database of leaked credentials using 5-character SHA-1 k-anonymity:
          </p>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-2.5 border-b border-border bg-muted/40 text-[11px] font-mono text-muted-foreground font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>PARAMETER</span>
              <span>ENGINE SPECIFICATION</span>
            </div>
            <div className="divide-y divide-border">
              {passwordSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground">
                      {spec.param}
                    </span>
                    <span className="block text-[11px] text-muted-foreground font-sans">
                      {spec.note}
                    </span>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Token Architecture */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              [02]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
              Token Lifecycle: HS256 Access Tokens &amp; Database Sessions
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            Authentication uses a dual-token model: short-lived HMAC-SHA256 JWT
            access tokens for API requests, and high-entropy opaque refresh
            tokens persisted in MongoDB with native TTL expiration:
          </p>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-2.5 border-b border-border bg-muted/40 text-[11px] font-mono text-muted-foreground font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>PARAMETER</span>
              <span>TOKEN LIFECYCLE SPECIFICATION</span>
            </div>
            <div className="divide-y divide-border">
              {tokenSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground">
                      {spec.param}
                    </span>
                    <span className="block text-[11px] text-muted-foreground font-sans">
                      {spec.note}
                    </span>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PKCE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              [03]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
              PKCE (RFC 7636) for OAuth Ingress
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            AuthSphere mandates Proof Key for Code Exchange (PKCE) with the{" "}
            <code>S256</code> challenge method for all OAuth 2.0 flows. This
            eliminates authorization code interception attacks on single-page
            applications and mobile clients:
          </p>

          <DocsCodeBlock
            id="pkce-spec"
            code={`// 1. Client generates high-entropy random verifier (43-128 characters)
const codeVerifier = generateRandomString(64);

// 2. SHA-256 hash transformed with URL-safe Base64
const codeChallenge = base64Url(sha256(codeVerifier));

// 3. Sent to OAuth provider during redirect
// &code_challenge=\${codeChallenge}&code_challenge_method=S256

// 4. Verification during callback exchange (/sdk/token):
// AuthSphere validates: SHA256(code_verifier) === stored_codeChallenge`}
            language="javascript"
          />
        </section>

        {/* Data at Rest & In Transit */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              [04]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
              Data Isolation &amp; Security Standards
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                IN TRANSIT
              </span>
              <p className="text-xs font-mono font-bold text-foreground">
                TLS 1.3 &amp; HTTPS
              </p>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                All traffic between clients, the SDK, and the AuthSphere API is
                encrypted in transit using TLS 1.3.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                AT REST
              </span>
              <p className="text-xs font-mono font-bold text-foreground">
                Bcrypt Hashes &amp; MongoDB TTL
              </p>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                Passwords are salted hashes. Session tokens expire automatically
                via MongoDB TTL indices to prevent orphaned credentials.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                TENANT ISOLATION
              </span>
              <p className="text-xs font-mono font-bold text-foreground">
                Project Partitioning &amp; CORS
              </p>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                Each project's users, sessions, and credentials are strictly
                scoped by projectId with origin checking on all SDK routes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
};

export default Security;
