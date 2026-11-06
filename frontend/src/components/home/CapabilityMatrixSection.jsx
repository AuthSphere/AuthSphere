import React, { useState } from "react";

export const CapabilityMatrixSection = () => {
  const [revoked, setRevoked] = useState(false);
  const [btnText, setBtnText] = useState("Invalidate All");
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleDemoRevoke = () => {
    setRevoked(true);
    setBtnText("Revoked (Sync 4ms)");
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
      className="w-full max-w-340 mx-auto px-6 lg:px-12 py-20 border-b border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#09090c] isolate"
    >
      <div className="max-w-2xl mb-12">
        <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
          02 // Capability Matrix
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Everything your authentication layer needs.
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
          Engineered from the ground up for strict security posture, high
          developer velocity, and zero vendor lock-in.
        </p>
      </div>

      {/* 4 Asymmetric Blocks */}
      <div className="border-t border-neutral-300 dark:border-neutral-800 font-mono">
        {/* Block 1: Providers */}
        <div className="py-8 border-b border-neutral-300 dark:border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
          <div className="lg:col-span-3 text-xs text-neutral-500 dark:text-neutral-400">
            01 // PROVIDERS
          </div>
          <div className="lg:col-span-4">
            <h3 className="text-lg font-bold font-sans text-neutral-900 dark:text-white mb-1.5">
              Multi-Tenant OAuth Adapters
            </h3>
            <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Native adapters for Google, GitHub, and Discord. Pre-wired state
              parameter hashing, CSRF cookie verification, and standardized
              identity profiles.
            </p>
          </div>
          <div className="lg:col-span-5 text-xs bg-white dark:bg-neutral-900 p-4 border border-neutral-300 dark:border-neutral-800 flex flex-col gap-2 shadow-xs">
            {/* Diagram SVG */}
            <div className="w-full h-20 mb-2 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0c0d10] p-1.5 flex items-center justify-center">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 420 70"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.4" strokeWidth="0.5">
                  <line x1="10" x2="410" y1="35" y2="35" />
                  <line
                    strokeDasharray="2 4"
                    x1="130"
                    x2="130"
                    y1="5"
                    y2="65"
                  />
                  <line
                    strokeDasharray="2 4"
                    x1="290"
                    x2="290"
                    y1="5"
                    y2="65"
                  />
                </g>
                <g strokeWidth="1.25">
                  <rect
                    fill="currentColor"
                    fillOpacity="0.06"
                    height="16"
                    rx="2"
                    width="68"
                    x="10"
                    y="8"
                  />
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7.5"
                    fontWeight="600"
                    x="16"
                    y="19"
                  >
                    GOOGLE OIDC
                  </text>
                  <rect
                    fill="currentColor"
                    fillOpacity="0.06"
                    height="16"
                    rx="2"
                    width="68"
                    x="10"
                    y="27"
                  />
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7.5"
                    fontWeight="600"
                    x="16"
                    y="38"
                  >
                    GITHUB v3
                  </text>
                  <rect
                    fill="currentColor"
                    fillOpacity="0.06"
                    height="16"
                    rx="2"
                    width="68"
                    x="10"
                    y="46"
                  />
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7.5"
                    fontWeight="600"
                    x="16"
                    y="57"
                  >
                    DISCORD v10
                  </text>
                  <path d="M 78 16 L 130 35" opacity="0.8" />
                  <path d="M 78 35 L 130 35" opacity="0.8" />
                  <path d="M 78 54 L 130 35" opacity="0.8" />
                  <rect
                    fill="currentColor"
                    fillOpacity="0.1"
                    height="34"
                    rx="3"
                    width="110"
                    x="130"
                    y="18"
                  />
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="8"
                    fontWeight="600"
                    x="138"
                    y="33"
                  >
                    STATE GATE
                  </text>
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7"
                    opacity="0.7"
                    x="138"
                    y="44"
                  >
                    CSRF &amp; Nonce Sync
                  </text>
                  <line opacity="0.9" x1="240" x2="290" y1="35" y2="35" />
                  <polygon fill="currentColor" points="288,32 295,35 288,38" />
                  <rect
                    fill="currentColor"
                    fillOpacity="0.12"
                    height="34"
                    rx="3"
                    width="115"
                    x="295"
                    y="18"
                  />
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="8"
                    fontWeight="600"
                    x="302"
                    y="33"
                  >
                    NORMALIZED
                  </text>
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7"
                    opacity="0.7"
                    x="302"
                    y="44"
                  >
                    Uniform Token Matrix
                  </text>
                </g>
                <g strokeWidth="1">
                  <circle cx="130" cy="35" fill="currentColor" r="2.5" />
                  <circle cx="240" cy="35" fill="currentColor" r="2.5" />
                </g>
              </svg>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>ACTIVE PROVIDERS</span>
              <span>NORMALIZATION</span>
            </div>
            <div className="flex gap-4 font-semibold text-neutral-900 dark:text-white">
              <span>Google (OIDC)</span>
              <span>GitHub</span>
              <span>Discord</span>
            </div>
            <div className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-200 dark:border-neutral-800">
              Payload: &#123; id: &quot;usr_99x&quot;, email:
              &quot;dev@authsphere.io&quot;, verified: true &#125;
            </div>
          </div>
        </div>

        {/* Block 2: Cryptography */}
        <div className="py-8 border-b border-neutral-300 dark:border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
          <div className="lg:col-span-3 text-xs text-neutral-500 dark:text-neutral-400">
            02 // CRYPTOGRAPHY
          </div>
          <div className="lg:col-span-4">
            <h3 className="text-lg font-bold font-sans text-neutral-900 dark:text-white mb-1.5">
              PKCE &amp; Token Rotation
            </h3>
            <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400 leading-relaxed">
              SHA-256 S256 code challenge generation and single-use refresh
              token cycling. Immediate invalidation upon replay attempt.
            </p>
          </div>
          <div className="lg:col-span-5 text-xs bg-white dark:bg-neutral-900 p-4 border border-neutral-300 dark:border-neutral-800 flex flex-col gap-2 shadow-xs">
            {/* Diagram SVG */}
            <div className="w-full h-20 mb-2 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0c0d10] p-1.5 flex items-center justify-center">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 420 70"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.35" strokeWidth="0.5">
                  <line x1="15" x2="405" y1="35" y2="35" />
                  <line
                    strokeDasharray="2 4"
                    x1="120"
                    x2="120"
                    y1="8"
                    y2="62"
                  />
                  <line
                    strokeDasharray="2 4"
                    x1="280"
                    x2="280"
                    y1="8"
                    y2="62"
                  />
                </g>
                <g strokeWidth="1.25">
                  <rect
                    fill="currentColor"
                    fillOpacity="0.06"
                    height="36"
                    rx="2"
                    width="95"
                    x="15"
                    y="17"
                  />
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7.5"
                    fontWeight="600"
                    x="22"
                    y="32"
                  >
                    CODE VERIFIER
                  </text>
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7"
                    opacity="0.7"
                    x="22"
                    y="44"
                  >
                    43-128 Random Octets
                  </text>
                  <line x1="110" x2="140" y1="35" y2="35" />
                  <polygon fill="currentColor" points="138,32 144,35 138,38" />
                  <rect
                    fill="currentColor"
                    fillOpacity="0.1"
                    height="40"
                    rx="2"
                    width="120"
                    x="144"
                    y="15"
                  />
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="8"
                    fontWeight="600"
                    x="152"
                    y="31"
                  >
                    SHA-256 (S256)
                  </text>
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7"
                    opacity="0.7"
                    x="152"
                    y="43"
                  >
                    BASE64URL_ENCODE
                  </text>
                  <line x1="264" x2="295" y1="35" y2="35" />
                  <polygon fill="currentColor" points="293,32 300,35 293,38" />
                  <rect
                    fill="currentColor"
                    fillOpacity="0.12"
                    height="36"
                    rx="2"
                    width="105"
                    x="300"
                    y="17"
                  />
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7.5"
                    fontWeight="600"
                    x="308"
                    y="32"
                  >
                    CODE CHALLENGE
                  </text>
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7"
                    opacity="0.7"
                    x="308"
                    y="44"
                  >
                    1-Use Atomic Vault
                  </text>
                </g>
                <circle cx="204" cy="50" fill="currentColor" r="2" />
              </svg>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>CODE CHALLENGE</span>
              <span>S256 ENFORCED</span>
            </div>
            <div className="text-neutral-900 dark:text-neutral-100 select-all truncate text-[11px]">
              E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
            </div>
            <div className="flex justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-200 dark:border-neutral-800">
              <span>ROTATION: ATOMIC 1-USE</span>
              <span>REPLAY PROTECTION: YES</span>
            </div>
          </div>
        </div>

        {/* Block 3: Concurrency / Real-Time Invalidation Bus */}
        <div className="py-8 border-b border-neutral-300 dark:border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
          <div className="lg:col-span-3 text-xs text-neutral-500 dark:text-neutral-400">
            03 // CONCURRENCY
          </div>
          <div className="lg:col-span-4">
            <h3 className="text-lg font-bold font-sans text-neutral-900 dark:text-white mb-1.5">
              Real-Time Invalidation Bus
            </h3>
            <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400 leading-relaxed">
              WebSocket-based instant revocation. Dropping a session on one
              terminal destroys active credentials across all connected devices
              in under 10ms.
            </p>
          </div>
          <div className="lg:col-span-5 text-xs bg-white dark:bg-neutral-900 p-4 border border-neutral-300 dark:border-neutral-800 flex flex-col gap-2 shadow-xs">
            {/* Diagram SVG */}
            <div className="w-full h-20 mb-2 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0c0d10] p-1.5 flex items-center justify-center">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 420 70"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.4" strokeWidth="0.5">
                  <circle cx="210" cy="35" r="26" strokeDasharray="2 4" />
                  <circle cx="210" cy="35" r="16" />
                  <line x1="20" x2="400" y1="35" y2="35" />
                </g>
                <g strokeWidth="1.2">
                  <rect
                    fill="currentColor"
                    fillOpacity="0.08"
                    height="30"
                    rx="2"
                    width="95"
                    x="15"
                    y="20"
                  />
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7.5"
                    fontWeight="600"
                    x="22"
                    y="34"
                  >
                    CLIENT TERMINAL
                  </text>
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7"
                    opacity="0.7"
                    x="22"
                    y="44"
                  >
                    Revoke Trigger
                  </text>
                  <path d="M 110 35 L 194 35" />
                  <polygon fill="currentColor" points="191,32 198,35 191,38" />
                  <circle cx="210" cy="35" fill="currentColor" r="4" />
                  <path d="M 226 35 L 305 35" />
                  <polygon fill="currentColor" points="302,32 309,35 302,38" />
                  <rect
                    fill="currentColor"
                    fillOpacity="0.08"
                    height="30"
                    rx="2"
                    width="95"
                    x="310"
                    y="20"
                  />
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7.5"
                    fontWeight="600"
                    x="318"
                    y="34"
                  >
                    BROADCAST BUS
                  </text>
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7"
                    opacity="0.7"
                    x="318"
                    y="44"
                  >
                    &lt;10ms Cross-Device
                  </text>
                  <path d="M 210 19 L 210 10 L 310 10" strokeDasharray="2 3" />
                  <path d="M 210 51 L 210 60 L 310 60" strokeDasharray="2 3" />
                </g>
              </svg>
            </div>
            <div className="flex justify-between items-center text-neutral-500">
              <span>SESSION BROADCAST</span>
              <button
                onClick={handleDemoRevoke}
                disabled={btnDisabled}
                className="underline text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 font-mono text-[11px] cursor-pointer disabled:opacity-60"
                id="demo-revoke-btn"
              >
                {btnText}
              </button>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-700 dark:text-neutral-300">
                  MacBook Pro (Chrome)
                </span>
                <span
                  className={
                    revoked
                      ? "text-neutral-400 font-mono text-[10px] font-semibold"
                      : "font-semibold text-neutral-900 dark:text-white"
                  }
                  id="session-tag-1"
                >
                  {revoked ? "TERMINATED" : "CONNECTED"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-700 dark:text-neutral-300">
                  iPhone 15 (Safari)
                </span>
                <span
                  className={
                    revoked
                      ? "text-neutral-400 font-mono text-[10px] font-semibold"
                      : "font-semibold text-neutral-900 dark:text-white"
                  }
                  id="session-tag-2"
                >
                  {revoked ? "TERMINATED" : "CONNECTED"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-700 dark:text-neutral-300">
                  Ubuntu Daemon
                </span>
                <span
                  className={
                    revoked
                      ? "text-neutral-400 font-mono text-[10px] font-semibold"
                      : "font-semibold text-neutral-900 dark:text-white"
                  }
                  id="session-tag-3"
                >
                  {revoked ? "TERMINATED" : "CONNECTED"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Block 4: Specification / Zero-Dependency SDK */}
        <div className="py-8 border-b border-neutral-300 dark:border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
          <div className="lg:col-span-3 text-xs text-neutral-500 dark:text-neutral-400">
            04 // SPECIFICATION
          </div>
          <div className="lg:col-span-4">
            <h3 className="text-lg font-bold font-sans text-neutral-900 dark:text-white mb-1.5">
              Zero-Dependency Client SDK
            </h3>
            <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Pure TypeScript, 100% type inference, zero runtime bloat. Executes
              cleanly across Cloudflare Workers, Vercel Edge, Deno, Bun, and
              standard Node.js.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-2">
            {/* Diagram SVG */}
            <div className="w-full h-20 mb-2 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0c0d10] p-1.5 flex items-center justify-center">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 420 70"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.4" strokeWidth="0.5">
                  <line x1="15" x2="405" y1="35" y2="35" />
                  <line
                    strokeDasharray="2 4"
                    x1="135"
                    x2="135"
                    y1="8"
                    y2="62"
                  />
                  <line
                    strokeDasharray="2 4"
                    x1="280"
                    x2="280"
                    y1="8"
                    y2="62"
                  />
                </g>
                <g strokeWidth="1.2">
                  <rect
                    fill="currentColor"
                    fillOpacity="0.08"
                    height="32"
                    rx="2"
                    width="100"
                    x="15"
                    y="19"
                  />
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7.5"
                    fontWeight="600"
                    x="22"
                    y="33"
                  >
                    CORE TYPE SYSTEM
                  </text>
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7"
                    opacity="0.7"
                    x="22"
                    y="43"
                  >
                    100% Strict Generics
                  </text>
                  <line x1="115" x2="150" y1="35" y2="35" />
                  <polygon fill="currentColor" points="148,32 155,35 148,38" />
                  <rect
                    fill="currentColor"
                    fillOpacity="0.1"
                    height="32"
                    rx="2"
                    width="105"
                    x="155"
                    y="19"
                  />
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7.5"
                    fontWeight="600"
                    x="162"
                    y="33"
                  >
                    WEB CRYPTO API
                  </text>
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7"
                    opacity="0.7"
                    x="162"
                    y="43"
                  >
                    Zero External Node Deps
                  </text>
                  <line x1="260" x2="295" y1="35" y2="35" />
                  <polygon fill="currentColor" points="293,32 300,35 293,38" />
                  <rect
                    fill="currentColor"
                    fillOpacity="0.12"
                    height="32"
                    rx="2"
                    width="105"
                    x="300"
                    y="19"
                  />
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7.5"
                    fontWeight="600"
                    x="308"
                    y="33"
                  >
                    ESM / CJS BUNDLE
                  </text>
                  <text
                    fill="currentColor"
                    fontFamily="monospace"
                    fontSize="7"
                    opacity="0.7"
                    x="308"
                    y="43"
                  >
                    Edge Boundary 3.8KB
                  </text>
                </g>
                <circle cx="135" cy="35" fill="currentColor" r="2" />
                <circle cx="280" cy="35" fill="currentColor" r="2" />
              </svg>
            </div>

            {/* 3 Metrics Cards */}
            <div className="text-xs bg-white dark:bg-neutral-900 p-4 border border-neutral-300 dark:border-neutral-800 grid grid-cols-3 gap-2 shadow-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-neutral-500">SIZE</span>
                <span className="font-bold text-neutral-900 dark:text-white text-sm">
                  3.8 KB
                </span>
                <span className="text-[10px] text-neutral-500">Brotli</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-neutral-500">TYPES</span>
                <span className="font-bold text-neutral-900 dark:text-white text-sm">
                  100%
                </span>
                <span className="text-[10px] text-neutral-500">Strict TS</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-neutral-500">RUNTIMES</span>
                <span className="font-bold text-neutral-900 dark:text-white text-sm">
                  Any
                </span>
                <span className="text-[10px] text-neutral-500">
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
