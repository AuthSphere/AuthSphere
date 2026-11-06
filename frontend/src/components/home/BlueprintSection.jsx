import React from "react";

export const BlueprintSection = () => {
  return (
    <section
      id="overview"
      className="w-full max-w-340 mx-auto px-6 lg:px-12 py-20 border-b border-[#eaeaea] dark:border-[#222329] bg-neutral-50/50 dark:bg-[#0c0d11] relative isolate"
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
          <g fill="currentColor" fontFamily="monospace" fontSize="8">
            <text x="48" y="28">
              SYS_AXIS::SEC_01 [LATENCY &lt; 0.4ms]
            </text>
            <text textAnchor="end" x="1312" y="28">
              ENCRYPT_MATRIX::AES256
            </text>
          </g>
        </svg>
      </div>

      {/* Header and Eyebrow */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div className="max-w-2xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
            01 // Architectural Blueprint
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Identity should be simple. Infrastructure should be reliable.
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed">
            Authentication is a fundamental part of every application.
            AuthSphere aims to make implementing authentication and OAuth more
            straightforward for developers without compromising on enterprise
            security specs.
          </p>
        </div>
        <div className="self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#eaeaea] dark:border-[#2a2b33] bg-white dark:bg-[#14151a] text-[11px] font-mono text-neutral-800 dark:text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
            PKCE RFC 7636 ENFORCED
          </span>
        </div>
      </div>

      {/* High-Precision Flow Grid */}
      <div className="border border-[#eaeaea] dark:border-neutral-800 bg-white dark:bg-neutral-950 relative z-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Column 1: Inbound Providers */}
          <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-[#eaeaea] dark:border-neutral-800 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <span className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                  01. Inbound Providers
                </span>
                <span className="text-neutral-500">PORT:443</span>
              </div>
              <div className="space-y-3 font-mono text-xs mt-4">
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      Google Identity
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      OpenID Connect 1.0
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-semibold">
                    OIDC
                  </span>
                </div>
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      GitHub OAuth
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      read:user, user:email
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-semibold">
                    v3 REST
                  </span>
                </div>
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      Discord OAuth2
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      identify, email scopes
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-semibold">
                    v10 API
                  </span>
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-900">
              Callback handler validates CSRF state token &amp; code challenge
              before key dispatch.
            </div>
          </div>

          {/* Column 2: Secure Core Engine */}
          <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-[#eaeaea] dark:border-neutral-800 flex flex-col justify-between gap-6 bg-neutral-50/60 dark:bg-neutral-900/30">
            <div>
              <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <span className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                  02. Secure Core Engine
                </span>
                <span className="text-neutral-500">IN-MEMORY BUS</span>
              </div>
              <div className="space-y-3 font-mono text-xs mt-4">
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                  <div className="text-[11px] text-neutral-500 mb-0.5">
                    MODULE 01
                  </div>
                  <div className="font-medium text-neutral-900 dark:text-white">
                    PKCE Verifier
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Calculates SHA-256 code challenge with non-reusable single
                    time nonces.
                  </div>
                </div>
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                  <div className="text-[11px] text-neutral-500 mb-0.5">
                    MODULE 02
                  </div>
                  <div className="font-medium text-neutral-900 dark:text-white">
                    Token Rotation Vault
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Atomic single-use refresh token invalidation with replay
                    anomaly alarms.
                  </div>
                </div>
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                  <div className="text-[11px] text-neutral-500 mb-0.5">
                    MODULE 03
                  </div>
                  <div className="font-medium text-neutral-900 dark:text-white">
                    WebSocket Session Sync
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Instant cross-device revocation broadcast via lightweight
                    binary bus.
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
              <span>ACTIVE TTL: 900 SEC</span>
              <span>ENCRYPTION: AES-256</span>
            </div>
          </div>

          {/* Column 3: Consuming Endpoints */}
          <div className="lg:col-span-4 p-6 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <span className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                  03. Consuming Endpoints
                </span>
                <span className="text-neutral-500">CLIENT / EDGE</span>
              </div>
              <div className="space-y-3 font-mono text-xs mt-4">
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      Web Application
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Next.js / Vite / Remix
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-900 dark:text-white">
                    OK
                  </span>
                </div>
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      Mobile Runtime
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      React Native / Expo / Swift
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-900 dark:text-white">
                    OK
                  </span>
                </div>
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      Edge API Workers
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Cloudflare / Fastly / Node
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-900 dark:text-white">
                    OK
                  </span>
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-900">
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
