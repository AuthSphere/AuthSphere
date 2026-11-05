import React from "react";
import { Link } from "react-router-dom";
import useAuthStore from "@/store/authStore";

export const HeroSection = () => {
  const { user } = useAuthStore();

  return (
    <section className="relative w-full max-w-[1360px] mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-20 border-b border-[#ded8cb] dark:border-[#222329] bg-[#F6F4EE] dark:bg-[#09090c] isolate">
      {/* Background Architectural Grid with Transit-Flow SVG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20 dark:opacity-15">
        <svg
          className="w-full h-full object-cover"
          fill="none"
          preserveAspectRatio="none"
          stroke="currentColor"
          viewBox="0 0 1400 680"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              height="40"
              id="heroArchitecturalGrid"
              patternUnits="userSpaceOnUse"
              width="40"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeWidth="0.5"
              />
              <circle
                cx="40"
                cy="0"
                fill="currentColor"
                opacity="0.6"
                r="0.75"
              />
            </pattern>
          </defs>
          <rect fill="url(#heroArchitecturalGrid)" height="100%" width="100%" />
          <g strokeWidth="0.75">
            <line
              opacity="0.4"
              stroke="currentColor"
              strokeDasharray="2 6"
              x1="80"
              x2="1320"
              y1="120"
              y2="120"
            />
            <line
              opacity="0.4"
              stroke="currentColor"
              strokeDasharray="2 6"
              x1="80"
              x2="1320"
              y1="540"
              y2="540"
            />
            <line
              opacity="0.3"
              stroke="currentColor"
              x1="280"
              x2="280"
              y1="40"
              y2="640"
            />
            <line
              opacity="0.3"
              stroke="currentColor"
              x1="880"
              x2="880"
              y1="40"
              y2="640"
            />
            <path
              className="transit-flow"
              d="M 140 120 L 360 120 L 480 240 L 780 240 L 880 140 L 1180 140"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              className="transit-flow"
              d="M 220 540 L 420 540 L 560 400 L 860 400 L 980 520 L 1260 520"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M 480 240 L 560 400"
              opacity="0.6"
              stroke="currentColor"
              strokeDasharray="3 3"
              strokeWidth="0.75"
            />
            <path
              d="M 780 240 L 860 400"
              opacity="0.6"
              stroke="currentColor"
              strokeDasharray="3 3"
              strokeWidth="0.75"
            />
            <circle cx="140" cy="120" fill="currentColor" r="3" />
            <circle cx="480" cy="240" fill="currentColor" r="3.5" />
            <circle cx="780" cy="240" fill="currentColor" r="3.5" />
            <circle cx="1180" cy="140" fill="currentColor" r="3" />
            <circle cx="220" cy="540" fill="currentColor" r="3" />
            <circle cx="560" cy="400" fill="currentColor" r="3.5" />
            <circle cx="860" cy="400" fill="currentColor" r="3.5" />
            <circle cx="1260" cy="520" fill="currentColor" r="3" />
          </g>
          <g
            fill="currentColor"
            fontFamily="monospace"
            fontSize="8.5"
            opacity="0.65"
          >
            <text x="145" y="110">
              [X:0x7F] NODE_OIDC_01
            </text>
            <text x="485" y="230">
              [COORD_GATE] SHA-256_HASH
            </text>
            <text x="785" y="230">
              [ROTATION_VAULT] 0xAE19
            </text>
            <text x="1185" y="130">
              [EDGE_CLIENT] RFC_7636
            </text>
            <text x="225" y="555">
              [WS_BUS_ORIGIN]
            </text>
            <text x="865" y="415">
              [DEVICE_REVOKE] 10ms
            </text>
          </g>
          <g stroke="currentColor" strokeWidth="0.75">
            <path d="M 40 40 L 60 40 M 50 30 L 50 50" />
            <path d="M 1340 40 L 1360 40 M 1350 30 L 1350 50" />
            <path d="M 40 640 L 60 640 M 50 630 L 50 650" />
            <path d="M 1340 640 L 1360 640 M 1350 630 L 1350 650" />
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative">
        {/* Left Column: Editorial Hero Pitch */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 dark:text-neutral-400 tracking-wider uppercase">
            <span className="inline-block w-2 h-2 bg-neutral-900 dark:bg-white" />
            <span>ARCHIVAL SPECIFICATION // RFC-7636 PKCE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight text-neutral-900 dark:text-white leading-[1.08] text-balance">
            Authentication infrastructure.
            <br />
            <span className="font-normal text-neutral-500 dark:text-neutral-400">
              Engineered for autonomy.
            </span>
          </h1>

          <p className="text-base text-neutral-700 dark:text-neutral-300 max-w-xl leading-relaxed font-normal">
            A minimal, zero-telemetry OAuth2 &amp; session engine designed for
            developers who demand cryptographic certainty without proprietary
            SaaS vendor lock-in.
          </p>

          {/* CTA Cluster */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={user ? "/dashboard" : "/login"}
              className="inline-flex items-center justify-center gap-2 px-5 h-10 rounded-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-mono font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
            >
              <span>Initialize AuthSphere</span>
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>

            <a
              href="https://github.com/madhav9757/AuthSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-sm bg-transparent border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 hover:border-black dark:hover:border-white transition-all text-xs font-mono font-medium"
            >
              <svg
                aria-hidden="true"
                className="w-3.5 h-3.5 fill-current"
                viewBox="0 0 24 24"
              >
                <path
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  fillRule="evenodd"
                />
              </svg>
              <span>src / v1.0.4</span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-500 dark:text-neutral-400">
                ★ 1.2k
              </span>
            </a>
          </div>

          {/* Technical Specs Strip */}
          <div className="pt-8 mt-2 border-t border-neutral-300 dark:border-neutral-800 grid grid-cols-3 gap-6 font-mono text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider">
                Footprint
              </span>
              <span className="font-semibold text-neutral-900 dark:text-white">
                3.8 KB ESM
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider">
                Runtime
              </span>
              <span className="font-semibold text-neutral-900 dark:text-white">
                Web Crypto Native
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider">
                Telemetry
              </span>
              <span className="font-semibold text-neutral-900 dark:text-white">
                Strict Zero (0%)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Technical Polyhedral Canvas */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full max-w-[480px] border border-neutral-300 dark:border-neutral-800 bg-[#FAF8F3] dark:bg-[#0c0d10] shadow-sm">
            {/* FIG 01 Bar */}
            <div className="flex items-center justify-between border-b border-neutral-300 dark:border-neutral-800 px-3 py-2 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-neutral-900 dark:bg-neutral-100" />
                <span>FIG. 01 — CRYPTOGRAPHIC TOPOLOGY</span>
              </div>
              <span className="text-neutral-500">RFC 7636</span>
            </div>

            {/* SVG Interactive Rotating Geometry */}
            <div className="w-full h-[400px] flex items-center justify-center p-2">
              <svg
                className="w-full h-full"
                fill="none"
                viewBox="0 0 520 520"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    height="20"
                    id="archGrid"
                    patternUnits="userSpaceOnUse"
                    width="20"
                  >
                    <path
                      className="stroke-neutral-300 dark:stroke-neutral-800"
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      strokeWidth="0.75"
                    />
                  </pattern>
                </defs>
                <rect
                  fill="url(#archGrid)"
                  height="480"
                  opacity="0.65"
                  width="480"
                  x="20"
                  y="20"
                />
                <circle
                  className="stroke-neutral-400 dark:stroke-neutral-700"
                  cx="260"
                  cy="260"
                  r="200"
                  strokeDasharray="2 4"
                  strokeWidth="1"
                />
                <circle
                  className="stroke-neutral-400 dark:stroke-neutral-700"
                  cx="260"
                  cy="260"
                  r="130"
                  strokeWidth="0.75"
                />
                <line
                  className="stroke-neutral-400 dark:stroke-neutral-700"
                  strokeWidth="0.75"
                  x1="260"
                  x2="260"
                  y1="30"
                  y2="490"
                />
                <line
                  className="stroke-neutral-400 dark:stroke-neutral-700"
                  strokeWidth="0.75"
                  x1="30"
                  x2="490"
                  y1="260"
                  y2="260"
                />
                <g>
                  <polygon
                    className="dark:fill-white"
                    fill="#090909"
                    points="260,70 430,170 380,360 260,260"
                    stroke="#090909"
                    strokeWidth="1.5"
                  >
                    <animateTransform
                      attributeName="transform"
                      dur="60s"
                      from="0 260 260"
                      repeatCount="indefinite"
                      to="360 260 260"
                      type="rotate"
                    />
                  </polygon>
                  <polygon
                    className="dark:fill-neutral-800"
                    fill="#E5E0D4"
                    points="260,70 90,170 140,360 260,260"
                    stroke="#090909"
                    strokeWidth="1.5"
                  >
                    <animateTransform
                      attributeName="transform"
                      dur="60s"
                      from="0 260 260"
                      repeatCount="indefinite"
                      to="360 260 260"
                      type="rotate"
                    />
                  </polygon>
                  <polygon
                    className="dark:fill-neutral-900"
                    fill="#FAF8F3"
                    points="140,360 260,450 380,360 260,260"
                    stroke="#090909"
                    strokeWidth="1.5"
                  >
                    <animateTransform
                      attributeName="transform"
                      dur="60s"
                      from="0 260 260"
                      repeatCount="indefinite"
                      to="360 260 260"
                      type="rotate"
                    />
                  </polygon>
                </g>
                <g>
                  <polygon
                    className="stroke-neutral-900 dark:stroke-white"
                    fill="none"
                    points="260,150 360,210 360,310 260,370 160,310 160,210"
                    strokeWidth="1.5"
                  >
                    <animateTransform
                      attributeName="transform"
                      dur="40s"
                      from="360 260 260"
                      repeatCount="indefinite"
                      to="0 260 260"
                      type="rotate"
                    />
                  </polygon>
                </g>
                <text
                  className="fill-neutral-600 dark:fill-neutral-400"
                  fontFamily="monospace"
                  fontSize="10"
                  letterSpacing="1.5"
                  x="32"
                  y="50"
                >
                  ENFORCED_STATE::S256
                </text>
                <text
                  className="fill-neutral-600 dark:fill-neutral-400"
                  fontFamily="monospace"
                  fontSize="10"
                  letterSpacing="1.5"
                  textAnchor="end"
                  x="488"
                  y="50"
                >
                  KEY_EXCHANGE::AES-GCM
                </text>
                <text
                  className="fill-neutral-500 dark:fill-neutral-500"
                  fontFamily="monospace"
                  fontSize="9"
                  letterSpacing="1"
                  x="32"
                  y="475"
                >
                  ROUND_TRIP &lt; 1.2ms
                </text>
                <text
                  className="fill-neutral-600 dark:fill-neutral-400"
                  fontFamily="monospace"
                  fontSize="9"
                  letterSpacing="1.5"
                  textAnchor="end"
                  x="488"
                  y="475"
                >
                  AUTH_BUS::SYNC
                </text>
              </svg>
            </div>

            {/* Bottom Status strip */}
            <div className="flex items-center justify-between border-t border-neutral-300 dark:border-neutral-800 px-3 py-1.5 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100/50 dark:bg-neutral-900/50">
              <span>DAEMON STATUS: OPERATIONAL</span>
              <span className="text-neutral-500">SHA-256 S256 VALIDATED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
