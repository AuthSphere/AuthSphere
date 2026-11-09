import React from "react";
import {
  Globe,
  ShieldCheck,
  Clock,
  Mail,
  AlertTriangle,
  Sliders,
  Radio,
} from "lucide-react";
import TechSeparator from "@/components/common/TechSeparator";
import DocsCodeBlock from "../DocsCodeBlock";

const Configuration = () => {
  const rateLimitRules = [
    {
      endpoint: "Auth Endpoints (/sdk/login-local, /sdk/register)",
      limit: "20 attempts / 1 hour",
      action: "HTTP 429 Too Many Requests",
      scope: "Per IP address via authLimiter",
    },
    {
      endpoint: "Brute Force Protection",
      limit: "5 failed attempts",
      action: "15-minute lockout (configurable in Project settings)",
      scope: "Per account credential",
    },
    {
      endpoint: "Global API Limiter",
      limit: "100 requests / 15 minutes",
      action: "HTTP 429 Too Many Requests with RateLimit-* headers",
      scope: "Per IP address via globalLimiter",
    },
    {
      endpoint: "POST /sdk/verify-otp",
      limit: "5 attempts per code",
      action: "Invalidates OTP; user must request new code",
      scope: "Per email + transaction ID",
    },
  ];

  return (
    <article className="space-y-8 text-foreground font-sans">
      {/* Eyebrow Header */}
      <div className="border-b border-border pb-4 space-y-2">
        <div className="flex items-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
          <span>07</span>
          <TechSeparator />
          <span>PROJECT SPECIFICATION</span>
          <TechSeparator />
          <span>CONFIGURATION &amp; POLICIES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Project Configuration &amp; Security Policies
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed max-w-3xl">
          Fine-tune CORS whitelist origins, enforcement gates for unverified
          users, rate limiting thresholds, and transactional email branding.
        </p>
      </div>

      <div className="space-y-8">
        {/* Origin & CORS Policies */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              [01]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
              CORS &amp; Allowed Origin Whitelisting
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            Every browser request to the AuthSphere SDK transmits an{" "}
            <code>Origin</code> header. The AuthSphere gateway rejects requests
            from unlisted origins with an immediate <code>403 Forbidden</code> (
            <code>ORIGIN_NOT_ALLOWED</code>) response before any cryptographic
            processing occurs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                <Globe className="h-4 w-4" />
                <span>VALID ORIGIN EXAMPLES</span>
              </div>
              <ul className="text-xs font-mono space-y-2 text-muted-foreground">
                <li className="p-2 rounded bg-muted/40 border border-border">
                  <code>https://app.yourdomain.com</code>
                </li>
                <li className="p-2 rounded bg-muted/40 border border-border">
                  <code>http://localhost:5173</code> (Dev only)
                </li>
                <li className="p-2 rounded bg-muted/40 border border-border">
                  <code>capacitor://localhost</code> (Mobile)
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <span>ORIGIN CONSTRAINTS</span>
              </div>
              <ul className="text-xs font-sans space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
                    •
                  </span>
                  <span>
                    No trailing slashes: <code>https://example.com/</code> will
                    fail matching.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
                    •
                  </span>
                  <span>
                    No wildcards (<code>*</code>) allowed in production
                    projects.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
                    •
                  </span>
                  <span>
                    Ports must be explicitly included for non-standard ports
                    (e.g. <code>:3000</code>).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Strict Verification Policy */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              [02]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
              Strict Email Verification Gate
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            In the project dashboard under <strong>Policies</strong>, you can
            enforce hard verification before session tokens can be minted.
          </p>

          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-foreground">
                Policy Behavior: strictVerification = true
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                ENFORCED
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              When a user submits credentials via <code>loginLocal()</code>,
              AuthSphere checks the user's email verification status in the
              database. If <code>is_verified: false</code>, the server halts
              execution and responds with:
            </p>
            <DocsCodeBlock
              id="strict-verif-response"
              code={`// HTTP 403 Forbidden
{
  "success": false,
  "error_code": "EMAIL_NOT_VERIFIED",
  "message": "User email address is not verified. Complete OTP verification.",
  "sdk_request": "as_req_99f2b8a71c..."
}`}
              language="json"
            />
          </div>
        </section>

        {/* Rate Limiting */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              [03]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
              Adaptive Rate Limiting &amp; Lockout Thresholds
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            AuthSphere enforces express-rate-limit middleware with standard
            RateLimit-* response headers and project-level brute-force
            thresholds. Excessive requests receive immediate 429 status codes:
          </p>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-2.5 border-b border-border bg-muted/40 text-[11px] font-mono text-muted-foreground font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>ENDPOINT</span>
              <span>THRESHOLD &amp; ENFORCEMENT</span>
            </div>
            <div className="divide-y divide-border">
              {rateLimitRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="px-5 py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-mono"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground">
                      {rule.endpoint}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      Scope: {rule.scope}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {rule.limit}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      {rule.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand & Template Configuration */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              [04]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
              Transactional Email &amp; Delivery Parameters
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            You can customize every outbound OTP email directly in the{" "}
            <strong>Email Customization</strong> section of the dashboard:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">
                BRANDING ACCENT
              </span>
              <p className="text-xs font-mono font-bold text-foreground">
                Primary Hex Color
              </p>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                Controls the color of verification action buttons, OTP digit
                boxes, and header banners.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">
                ASSET HOSTING
              </span>
              <p className="text-xs font-mono font-bold text-foreground">
                Company Emblem URL
              </p>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                HTTPS URL to your SVG or PNG logo, rendered in the header of all
                transaction emails.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">
                REPUTATION &amp; TRUST
              </span>
              <p className="text-xs font-mono font-bold text-foreground">
                Support &amp; Legal Links
              </p>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                Configurable Privacy Policy, Terms, and Help Desk URLs injected
                into RFC-compliant footers.
              </p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
};

export default Configuration;
