import React from "react";
import TechSeparator from "@/components/common/TechSeparator";

export const BlueprintSection = () => {
  return (
    <section
      id="overview"
      className="w-full max-w-340 mx-auto px-6 lg:px-12 py-20 border-b border-border bg-muted/20 relative isolate"
    >
      {/* Background Architectural Watermark SVG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20 dark:opacity-10">
        <svg
          className="w-full h-full"
          fill="none"
          preserveAspectRatio="none"
          stroke="currentColor"
          viewBox="0 0 1360 480"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="currentColor" strokeWidth="0.75">
            <path d="M 24 24 L 40 24 M 32 16 L 32 32" />
            <path d="M 1336 24 L 1320 24 M 1328 16 L 1328 32" />
            <path d="M 24 456 L 40 456 M 32 448 L 32 464" />
            <path d="M 1336 456 L 1320 456 M 1328 448 L 1328 464" />
            <line
              opacity="0.5"
              strokeDasharray="4 8"
              x1="32"
              x2="1328"
              y1="32"
              y2="32"
            />
            <line
              opacity="0.5"
              strokeDasharray="4 8"
              x1="32"
              x2="1328"
              y1="448"
              y2="448"
            />
          </g>
        </svg>
      </div>

      {/* Header and Eyebrow */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div className="max-w-2xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center">
            <span>01</span>
            <TechSeparator />
            <span>Architectural Blueprint</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Identity should be simple. Infrastructure should be reliable.
          </h2>
          <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">
            Authentication is a fundamental part of every application.
            AuthSphere aims to make implementing authentication and OAuth more
            straightforward for developers without compromising on enterprise
            security specs.
          </p>
        </div>
        <div className="self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-card text-[11px] font-mono text-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            PKCE RFC 7636 ENFORCED
          </span>
        </div>
      </div>

      {/* High-Precision Flow Grid */}
      <div className="border border-border bg-card relative z-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Column 1: Inbound Providers */}
          <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-border">
                <span className="font-semibold text-foreground uppercase tracking-wider">
                  01. Inbound Providers
                </span>
                <span className="text-muted-foreground">PORT:443</span>
              </div>
              <div className="space-y-3 font-mono text-xs mt-4">
                <div className="p-3 border border-border bg-background flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">
                      Google Identity
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      OpenID Connect 1.0
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    OIDC
                  </span>
                </div>
                <div className="p-3 border border-border bg-background flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">
                      GitHub OAuth
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      read:user, user:email
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    v3 REST
                  </span>
                </div>
                <div className="p-3 border border-border bg-background flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">
                      Discord OAuth2
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      identify, email scopes
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    v10 API
                  </span>
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono text-muted-foreground pt-2 border-t border-border">
              Callback handler validates CSRF state token &amp; code challenge
              before key dispatch.
            </div>
          </div>

          {/* Column 2: Secure Core Engine */}
          <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between gap-6 bg-muted/30">
            <div>
              <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-border">
                <span className="font-semibold text-foreground uppercase tracking-wider">
                  02. Secure Core Engine
                </span>
                <span className="text-muted-foreground">EXPRESS + MONGODB</span>
              </div>
              <div className="space-y-3 font-mono text-xs mt-4">
                <div className="p-3 border border-border bg-card">
                  <div className="text-[11px] text-muted-foreground mb-0.5">
                    MODULE 01
                  </div>
                  <div className="font-medium text-foreground">
                    PKCE Verifier
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Validates SHA-256 code verifier against stored S256 code
                    challenge.
                  </div>
                </div>
                <div className="p-3 border border-border bg-card">
                  <div className="text-[11px] text-muted-foreground mb-0.5">
                    MODULE 02
                  </div>
                  <div className="font-medium text-foreground">
                    Token Rotation Vault
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Single-use refresh token exchange with native MongoDB TTL
                    expiration.
                  </div>
                </div>
                <div className="p-3 border border-border bg-card">
                  <div className="text-[11px] text-muted-foreground mb-0.5">
                    MODULE 03
                  </div>
                  <div className="font-medium text-foreground">
                    WebSocket Session Revocation
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Cross-device session termination broadcast via Socket.io
                    events.
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-muted-foreground border-t border-border">
              <span>ACCESS TTL: 15 MIN</span>
              <span>SIGNING: HMAC-SHA256</span>
            </div>
          </div>

          {/* Column 3: Consuming Endpoints */}
          <div className="lg:col-span-4 p-6 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-border">
                <span className="font-semibold text-foreground uppercase tracking-wider">
                  03. Consuming Endpoints
                </span>
                <span className="text-muted-foreground">CLIENT / EDGE</span>
              </div>
              <div className="space-y-3 font-mono text-xs mt-4">
                <div className="p-3 border border-border bg-background flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">
                      Web Application
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Next.js / Vite / Remix
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-foreground">
                    OK
                  </span>
                </div>
                <div className="p-3 border border-border bg-background flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">
                      Mobile Runtime
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      React Native / Expo / Swift
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-foreground">
                    OK
                  </span>
                </div>
                <div className="p-3 border border-border bg-background flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">
                      Backend APIs &amp; Services
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Node.js / Express / Next.js
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-foreground">
                    OK
                  </span>
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono text-muted-foreground pt-2 border-t border-border">
              All endpoints receive verified claims without extra database
              lookups.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlueprintSection;
