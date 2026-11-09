import React, { useState } from "react";
import TechSeparator from "@/components/common/TechSeparator";

export const CapabilityMatrixSection = () => {
  const [revoked, setRevoked] = useState(false);
  const [btnText, setBtnText] = useState("Invalidate All");
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleDemoRevoke = () => {
    setRevoked(true);
    setBtnText("Sessions Revoked");
    setBtnDisabled(true);

    setTimeout(() => {
      setRevoked(false);
      setBtnText("Invalidate All");
      setBtnDisabled(false);
    }, 3200);
  };

  return (
    <section
      id="features"
      className="w-full max-w-340 mx-auto px-6 lg:px-12 py-20 border-b border-border bg-background isolate"
    >
      <div className="max-w-2xl mb-12">
        <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center">
          <span>02</span>
          <TechSeparator />
          <span>Capability Matrix</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Everything your authentication layer needs.
        </h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Open-source protocols implemented with strict adherence to RFC
          standards, full developer control, and zero proprietary lock-in.
        </p>
      </div>

      {/* 4 Asymmetric Blocks */}
      <div className="border-t border-border font-mono">
        {/* Block 1: Providers */}
        <div className="py-8 border-b border-border grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
          <div className="lg:col-span-3 text-xs text-muted-foreground flex items-center">
            <span>01</span>
            <TechSeparator />
            <span>PROVIDERS</span>
          </div>
          <div className="lg:col-span-4">
            <h3 className="text-lg font-bold font-sans text-foreground mb-1.5">
              Multi-Tenant OAuth Adapters
            </h3>
            <p className="text-xs font-sans text-muted-foreground leading-relaxed">
              Native adapters for Google, GitHub, and Discord. Pre-wired state
              parameter hashing, CSRF cookie verification, and standardized
              identity profiles.
            </p>
          </div>
          <div className="lg:col-span-5 text-xs bg-card p-4 border border-border flex flex-col gap-2 shadow-xs">
            {/* Diagram SVG: OAuth Providers to Normalized Token Pipeline */}
            <div className="w-full min-h-26 mb-2 border border-border bg-muted/40 p-2.5 flex items-center justify-center">
              <svg
                className="w-full h-auto max-h-24"
                fill="none"
                viewBox="0 0 460 84"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Hairline Axes & Grid Alignment */}
                <line
                  x1="8"
                  y1="42"
                  x2="452"
                  y2="42"
                  stroke="currentColor"
                  strokeOpacity="0.12"
                  strokeWidth="1"
                />
                <line
                  x1="108"
                  y1="6"
                  x2="108"
                  y2="78"
                  stroke="currentColor"
                  strokeOpacity="0.15"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <line
                  x1="288"
                  y1="6"
                  x2="288"
                  y2="78"
                  stroke="currentColor"
                  strokeOpacity="0.15"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />

                {/* Left: 3 Inbound Provider Nodes */}
                <g
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="1"
                  fill="currentColor"
                  fillOpacity="0.05"
                >
                  <rect x="8" y="7" width="84" height="20" rx="3" />
                  <rect x="8" y="32" width="84" height="20" rx="3" />
                  <rect x="8" y="57" width="84" height="20" rx="3" />
                </g>
                <g
                  fill="currentColor"
                  fontFamily="monospace"
                  fontSize="8.5"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  <text x="50" y="20.5">
                    GOOGLE OIDC
                  </text>
                  <text x="50" y="45.5">
                    GITHUB v3
                  </text>
                  <text x="50" y="70.5">
                    DISCORD v10
                  </text>
                </g>

                {/* Converging Transit Connectors */}
                <path
                  d="M 92 17 L 122 42"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                  strokeWidth="1.2"
                />
                <path
                  d="M 92 42 L 122 42"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                  strokeWidth="1.2"
                />
                <path
                  d="M 92 67 L 122 42"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                  strokeWidth="1.2"
                />
                <circle cx="122" cy="42" r="3" fill="currentColor" />

                {/* Center: State Gate */}
                <g
                  stroke="currentColor"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                  fill="currentColor"
                  fillOpacity="0.08"
                >
                  <rect x="122" y="18" width="136" height="48" rx="4" />
                </g>
                <g fill="currentColor" fontFamily="monospace">
                  <text
                    x="190"
                    y="37"
                    fontSize="9.5"
                    fontWeight="700"
                    textAnchor="middle"
                    letterSpacing="0.5"
                  >
                    STATE VERIFIER
                  </text>
                  <text
                    x="190"
                    y="52"
                    fontSize="8"
                    fillOpacity="0.7"
                    textAnchor="middle"
                  >
                    CSRF &amp; State Match
                  </text>
                </g>
                <circle cx="258" cy="42" r="3" fill="currentColor" />

                {/* Transition Arrow to Normalized */}
                <line
                  x1="258"
                  y1="42"
                  x2="300"
                  y2="42"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                  strokeWidth="1.2"
                />
                <polygon points="298,39 304,42 298,45" fill="currentColor" />

                {/* Right: Normalized Token Matrix */}
                <g
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                  fill="currentColor"
                  fillOpacity="0.1"
                >
                  <rect x="306" y="18" width="146" height="48" rx="4" />
                </g>
                <g fill="currentColor" fontFamily="monospace">
                  <text
                    x="379"
                    y="37"
                    fontSize="9.5"
                    fontWeight="700"
                    textAnchor="middle"
                    letterSpacing="0.5"
                  >
                    USER PROFILE
                  </text>
                  <text
                    x="379"
                    y="52"
                    fontSize="8"
                    fillOpacity="0.7"
                    textAnchor="middle"
                  >
                    Standard User Model
                  </text>
                </g>
              </svg>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>ACTIVE PROVIDERS</span>
              <span>NORMALIZATION</span>
            </div>
            <div className="flex gap-4 font-semibold text-foreground">
              <span>Google (OIDC)</span>
              <span>GitHub</span>
              <span>Discord</span>
            </div>
            <div className="text-[11px] text-muted-foreground pt-1 border-t border-border">
              Payload: &#123; id: &quot;usr_99x&quot;, email:
              &quot;dev@authsphere.io&quot;, verified: true &#125;
            </div>
          </div>
        </div>

        {/* Block 2: Cryptography */}
        <div className="py-8 border-b border-border grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
          <div className="lg:col-span-3 text-xs text-muted-foreground flex items-center">
            <span>02</span>
            <TechSeparator />
            <span>CRYPTOGRAPHY</span>
          </div>
          <div className="lg:col-span-4">
            <h3 className="text-lg font-bold font-sans text-foreground mb-1.5">
              PKCE &amp; Token Rotation
            </h3>
            <p className="text-xs font-sans text-muted-foreground leading-relaxed">
              SHA-256 S256 code challenge generation and single-use refresh
              token cycling. Immediate invalidation upon replay attempt.
            </p>
          </div>
          <div className="lg:col-span-5 text-xs bg-card p-4 border border-border flex flex-col gap-2 shadow-xs">
            {/* Diagram SVG: PKCE S256 Challenge Flow */}
            <div className="w-full min-h-26 mb-2 border border-border bg-muted/40 p-2.5 flex items-center justify-center">
              <svg
                className="w-full h-auto max-h-24"
                fill="none"
                viewBox="0 0 460 84"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Hairline Axes & Grid Alignment */}
                <line
                  x1="8"
                  y1="42"
                  x2="452"
                  y2="42"
                  stroke="currentColor"
                  strokeOpacity="0.12"
                  strokeWidth="1"
                />
                <line
                  x1="135"
                  y1="6"
                  x2="135"
                  y2="78"
                  stroke="currentColor"
                  strokeOpacity="0.15"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <line
                  x1="305"
                  y1="6"
                  x2="305"
                  y2="78"
                  stroke="currentColor"
                  strokeOpacity="0.15"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />

                {/* Step 1: Code Verifier */}
                <g
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="1"
                  fill="currentColor"
                  fillOpacity="0.06"
                >
                  <rect x="8" y="18" width="118" height="48" rx="4" />
                </g>
                <g fill="currentColor" fontFamily="monospace">
                  <text
                    x="67"
                    y="37"
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                    letterSpacing="0.5"
                  >
                    CODE VERIFIER
                  </text>
                  <text
                    x="67"
                    y="52"
                    fontSize="8"
                    fillOpacity="0.7"
                    textAnchor="middle"
                  >
                    Random Secret String
                  </text>
                </g>

                {/* Connector Arrow */}
                <line
                  x1="126"
                  y1="42"
                  x2="152"
                  y2="42"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                  strokeWidth="1.2"
                />
                <polygon points="150,39 156,42 150,45" fill="currentColor" />

                {/* Step 2: SHA-256 Digest */}
                <g
                  stroke="currentColor"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                  fill="currentColor"
                  fillOpacity="0.08"
                >
                  <rect x="158" y="16" width="138" height="52" rx="4" />
                </g>
                <g fill="currentColor" fontFamily="monospace">
                  <text
                    x="227"
                    y="36"
                    fontSize="9.5"
                    fontWeight="700"
                    textAnchor="middle"
                    letterSpacing="0.5"
                  >
                    SHA-256 (S256)
                  </text>
                  <text
                    x="227"
                    y="52"
                    fontSize="8"
                    fillOpacity="0.7"
                    textAnchor="middle"
                  >
                    Base64URL Digest
                  </text>
                </g>

                {/* Connector Arrow */}
                <line
                  x1="296"
                  y1="42"
                  x2="322"
                  y2="42"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                  strokeWidth="1.2"
                />
                <polygon points="320,39 326,42 320,45" fill="currentColor" />

                {/* Step 3: Code Challenge */}
                <g
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                  fill="currentColor"
                  fillOpacity="0.1"
                >
                  <rect x="328" y="18" width="124" height="48" rx="4" />
                </g>
                <g fill="currentColor" fontFamily="monospace">
                  <text
                    x="390"
                    y="37"
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                    letterSpacing="0.5"
                  >
                    CODE CHALLENGE
                  </text>
                  <text
                    x="390"
                    y="52"
                    fontSize="8"
                    fillOpacity="0.7"
                    textAnchor="middle"
                  >
                    S256 Challenge
                  </text>
                </g>
              </svg>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>CODE CHALLENGE</span>
              <span>S256 METHOD</span>
            </div>
            <div className="text-foreground select-all truncate text-[11px]">
              E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground pt-1 border-t border-border">
              <span>ROTATION: SINGLE-USE</span>
              <span>REPLAY PROTECTION: YES</span>
            </div>
          </div>
        </div>

        {/* Block 3: Concurrency / Real-Time Invalidation Bus */}
        <div className="py-8 border-b border-border grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
          <div className="lg:col-span-3 text-xs text-muted-foreground flex items-center">
            <span>03</span>
            <TechSeparator />
            <span>SESSIONS</span>
          </div>
          <div className="lg:col-span-4">
            <h3 className="text-lg font-bold font-sans text-foreground mb-1.5">
              Real-Time Session Revocation
            </h3>
            <p className="text-xs font-sans text-muted-foreground leading-relaxed">
              WebSocket-based session management using Socket.io. Dropping a
              session removes active database tokens and broadcasts revocation
              events to all connected clients.
            </p>
          </div>
          <div className="lg:col-span-5 text-xs bg-card p-4 border border-border flex flex-col gap-2 shadow-xs">
            {/* Diagram SVG: WebSocket Real-Time Invalidation */}
            <div className="w-full min-h-26 mb-2 border border-border bg-muted/40 p-2.5 flex items-center justify-center">
              <svg
                className="w-full h-auto max-h-24"
                fill="none"
                viewBox="0 0 460 84"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Hairline Center Axis */}
                <line
                  x1="8"
                  y1="42"
                  x2="452"
                  y2="42"
                  stroke="currentColor"
                  strokeOpacity="0.12"
                  strokeWidth="1"
                />
                <circle
                  cx="230"
                  cy="42"
                  r="32"
                  stroke="currentColor"
                  strokeOpacity="0.15"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <circle
                  cx="230"
                  cy="42"
                  r="18"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="1"
                />

                {/* Left: Client Terminal */}
                <g
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="1"
                  fill="currentColor"
                  fillOpacity="0.06"
                >
                  <rect x="8" y="18" width="124" height="48" rx="4" />
                </g>
                <g fill="currentColor" fontFamily="monospace">
                  <text
                    x="70"
                    y="37"
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                    letterSpacing="0.5"
                  >
                    ACTIVE CLIENT
                  </text>
                  <text
                    x="70"
                    y="52"
                    fontSize="8"
                    fillOpacity="0.7"
                    textAnchor="middle"
                  >
                    Revoke Request
                  </text>
                </g>

                {/* Arrow to Center Hub */}
                <line
                  x1="132"
                  y1="42"
                  x2="206"
                  y2="42"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                  strokeWidth="1.2"
                />
                <polygon points="204,39 210,42 204,45" fill="currentColor" />
                <circle cx="230" cy="42" r="4.5" fill="currentColor" />

                {/* Arrow to Broadcast Bus */}
                <line
                  x1="250"
                  y1="42"
                  x2="322"
                  y2="42"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                  strokeWidth="1.2"
                />
                <polygon points="320,39 326,42 320,45" fill="currentColor" />

                {/* Right: Broadcast Bus */}
                <g
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                  fill="currentColor"
                  fillOpacity="0.1"
                >
                  <rect x="328" y="18" width="124" height="48" rx="4" />
                </g>
                <g fill="currentColor" fontFamily="monospace">
                  <text
                    x="390"
                    y="37"
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                    letterSpacing="0.5"
                  >
                    BROADCAST EVENT
                  </text>
                  <text
                    x="390"
                    y="52"
                    fontSize="8"
                    fillOpacity="0.7"
                    textAnchor="middle"
                  >
                    All Sessions Revoked
                  </text>
                </g>
              </svg>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>SESSION BROADCAST</span>
              <button
                onClick={handleDemoRevoke}
                disabled={btnDisabled}
                className="underline text-foreground hover:text-foreground/80 font-mono text-[11px] cursor-pointer disabled:opacity-60"
                id="demo-revoke-btn"
              >
                {btnText}
              </button>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  MacBook Pro (Chrome)
                </span>
                <span
                  className={
                    revoked
                      ? "text-muted-foreground font-mono text-[10px] font-semibold"
                      : "font-semibold text-foreground"
                  }
                  id="session-tag-1"
                >
                  {revoked ? "REVOKED" : "CONNECTED"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  iPhone 15 (Safari)
                </span>
                <span
                  className={
                    revoked
                      ? "text-muted-foreground font-mono text-[10px] font-semibold"
                      : "font-semibold text-foreground"
                  }
                  id="session-tag-2"
                >
                  {revoked ? "REVOKED" : "CONNECTED"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Background Worker</span>
                <span
                  className={
                    revoked
                      ? "text-muted-foreground font-mono text-[10px] font-semibold"
                      : "font-semibold text-foreground"
                  }
                  id="session-tag-3"
                >
                  {revoked ? "REVOKED" : "CONNECTED"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Block 4: Specification / Zero-Dependency SDK */}
        <div className="py-8 border-b border-border grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
          <div className="lg:col-span-3 text-xs text-muted-foreground flex items-center">
            <span>04</span>
            <TechSeparator />
            <span>SPECIFICATION</span>
          </div>
          <div className="lg:col-span-4">
            <h3 className="text-lg font-bold font-sans text-foreground mb-1.5">
              Zero-Dependency Client SDK
            </h3>
            <p className="text-xs font-sans text-muted-foreground leading-relaxed">
              Written in TypeScript with full type exports. Handles PKCE
              challenge generation, session storage, automated token refresh,
              and authenticated fetch requests.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-2">
            {/* Diagram SVG: Universal Client SDK Architecture */}
            <div className="w-full min-h-26 mb-2 border border-border bg-muted/40 p-2.5 flex items-center justify-center">
              <svg
                className="w-full h-auto max-h-24"
                fill="none"
                viewBox="0 0 460 84"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Hairline Axes & Grid Alignment */}
                <line
                  x1="8"
                  y1="42"
                  x2="452"
                  y2="42"
                  stroke="currentColor"
                  strokeOpacity="0.12"
                  strokeWidth="1"
                />
                <line
                  x1="145"
                  y1="6"
                  x2="145"
                  y2="78"
                  stroke="currentColor"
                  strokeOpacity="0.15"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <line
                  x1="300"
                  y1="6"
                  x2="300"
                  y2="78"
                  stroke="currentColor"
                  strokeOpacity="0.15"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />

                {/* Box 1: Core Type System */}
                <g
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="1"
                  fill="currentColor"
                  fillOpacity="0.06"
                >
                  <rect x="8" y="18" width="128" height="48" rx="4" />
                </g>
                <g fill="currentColor" fontFamily="monospace">
                  <text
                    x="72"
                    y="37"
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                    letterSpacing="0.5"
                  >
                    TYPE SYSTEM
                  </text>
                  <text
                    x="72"
                    y="52"
                    fontSize="8"
                    fillOpacity="0.7"
                    textAnchor="middle"
                  >
                    Strict TS Generics
                  </text>
                </g>

                {/* Arrow 1 */}
                <line
                  x1="136"
                  y1="42"
                  x2="162"
                  y2="42"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                  strokeWidth="1.2"
                />
                <polygon points="160,39 166,42 160,45" fill="currentColor" />

                {/* Box 2: Auto PKCE Engine */}
                <g
                  stroke="currentColor"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                  fill="currentColor"
                  fillOpacity="0.08"
                >
                  <rect x="168" y="18" width="124" height="48" rx="4" />
                </g>
                <g fill="currentColor" fontFamily="monospace">
                  <text
                    x="230"
                    y="37"
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                    letterSpacing="0.5"
                  >
                    AUTO PKCE
                  </text>
                  <text
                    x="230"
                    y="52"
                    fontSize="8"
                    fillOpacity="0.7"
                    textAnchor="middle"
                  >
                    Built-in Crypto
                  </text>
                </g>

                {/* Arrow 2 */}
                <line
                  x1="292"
                  y1="42"
                  x2="318"
                  y2="42"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                  strokeWidth="1.2"
                />
                <polygon points="316,39 322,42 316,45" fill="currentColor" />

                {/* Box 3: Runtime Footprint */}
                <g
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                  fill="currentColor"
                  fillOpacity="0.1"
                >
                  <rect x="324" y="18" width="128" height="48" rx="4" />
                </g>
                <g fill="currentColor" fontFamily="monospace">
                  <text
                    x="388"
                    y="37"
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                    letterSpacing="0.5"
                  >
                    ZERO DEPS
                  </text>
                  <text
                    x="388"
                    y="52"
                    fontSize="8"
                    fillOpacity="0.7"
                    textAnchor="middle"
                  >
                    3.8 KB ESM Bundle
                  </text>
                </g>
              </svg>
            </div>

            {/* 3 Metrics Cards */}
            <div className="text-xs bg-card p-4 border border-border grid grid-cols-3 gap-2 shadow-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground">SIZE</span>
                <span className="font-bold text-foreground text-sm">
                  3.8 KB
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Brotli
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground">TYPES</span>
                <span className="font-bold text-foreground text-sm">100%</span>
                <span className="text-[10px] text-muted-foreground">
                  Strict TS
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground">
                  RUNTIMES
                </span>
                <span className="font-bold text-foreground text-sm">Any</span>
                <span className="text-[10px] text-muted-foreground">
                  Edge + Node
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilityMatrixSection;
