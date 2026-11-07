import React from "react";

export const ArchitectureSpecification = ({
  className = "",
  showFooter = true,
}) => {
  return (
    <div
      className={`w-full flex flex-col font-sans select-none text-neutral-800 dark:text-neutral-200 ${className}`}
    >
      {/* Top Protocol Status Eyebrow */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-neutral-500 dark:text-neutral-400 pb-3 border-b border-neutral-200/80 dark:border-neutral-800/80 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
          <span>01 // IDENTITY INGRESS</span>
        </div>
        <div className="text-neutral-400 dark:text-neutral-600">◆</div>
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>02 // CRYPTO ENCLAVE</span>
        </div>
        <div className="text-neutral-400 dark:text-neutral-600">◆</div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
          <span>03 // CLIENT EGRESS</span>
        </div>
      </div>

      {/* Main SVG Blueprint Visualization */}
      <div className="relative w-full aspect-16/10 min-h-100 max-h-135 bg-white/70 dark:bg-[#07080a]/90 rounded-lg border border-neutral-200/80 dark:border-[#202127] p-2 overflow-hidden shadow-xs">
        <svg
          viewBox="0 0 1000 620"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Fine Blueprint Cartesian Grid */}
            <pattern
              id="archGrid"
              width="25"
              height="25"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 25 0 L 0 0 0 25"
                fill="none"
                className="stroke-neutral-200/50 dark:stroke-neutral-800/40"
                strokeWidth="0.5"
              />
            </pattern>

            {/* Glowing Enclave Halo */}
            <radialGradient id="enclavePulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E68A" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#00E68A" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#00E68A" stopOpacity="0" />
            </radialGradient>

            {/* Ingress Stream Gradient */}
            <linearGradient id="ingressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00E68A" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00E68A" stopOpacity="0.9" />
            </linearGradient>

            {/* Keyframe flow animation */}
            <style>{`
              @keyframes dashMove {
                to {
                  stroke-dashoffset: -32;
                }
              }
              .bus-animated {
                stroke-dasharray: 4 6;
                animation: dashMove 1.8s linear infinite;
              }
              .bus-slow {
                stroke-dasharray: 5 7;
                animation: dashMove 2.8s linear infinite;
              }
            `}</style>
          </defs>

          {/* Background Grid Layer */}
          <rect width="1000" height="620" fill="url(#archGrid)" />

          {/* Concentric Cryptographic Field Radii around Core */}
          <circle
            cx="500"
            cy="310"
            r="170"
            className="stroke-neutral-300/40 dark:stroke-neutral-700/30"
            strokeWidth="0.75"
            strokeDasharray="3 5"
          />
          <circle
            cx="500"
            cy="310"
            r="130"
            className="stroke-emerald-500/20 dark:stroke-emerald-400/20"
            strokeWidth="0.75"
            strokeDasharray="2 4"
          />
          <circle cx="500" cy="310" r="90" fill="url(#enclavePulse)" />

          {/* ZONE MARKERS & COORDINATES (Top Hairline Axis) */}
          <g className="font-mono text-[9px] fill-neutral-400 dark:fill-neutral-500">
            {/* Left Zone */}
            <path
              d="M 90 42 L 80 42 L 80 52"
              className="stroke-neutral-400 dark:stroke-neutral-600"
              strokeWidth="1"
            />
            <text x="96" y="46">
              ZONE_01 // INGRESS_MATRIX
            </text>
            <text x="180" y="32" textAnchor="middle">
              0x10
            </text>
            <line
              x1="180"
              y1="36"
              x2="180"
              y2="44"
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth="0.75"
            />
            <text x="340" y="32" textAnchor="middle">
              0x30
            </text>
            <line
              x1="340"
              y1="36"
              x2="340"
              y2="44"
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth="0.75"
            />

            {/* Center Zone */}
            <text x="500" y="46" textAnchor="middle">
              ZONE_02 // HSM_SECURITY_ELEMENT
            </text>
            <text x="500" y="32" textAnchor="middle">
              0x50_CORE
            </text>
            <line
              x1="500"
              y1="36"
              x2="500"
              y2="44"
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth="0.75"
            />

            {/* Right Zone */}
            <text x="660" y="32" textAnchor="middle">
              0x70
            </text>
            <line
              x1="660"
              y1="36"
              x2="660"
              y2="44"
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth="0.75"
            />
            <text x="820" y="32" textAnchor="middle">
              0x90_EGRESS
            </text>
            <line
              x1="820"
              y1="36"
              x2="820"
              y2="44"
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth="0.75"
            />
            <text x="904" y="46" textAnchor="end">
              ZONE_03 // CLIENT_RUNTIME
            </text>
            <path
              d="M 910 52 L 910 42 L 900 42"
              className="stroke-neutral-400 dark:stroke-neutral-600"
              strokeWidth="1"
            />
          </g>

          {/* INTERCONNECT BUSES (High-Precision Orthogonal Circuit Lines) */}
          {/* Wire 1: Google -> State Gate */}
          <path
            d="M 235 150 L 290 150 L 290 205 L 320 205"
            className="stroke-neutral-400/80 dark:stroke-neutral-600"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <path
            d="M 235 150 L 290 150 L 290 205 L 320 205"
            className="stroke-neutral-800 dark:stroke-neutral-200 bus-animated"
            strokeWidth="1.2"
          />
          <text
            x="245"
            y="142"
            className="font-mono text-[7.5px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
          >
            CHALLENGE_VERIFY
          </text>

          {/* Wire 2: State Gate -> Chip */}
          <path
            d="M 380 205 L 435 205"
            className="stroke-neutral-400/80 dark:stroke-neutral-600"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <circle
            cx="435"
            cy="205"
            r="2.5"
            className="fill-neutral-800 dark:fill-white"
          />

          {/* Wire 3: GitHub -> Central Chip Direct Bus */}
          <path
            d="M 235 310 L 435 310"
            className="stroke-neutral-400/80 dark:stroke-neutral-600"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <path
            d="M 235 310 L 435 310"
            className="stroke-emerald-600 dark:stroke-emerald-400 bus-slow"
            strokeWidth="1.5"
          />
          <text
            x="250"
            y="302"
            className="font-mono text-[7.5px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
          >
            INGRESS_PRIMARY_BUS
          </text>
          <circle cx="435" cy="310" r="2.5" className="fill-emerald-500" />

          {/* Wire 4: Discord -> PKCE S256 */}
          <path
            d="M 235 470 L 290 470 L 290 415 L 320 415"
            className="stroke-neutral-400/80 dark:stroke-neutral-600"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <path
            d="M 235 470 L 290 470 L 290 415 L 320 415"
            className="stroke-neutral-800 dark:stroke-neutral-200 bus-animated"
            strokeWidth="1.2"
          />
          <text
            x="245"
            y="478"
            className="font-mono text-[7.5px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
          >
            SCOPES_NORMALIZATION
          </text>

          {/* Wire 5: PKCE -> Chip */}
          <path
            d="M 380 415 L 435 415"
            className="stroke-neutral-400/80 dark:stroke-neutral-600"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <circle
            cx="435"
            cy="415"
            r="2.5"
            className="fill-neutral-800 dark:fill-white"
          />

          {/* Wire 6: Chip -> Token Mint */}
          <path
            d="M 565 205 L 620 205"
            className="stroke-neutral-400/80 dark:stroke-neutral-600"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <circle
            cx="565"
            cy="205"
            r="2.5"
            className="fill-neutral-800 dark:fill-white"
          />

          {/* Wire 7: Token Mint -> Web App */}
          <path
            d="M 680 205 L 710 205 L 710 150 L 765 150"
            className="stroke-neutral-400/80 dark:stroke-neutral-600"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <path
            d="M 680 205 L 710 205 L 710 150 L 765 150"
            className="stroke-neutral-800 dark:stroke-neutral-200 bus-animated"
            strokeWidth="1.2"
          />
          <text
            x="640"
            y="142"
            className="font-mono text-[7.5px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
          >
            BEARER_TOKEN // HTTP_ONLY
          </text>

          {/* Wire 8: Chip -> Client API Service Direct Bus */}
          <path
            d="M 565 310 L 765 310"
            className="stroke-neutral-400/80 dark:stroke-neutral-600"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <path
            d="M 565 310 L 765 310"
            className="stroke-emerald-600 dark:stroke-emerald-400 bus-slow"
            strokeWidth="1.5"
          />
          <text
            x="615"
            y="302"
            className="font-mono text-[7.5px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
          >
            MUTUAL_TLS // INTROSPECT
          </text>
          <circle cx="565" cy="310" r="2.5" className="fill-emerald-500" />

          {/* Wire 9: Chip -> Key Vault */}
          <path
            d="M 565 415 L 620 415"
            className="stroke-neutral-400/80 dark:stroke-neutral-600"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <circle
            cx="565"
            cy="415"
            r="2.5"
            className="fill-neutral-800 dark:fill-white"
          />

          {/* Wire 10: Key Vault -> Mobile Client */}
          <path
            d="M 680 415 L 710 415 L 710 470 L 765 470"
            className="stroke-neutral-400/80 dark:stroke-neutral-600"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <path
            d="M 680 415 L 710 415 L 710 470 L 765 470"
            className="stroke-neutral-800 dark:stroke-neutral-200 bus-animated"
            strokeWidth="1.2"
          />
          <text
            x="640"
            y="478"
            className="font-mono text-[7.5px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
          >
            KEYCHAIN // AES_256_SEED
          </text>

          {/* LEFT NODES (Identity Ingress) */}
          {/* Node 1: Google Identity */}
          <g transform="translate(85, 115)">
            <rect
              width="150"
              height="70"
              rx="6"
              className="fill-white dark:fill-[#101115] stroke-neutral-200 dark:stroke-[#26272e]"
              strokeWidth="1.2"
            />
            {/* Google G Icon */}
            <g transform="translate(14, 18)">
              <circle
                cx="16"
                cy="16"
                r="14"
                className="fill-neutral-100 dark:fill-neutral-800/80"
              />
              <path
                d="M 21.5 16.5 C 21.5 15.9 21.4 15.3 21.3 14.8 L 16 14.8 L 16 17.5 L 19.1 17.5 C 19 18.2 18.5 19 17.8 19.4 L 17.8 21 L 19.9 21 C 21.1 19.9 21.5 18.3 21.5 16.5 Z"
                fill="#4285F4"
              />
              <path
                d="M 16 22 C 17.6 22 19 21.5 19.9 20.7 L 17.8 19.1 C 17.3 19.4 16.7 19.6 16 19.6 C 14.5 19.6 13.2 18.6 12.8 17.2 L 10.6 17.2 L 10.6 18.9 C 11.7 21 13.7 22 16 22 Z"
                fill="#34A853"
              />
              <path
                d="M 12.8 17.2 C 12.6 16.8 12.5 16.4 12.5 16 C 12.5 15.6 12.6 15.2 12.8 14.8 L 12.8 13.1 L 10.6 13.1 C 10.2 14 10 15 10 16 C 10 17 10.2 18 10.6 18.9 L 12.8 17.2 Z"
                fill="#FBBC05"
              />
              <path
                d="M 16 12.4 C 16.9 12.4 17.7 12.7 18.3 13.3 L 20.2 11.4 C 19 10.3 17.6 9.6 16 9.6 C 13.7 9.6 11.7 10.6 10.6 12.7 L 12.8 14.4 C 13.2 13 14.5 12.4 16 12.4 Z"
                fill="#EA4335"
              />
            </g>
            <text
              x="54"
              y="32"
              className="font-sans font-semibold text-[13px] fill-neutral-900 dark:fill-white tracking-tight"
            >
              Google Identity
            </text>
            <circle cx="136" cy="24" r="2" className="fill-emerald-500" />
            <text
              x="54"
              y="46"
              className="font-mono text-[9px] fill-neutral-500 dark:fill-neutral-400"
            >
              OIDC // OAUTH 2.0
            </text>
            <text
              x="54"
              y="58"
              className="font-mono text-[8.5px] fill-neutral-400 dark:fill-neutral-500"
            >
              [PORT_01]
            </text>
          </g>

          {/* Node 2: GitHub Core */}
          <g transform="translate(85, 275)">
            <rect
              width="150"
              height="70"
              rx="6"
              className="fill-white dark:fill-[#101115] stroke-neutral-200 dark:stroke-[#26272e]"
              strokeWidth="1.2"
            />
            {/* GitHub Octocat Icon */}
            <g transform="translate(14, 18)">
              <circle
                cx="16"
                cy="16"
                r="14"
                className="fill-neutral-100 dark:fill-neutral-800/80"
              />
              <path
                d="M 16 8 C 11.6 8 8 11.6 8 16 C 8 19.5 10.3 22.5 13.5 23.6 C 13.9 23.7 14 23.4 14 23.2 C 14 23.0 14 22.5 14 21.8 C 11.8 22.3 11.3 20.8 11.3 20.8 C 10.9 19.9 10.4 19.6 10.4 19.6 C 9.7 19.1 10.5 19.1 10.5 19.1 C 11.3 19.2 11.7 19.9 11.7 19.9 C 12.4 21.1 13.5 20.8 13.9 20.6 C 14 20.1 14.2 19.7 14.4 19.5 C 12.6 19.3 10.8 18.6 10.8 15.5 C 10.8 14.6 11.1 13.9 11.6 13.3 C 11.5 13.1 11.2 12.3 11.7 11.2 C 11.7 11.2 12.4 11 13.9 12 C 14.6 11.8 15.3 11.7 16 11.7 C 16.7 11.7 17.4 11.8 18.1 12 C 19.6 11 20.3 11.2 20.3 11.2 C 20.8 12.3 20.5 13.1 20.4 13.3 C 20.9 13.9 21.2 14.6 21.2 15.5 C 21.2 18.6 19.4 19.3 17.6 19.5 C 17.9 19.8 18.1 20.3 18.1 21 C 18.1 22 18.1 22.9 18.1 23.2 C 18.1 23.4 18.2 23.7 18.6 23.6 C 21.7 22.5 24 19.5 24 16 C 24 11.6 20.4 8 16 8 Z"
                className="fill-neutral-900 dark:fill-white"
              />
            </g>
            <text
              x="54"
              y="32"
              className="font-sans font-semibold text-[13px] fill-neutral-900 dark:fill-white tracking-tight"
            >
              GitHub Core
            </text>
            <circle cx="136" cy="24" r="2" className="fill-emerald-500" />
            <text
              x="54"
              y="46"
              className="font-mono text-[9px] fill-neutral-500 dark:fill-neutral-400"
            >
              SSO // USER:EMAIL
            </text>
            <text
              x="54"
              y="58"
              className="font-mono text-[8.5px] fill-neutral-400 dark:fill-neutral-500"
            >
              [PORT_02]
            </text>
          </g>

          {/* Node 3: Discord v10 */}
          <g transform="translate(85, 435)">
            <rect
              width="150"
              height="70"
              rx="6"
              className="fill-white dark:fill-[#101115] stroke-neutral-200 dark:stroke-[#26272e]"
              strokeWidth="1.2"
            />
            {/* Discord Icon */}
            <g transform="translate(14, 18)">
              <circle
                cx="16"
                cy="16"
                r="14"
                className="fill-neutral-100 dark:fill-neutral-800/80"
              />
              <path
                d="M 21.5 12 C 20.3 11.4 19 11 17.6 10.8 C 17.4 11.2 17.2 11.7 17.1 12 C 15.6 11.8 14.1 11.8 12.6 12 C 12.4 11.7 12.2 11.2 12.1 10.8 C 10.7 11 9.4 11.4 8.2 12 C 6 15.4 5.4 18.6 5.7 21.8 C 7.3 23 8.8 23.8 10.3 24.3 C 10.7 23.8 11 23.2 11.3 22.6 C 10.8 22.4 10.2 22.1 9.8 21.8 C 9.9 21.7 10 21.6 10.1 21.5 C 13.2 23 16.5 23 19.6 21.5 C 19.7 21.6 19.8 21.7 19.9 21.8 C 19.4 22.1 18.9 22.4 18.4 22.6 C 18.7 23.2 19 23.8 19.4 24.3 C 20.9 23.8 22.4 23 24 21.8 C 24.3 18.1 23.4 14.9 21.5 12 Z M 11.3 19.3 C 10.4 19.3 9.7 18.5 9.7 17.5 C 9.7 16.5 10.4 15.7 11.3 15.7 C 12.2 15.7 12.9 16.5 12.9 17.5 C 12.9 18.5 12.2 19.3 11.3 19.3 Z M 18.4 19.3 C 17.5 19.3 16.8 18.5 16.8 17.5 C 16.8 16.5 17.5 15.7 18.4 15.7 C 19.3 15.7 20 16.5 20 17.5 C 20 18.5 19.3 19.3 18.4 19.3 Z"
                fill="#5865F2"
              />
            </g>
            <text
              x="54"
              y="32"
              className="font-sans font-semibold text-[13px] fill-neutral-900 dark:fill-white tracking-tight"
            >
              Discord v10
            </text>
            <circle cx="136" cy="24" r="2" className="fill-emerald-500" />
            <text
              x="54"
              y="46"
              className="font-mono text-[9px] fill-neutral-500 dark:fill-neutral-400"
            >
              OAUTH 2.0 // GUILDS
            </text>
            <text
              x="54"
              y="58"
              className="font-mono text-[8.5px] fill-neutral-400 dark:fill-neutral-500"
            >
              [PORT_03]
            </text>
          </g>

          {/* INTERMEDIATE GATE BOXES */}
          {/* State Gate */}
          <g transform="translate(320, 185)">
            <rect
              width="60"
              height="40"
              rx="4"
              className="fill-neutral-100 dark:fill-[#12141a] stroke-neutral-300 dark:stroke-[#2a2c36]"
              strokeWidth="1"
            />
            <text
              x="30"
              y="18"
              textAnchor="middle"
              className="font-mono font-bold text-[8.5px] fill-neutral-900 dark:fill-neutral-100 tracking-wider"
            >
              STATE GATE
            </text>
            <text
              x="30"
              y="29"
              textAnchor="middle"
              className="font-mono text-[7px] fill-neutral-500 dark:fill-neutral-400"
            >
              CSRF / NONCE
            </text>
          </g>

          {/* PKCE S256 Gate */}
          <g transform="translate(320, 395)">
            <rect
              width="60"
              height="40"
              rx="4"
              className="fill-neutral-100 dark:fill-[#12141a] stroke-neutral-300 dark:stroke-[#2a2c36]"
              strokeWidth="1"
            />
            <text
              x="30"
              y="18"
              textAnchor="middle"
              className="font-mono font-bold text-[8.5px] fill-neutral-900 dark:fill-neutral-100 tracking-wider"
            >
              PKCE S256
            </text>
            <text
              x="30"
              y="29"
              textAnchor="middle"
              className="font-mono text-[7px] fill-neutral-500 dark:fill-neutral-400"
            >
              SHA-256 HASH
            </text>
          </g>

          {/* CORE CRYPTO ENCLAVE CHIP (Center Component) */}
          <g transform="translate(435, 180)">
            {/* Top IC Package Pins */}
            <g
              className="stroke-neutral-400 dark:stroke-neutral-500"
              strokeWidth="1.2"
            >
              <line x1="25" y1="0" x2="25" y2="-12" />
              <line x1="65" y1="0" x2="65" y2="-12" />
              <line x1="105" y1="0" x2="105" y2="-12" />
            </g>
            <g
              className="font-mono text-[6.5px] fill-neutral-400 dark:fill-neutral-500"
              textAnchor="middle"
            >
              <text x="25" y="-14">
                CLK
              </text>
              <text x="65" y="-14">
                VCC
              </text>
              <text x="105" y="-14">
                GND
              </text>
            </g>

            {/* Bottom IC Package Pins */}
            <g
              className="stroke-neutral-400 dark:stroke-neutral-500"
              strokeWidth="1.2"
            >
              <line x1="25" y1="260" x2="25" y2="272" />
              <line x1="65" y1="260" x2="65" y2="272" />
              <line x1="105" y1="260" x2="105" y2="272" />
            </g>
            <g
              className="font-mono text-[6.5px] fill-neutral-400 dark:fill-neutral-500"
              textAnchor="middle"
            >
              <text x="25" y="280">
                RST
              </text>
              <text x="65" y="280">
                SYNC
              </text>
              <text x="105" y="280">
                TELE
              </text>
            </g>

            {/* Main Chip Body */}
            <rect
              width="130"
              height="260"
              rx="8"
              className="fill-neutral-950 stroke-neutral-800 dark:stroke-[#363842]"
              strokeWidth="1.5"
            />
            {/* Top Header Tag inside Chip */}
            <circle
              cx="16"
              cy="18"
              r="2.5"
              className="fill-emerald-400 animate-pulse"
            />
            <text
              x="24"
              y="21"
              className="font-mono text-[7px] fill-emerald-400 tracking-wider"
            >
              AS-CRYPTO // ENCLAVEEV_2.6
            </text>

            <line
              x1="10"
              y1="32"
              x2="120"
              y2="32"
              className="stroke-neutral-800 dark:stroke-neutral-800"
              strokeWidth="0.75"
            />

            {/* AuthSphere Star Emblem */}
            <g transform="translate(65, 80)">
              <path
                d="M 0 -16 L 3.5 -3.5 L 16 0 L 3.5 3.5 L 0 16 L -3.5 3.5 L -16 0 L -3.5 -3.5 Z"
                className="fill-white"
              />
            </g>

            {/* Brand Title */}
            <text
              x="65"
              y="120"
              textAnchor="middle"
              className="font-sans font-bold text-[14px] fill-white tracking-tight"
            >
              AuthSphere
            </text>
            <text
              x="65"
              y="132"
              textAnchor="middle"
              className="font-mono text-[7px] fill-neutral-400 tracking-widest"
            >
              CORE CRYPTO ENGINE
            </text>

            {/* Chip Internal Register Matrix (3 boxes) */}
            <g transform="translate(10, 160)">
              {/* Box 1: Mint */}
              <rect
                x="0"
                y="0"
                width="34"
                height="65"
                rx="3"
                className="fill-neutral-900 stroke-neutral-800"
                strokeWidth="0.75"
              />
              <text
                x="17"
                y="16"
                textAnchor="middle"
                className="font-mono text-[6px] fill-neutral-500"
              >
                MINT
              </text>
              <text
                x="17"
                y="34"
                textAnchor="middle"
                className="font-mono font-bold text-[8px] fill-white"
              >
                RS256
              </text>
              <text
                x="17"
                y="52"
                textAnchor="middle"
                className="font-mono text-[5.5px] fill-neutral-400"
              >
                JWT SIGN
              </text>

              {/* Box 2: Cipher */}
              <rect
                x="38"
                y="0"
                width="34"
                height="65"
                rx="3"
                className="fill-neutral-900 stroke-neutral-800"
                strokeWidth="0.75"
              />
              <text
                x="55"
                y="16"
                textAnchor="middle"
                className="font-mono text-[6px] fill-neutral-500"
              >
                CIPHER
              </text>
              <text
                x="55"
                y="34"
                textAnchor="middle"
                className="font-mono font-bold text-[7px] fill-white"
              >
                AES-GCM
              </text>
              <text
                x="55"
                y="52"
                textAnchor="middle"
                className="font-mono text-[5.5px] fill-neutral-400"
              >
                256-BIT
              </text>

              {/* Box 3: Vault */}
              <rect
                x="76"
                y="0"
                width="34"
                height="65"
                rx="3"
                className="fill-neutral-900 stroke-neutral-800"
                strokeWidth="0.75"
              />
              <text
                x="93"
                y="16"
                textAnchor="middle"
                className="font-mono text-[6px] fill-neutral-500"
              >
                VAULT
              </text>
              <text
                x="93"
                y="34"
                textAnchor="middle"
                className="font-mono font-bold text-[8px] fill-white"
              >
                REDIS
              </text>
              <text
                x="93"
                y="52"
                textAnchor="middle"
                className="font-mono text-[5.5px] fill-neutral-400"
              >
                STATE SYNC
              </text>
            </g>
          </g>

          {/* RIGHT INTERMEDIARY GATE BOXES */}
          {/* Token Mint */}
          <g transform="translate(620, 185)">
            <rect
              width="60"
              height="40"
              rx="4"
              className="fill-neutral-100 dark:fill-[#12141a] stroke-neutral-300 dark:stroke-[#2a2c36]"
              strokeWidth="1"
            />
            <text
              x="30"
              y="18"
              textAnchor="middle"
              className="font-mono font-bold text-[8.5px] fill-neutral-900 dark:fill-neutral-100 tracking-wider"
            >
              TOKEN MINT
            </text>
            <text
              x="30"
              y="29"
              textAnchor="middle"
              className="font-mono text-[7px] fill-neutral-500 dark:fill-neutral-400"
            >
              RS256 JWT
            </text>
          </g>

          {/* Key Vault */}
          <g transform="translate(620, 395)">
            <rect
              width="60"
              height="40"
              rx="4"
              className="fill-neutral-100 dark:fill-[#12141a] stroke-neutral-300 dark:stroke-[#2a2c36]"
              strokeWidth="1"
            />
            <text
              x="30"
              y="18"
              textAnchor="middle"
              className="font-mono font-bold text-[8.5px] fill-neutral-900 dark:fill-neutral-100 tracking-wider"
            >
              KEY VAULT
            </text>
            <text
              x="30"
              y="29"
              textAnchor="middle"
              className="font-mono text-[7px] fill-neutral-500 dark:fill-neutral-400"
            >
              AES-256-GCM
            </text>
          </g>

          {/* RIGHT NODES (Client Egress) */}
          {/* Node 1: Web Application */}
          <g transform="translate(765, 115)">
            <rect
              width="150"
              height="70"
              rx="6"
              className="fill-white dark:fill-[#101115] stroke-neutral-200 dark:stroke-[#26272e]"
              strokeWidth="1.2"
            />
            {/* Browser Window Icon */}
            <g transform="translate(14, 20)">
              <rect
                width="24"
                height="20"
                rx="3"
                className="fill-neutral-100 dark:fill-neutral-800/80 stroke-neutral-400 dark:stroke-neutral-500"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="6"
                x2="24"
                y2="6"
                className="stroke-neutral-300 dark:stroke-neutral-600"
                strokeWidth="0.75"
              />
              <circle cx="4" cy="3" r="1" className="fill-neutral-400" />
              <circle cx="8" cy="3" r="1" className="fill-neutral-400" />
              <circle cx="12" cy="3" r="1" className="fill-neutral-400" />
            </g>
            <text
              x="50"
              y="32"
              className="font-sans font-semibold text-[13px] fill-neutral-900 dark:fill-white tracking-tight"
            >
              Web Application
            </text>
            <circle cx="140" cy="24" r="2" className="fill-emerald-500" />
            <text
              x="50"
              y="46"
              className="font-mono text-[9px] fill-neutral-500 dark:fill-neutral-400"
            >
              FRONTEND // REACT 19
            </text>
            <text
              x="50"
              y="58"
              className="font-mono text-[8.5px] fill-emerald-600 dark:text-emerald-400 font-semibold"
            >
              [PORT_04] // ACTIVE
            </text>
          </g>

          {/* Node 2: Client API Service */}
          <g transform="translate(765, 275)">
            <rect
              width="150"
              height="70"
              rx="6"
              className="fill-white dark:fill-[#101115] stroke-neutral-200 dark:stroke-[#26272e]"
              strokeWidth="1.2"
            />
            {/* Server Stack Icon */}
            <g transform="translate(14, 20)">
              <rect
                x="2"
                y="1"
                width="22"
                height="9"
                rx="2"
                className="fill-neutral-100 dark:fill-neutral-800/80 stroke-neutral-400 dark:stroke-neutral-500"
                strokeWidth="1"
              />
              <circle cx="6" cy="5.5" r="1" className="fill-emerald-500" />
              <line
                x1="12"
                y1="5.5"
                x2="20"
                y2="5.5"
                className="stroke-neutral-400"
                strokeWidth="1"
              />

              <rect
                x="2"
                y="13"
                width="22"
                height="9"
                rx="2"
                className="fill-neutral-100 dark:fill-neutral-800/80 stroke-neutral-400 dark:stroke-neutral-500"
                strokeWidth="1"
              />
              <circle cx="6" cy="17.5" r="1" className="fill-emerald-500" />
              <line
                x1="12"
                y1="17.5"
                x2="20"
                y2="17.5"
                className="stroke-neutral-400"
                strokeWidth="1"
              />
            </g>
            <text
              x="50"
              y="32"
              className="font-sans font-semibold text-[13px] fill-neutral-900 dark:fill-white tracking-tight"
            >
              Client API Service
            </text>
            <circle cx="140" cy="24" r="2" className="fill-emerald-500" />
            <text
              x="50"
              y="46"
              className="font-mono text-[9px] fill-neutral-500 dark:fill-neutral-400"
            >
              NODE.JS // REST &amp; gRPC
            </text>
            <text
              x="50"
              y="58"
              className="font-mono text-[8.5px] fill-neutral-400 dark:fill-neutral-500"
            >
              [PORT_05] // M2M_AUTH
            </text>
          </g>

          {/* Node 3: Mobile Client */}
          <g transform="translate(765, 435)">
            <rect
              width="150"
              height="70"
              rx="6"
              className="fill-white dark:fill-[#101115] stroke-neutral-200 dark:stroke-[#26272e]"
              strokeWidth="1.2"
            />
            {/* Mobile Phone Icon */}
            <g transform="translate(18, 18)">
              <rect
                width="14"
                height="24"
                rx="3"
                className="fill-neutral-100 dark:fill-neutral-800/80 stroke-neutral-400 dark:stroke-neutral-500"
                strokeWidth="1"
              />
              <circle cx="7" cy="20" r="1" className="fill-neutral-400" />
              <line
                x1="5"
                y1="3"
                x2="9"
                y2="3"
                className="stroke-neutral-400"
                strokeWidth="0.75"
              />
            </g>
            <text
              x="50"
              y="32"
              className="font-sans font-semibold text-[13px] fill-neutral-900 dark:fill-white tracking-tight"
            >
              Mobile Client
            </text>
            <circle cx="140" cy="24" r="2" className="fill-emerald-500" />
            <text
              x="50"
              y="46"
              className="font-mono text-[9px] fill-neutral-500 dark:fill-neutral-400"
            >
              IOS / ANDROID // SDK
            </text>
            <text
              x="50"
              y="58"
              className="font-mono text-[8.5px] fill-neutral-400 dark:fill-neutral-500"
            >
              [PORT_06] // KEYCHAIN
            </text>
          </g>

          {/* BOTTOM CALIBRATION METADATA & CORNER BRACKETS */}
          <g className="font-mono text-[9px] fill-neutral-400 dark:fill-neutral-500">
            <path
              d="M 90 570 L 80 570 L 80 560"
              className="stroke-neutral-400 dark:stroke-neutral-600"
              strokeWidth="1"
            />
            <text x="96" y="567">
              BUS CLK: 100MHz // LATENCY &lt; 1.2ms
            </text>

            <text x="904" y="567" textAnchor="end">
              RFC-7636 PKCE S256 // ENCRYPTED AES-GCM
            </text>
            <path
              d="M 910 560 L 910 570 L 900 570"
              className="stroke-neutral-400 dark:stroke-neutral-600"
              strokeWidth="1"
            />
          </g>
        </svg>
      </div>

      {/* Blueprint Bottom Caption */}
      {showFooter && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 mt-2 gap-2">
          <span>
            Zero-trust cryptographic identity fabric with automated token
            rotation and PKCE S256 verification.
          </span>
          <span className="text-neutral-900 dark:text-neutral-200 font-semibold tracking-wider">
            v2.6.0 - ARCHITECTURE SPECIFICATION
          </span>
        </div>
      )}
    </div>
  );
};

export default ArchitectureSpecification;
