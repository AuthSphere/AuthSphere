import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";
import { toast } from "sonner";
import {
  Shield,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Terminal,
  Activity,
  Code2,
  Lock,
} from "lucide-react";

export const Footer = () => {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText("npm install @authspherejs/sdk");
    setCopied(true);
    toast.success("Copied to clipboard: npm install @authspherejs/sdk");
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <footer className="w-full bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 border-t border-neutral-200 dark:border-neutral-800/60 relative isolate overflow-hidden transition-colors duration-300">
      {/* Subtle Matrix Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-12 relative z-10">
        {/* Top Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 pb-16 border-b border-neutral-200 dark:border-neutral-800/60">
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
              Open-source identity and access management for autonomous
              developers.
            </h2>
            <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
              Native PKCE S256, cryptographically isolated multi-tenant
              environments, and real-time WebSocket telemetry without
              third-party tracking.
            </p>
          </div>

          {/* Quick Action Cluster */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
            {/* Terminal Copy Snippet */}
            <div className="group flex items-center justify-between gap-3 h-10 px-4 rounded-md bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-sm">
              <div className="flex items-center gap-2.5">
                <Terminal className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
                <span className="font-mono text-[13px] text-neutral-700 dark:text-neutral-300">
                  npm i @authspherejs/sdk
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCommand}
                aria-label="Copy SDK install command"
                className="p-1.5 -mr-1.5 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Primary Action Button */}
            <Link
              to={user ? "/dashboard" : "/register"}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20 shrink-0"
            >
              <span>
                {user ? "Console Dashboard" : "Initialize AuthSphere"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 py-16">
          {/* Column 1: Architecture */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-4 w-4 text-neutral-900 dark:text-white" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Architecture
              </h3>
            </div>
            <ul className="space-y-3.5 text-sm text-neutral-500 dark:text-neutral-400">
              {[
                "OAuth 2.0 & OIDC Core",
                "Native PKCE S256",
                "Stateless JWT Signing",
                "Stateful Session Revocation",
                "Multi-Tenant Isolation",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={
                      item.includes("OAuth") || item.includes("PKCE")
                        ? "#overview"
                        : "#features"
                    }
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Integrations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="h-4 w-4 text-neutral-900 dark:text-white" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Integrations
              </h3>
            </div>
            <ul className="space-y-3.5 text-sm text-neutral-500 dark:text-neutral-400">
              {[
                "TypeScript Client SDK",
                "Google Identity (OIDC)",
                "GitHub OAuth2 (REST)",
                "Discord OAuth2 (v10)",
                "WebSocket Telemetry Bus",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/docs"
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Security Specs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="h-4 w-4 text-neutral-900 dark:text-white" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Security Specs
              </h3>
            </div>
            <ul className="space-y-3.5 text-sm text-neutral-500 dark:text-neutral-400">
              <li className="flex items-center justify-between group cursor-default">
                <span className="group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                  RFC-7636 (PKCE S256)
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                  ENFORCED
                </span>
              </li>
              <li className="flex items-center justify-between group cursor-default">
                <span className="group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                  RFC-7519 (JWT Tokens)
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                  RS256
                </span>
              </li>
              <li className="flex items-center justify-between group cursor-default">
                <span className="group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                  Argon2id & Bcrypt
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                  HASHING
                </span>
              </li>
              <li className="flex items-center justify-between group cursor-default">
                <span className="group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                  AES-256-GCM Vault
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                  ENCRYPTED
                </span>
              </li>
              <li className="flex items-center justify-between group cursor-default">
                <span className="group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                  Third-Party Telemetry
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  ZERO LEAK
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Ecosystem */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-4 w-4 text-neutral-900 dark:text-white" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Platform
              </h3>
            </div>
            <ul className="space-y-3.5 text-sm text-neutral-500 dark:text-neutral-400">
              <li>
                <a
                  href="https://github.com/AuthSphere"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-neutral-900 dark:hover:text-white transition-colors group"
                >
                  <span>GitHub Organization</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@authspherejs/sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-neutral-900 dark:hover:text-white transition-colors group"
                >
                  <span>NPM Registry</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Documentation & API
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Pricing & Scale Tiers
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Developer Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Elegant Typographic Watermark */}
        <div
          aria-hidden="true"
          className="w-full flex justify-center pb-8 select-none pointer-events-none overflow-hidden"
        >
          <span className="font-sans font-bold text-[12vw] tracking-tighter text-neutral-900/[0.03] dark:text-white/[0.02] leading-none whitespace-nowrap">
            AUTHSPHERE
          </span>
        </div>
      </div>

      {/* Bottom Legal & Telemetry Bar */}
      <div className="w-full border-t border-neutral-200 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/20 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-500 dark:text-neutral-400">
          {/* Brand & Copyright */}
          <div className="flex items-center gap-3">
            <AuthSphereLogo className="w-5 h-5 text-neutral-900 dark:text-white" />
            <span className="font-medium text-neutral-900 dark:text-white">
              AuthSphere
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <span>© 2026 Core Infrastructure.</span>
          </div>

          {/* Cryptographic Architecture Stack */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono tracking-wide">
            <span>REACT 19</span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span>NODE.JS</span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span>MONGODB</span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span>SOCKET.IO</span>
          </div>

          {/* Live Status */}
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-neutral-900 dark:text-white">
              All systems operational
            </span>
            <span className="text-neutral-400 dark:text-neutral-600 ml-1">
              v2.6.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
