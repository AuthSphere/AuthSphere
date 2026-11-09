import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import TechSeparator from "@/components/common/TechSeparator";

const CODE_SNIPPETS = {
  "init.ts": {
    filename: "src/auth.ts",
    code: `// 1. Install & import the official SDK
import AuthSphere from "@authspherejs/sdk";

// 2. Initialize with your project credentials
AuthSphere.initAuth({
  publicKey: "YOUR_PROJECT_PUB_KEY",
  projectId: "YOUR_PROJECT_ID",
  redirectUri: window.location.origin + "/callback",
  baseUrl: "https://auth-sphere-6s2v.vercel.app",
});

// 3. Initiate PKCE OAuth flow (Google, GitHub, Discord)
AuthSphere.redirectToLogin("google");`,
  },
  "callback.ts": {
    filename: "src/callback.ts",
    code: `// Exchange authorization code for authenticated session
import AuthSphere from "@authspherejs/sdk";

export async function handleCallback() {
  try {
    // Automatically validates PKCE code_verifier and retrieves tokens
    const session = await AuthSphere.handleAuthCallback();
    console.log("Authenticated user:", session.user);
    return session;
  } catch (error) {
    console.error("Auth callback failed:", error.message);
  }
}`,
  },
  "session.ts": {
    filename: "src/session.ts",
    code: `import AuthSphere from "@authspherejs/sdk";

// 1. Check session authentication state
if (AuthSphere.isAuthenticated()) {
  const user = AuthSphere.getUser();
  console.log("Active identity:", user.email);
}

// 2. Make authenticated API calls with automatic Bearer token
const response = await AuthSphere.fetchWithAuth("/api/protected-data");
const data = await response.json();

// 3. Terminate session and clear tokens
await AuthSphere.logout();`,
  },
};

export const DeveloperExperienceSection = () => {
  const [activeTab, setActiveTab] = useState("init.ts");
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("npm install @authspherejs/sdk");
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2400);
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeTab].code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <section className="w-full bg-neutral-950 text-neutral-100 py-24 border-b border-border relative isolate">
      {/* Background Ambient SVG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
        <svg
          className="w-full h-full"
          fill="none"
          preserveAspectRatio="none"
          stroke="currentColor"
          viewBox="0 0 1360 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="white" strokeWidth="0.75">
            <path d="M 32 32 L 48 32 M 40 24 L 40 40" />
            <path d="M 1328 32 L 1312 32 M 1320 24 L 1320 40" />
            <path d="M 32 568 L 48 568 M 40 560 L 40 576" />
            <path d="M 1328 568 L 1312 568 M 1320 560 L 1320 576" />
            <line
              opacity="0.35"
              strokeDasharray="4 8"
              x1="40"
              x2="1320"
              y1="40"
              y2="40"
            />
            <line
              opacity="0.35"
              strokeDasharray="4 8"
              x1="40"
              x2="1320"
              y1="560"
              y2="560"
            />
            <line
              opacity="0.2"
              strokeDasharray="2 6"
              x1="560"
              x2="560"
              y1="40"
              y2="560"
            />
          </g>
          <g fill="white" fontFamily="monospace" fontSize="8" opacity="0.7">
            <text x="54" y="36">
              DEVELOPER SDK [WEB CRYPTO]
            </text>
            <text textAnchor="end" x="1304" y="36">
              @authspherejs/sdk
            </text>
          </g>
        </svg>
      </div>

      <div className="max-w-340 mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Editorial Pitch */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase flex items-center">
              <span>03</span>
              <TechSeparator />
              <span>Developer Experience</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Less authentication boilerplate. More building.
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-normal">
              Stop wrestling with OAuth redirection loops, nonce generation, and
              manual refresh cookies. Initialize AuthSphere with a few
              configuration parameters and deliver production-grade
              authentication in minutes.
            </p>

            {/* Quick Install Box */}
            <div className="p-4 rounded-lg bg-card/60 border border-border flex flex-col gap-2 mt-2">
              <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                <span>PACKAGE INSTALLATION</span>
                <span className="text-white">npm / pnpm / yarn</span>
              </div>
              <div className="flex items-center justify-between bg-black px-3 py-2.5 rounded border border-border">
                <span className="font-mono text-xs text-white select-all">
                  npm install @authspherejs/sdk
                </span>
                <button
                  onClick={handleCopyInstall}
                  className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  id="copy-install-btn"
                  title="Copy install command"
                >
                  {copiedInstall ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              {copiedInstall && (
                <div
                  className="text-white font-mono text-[11px]"
                  id="copy-feedback-install"
                >
                  Copied command to clipboard!
                </div>
              )}
            </div>

            {/* Checklist items */}
            <div className="flex flex-col gap-3 pt-3 text-xs font-mono text-neutral-400">
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-white shrink-0 mt-0.5" />
                <span>
                  Zero external cryptography dependencies; utilizes Web Crypto
                  API.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-white shrink-0 mt-0.5" />
                <span>
                  Built-in middleware for Next.js, Express, Fastify, and Remix.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-white shrink-0 mt-0.5" />
                <span>
                  Automatic token exchange with state validation &amp; CSRF
                  protection.
                </span>
              </div>
            </div>
          </div>

          {/* Right: Code Terminal Window */}
          <div className="lg:col-span-7 bg-neutral-900/90 border border-border rounded-lg overflow-hidden shadow-xl">
            {/* Window title bar */}
            <div className="px-4 py-3 bg-neutral-900 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 inline-block" />
                <span className="ml-3 font-mono text-[11px] text-neutral-400">
                  {CODE_SNIPPETS[activeTab].filename}
                </span>
              </div>
              <div>
                <button
                  onClick={handleCopySnippet}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 font-mono text-[11px] text-neutral-300 hover:text-white transition-all cursor-pointer"
                  id="copy-code-btn"
                >
                  {copiedSnippet ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span id="copy-code-label">
                    {copiedSnippet ? "Copied!" : "Copy snippet"}
                  </span>
                </button>
              </div>
            </div>

            {/* Tab strip */}
            <div className="flex items-center gap-1 px-4 pt-2 bg-neutral-900/50 border-b border-border font-mono text-xs">
              {Object.keys(CODE_SNIPPETS).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-t font-medium transition-colors cursor-pointer ${
                    activeTab === tab
                      ? "bg-neutral-950 text-white border-t border-x border-border"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Code Content (Monochrome Syntax) */}
            <pre className="p-6 font-mono text-xs leading-relaxed overflow-x-auto text-neutral-300 bg-neutral-950 select-text">
              <code>{CODE_SNIPPETS[activeTab].code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperExperienceSection;
