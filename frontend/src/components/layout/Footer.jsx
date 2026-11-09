import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";
import watermarkDark from "@/assets/authsphere-watermark-dark.png";
import watermarkLight from "@/assets/authsphere-watermark-light.png";
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
  Share2,
} from "lucide-react";
import { AUTHTSPHERE_SOCIAL_CHANNELS } from "@/constants/socialLinks";

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
    <footer className="w-full bg-card text-card-foreground border-t border-border relative isolate overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 pb-16 border-b border-border">
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground leading-[1.15]">
              Open-source identity and access management for autonomous
              developers.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
              Native PKCE S256, cryptographically isolated multi-tenant
              environments, and real-time WebSocket telemetry without
              third-party tracking.
            </p>
          </div>

          {/* Quick Action Cluster */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
            {/* Terminal Copy Snippet */}
            <div className="group flex items-center justify-between gap-3 h-10 px-4 rounded-md bg-muted/50 border border-border hover:border-border/80 transition-colors shadow-xs">
              <div className="flex items-center gap-2.5">
                <Terminal className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="font-mono text-[13px] text-foreground">
                  npm i @authspherejs/sdk
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCommand}
                aria-label="Copy SDK install command"
                className="p-1.5 -mr-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-ring shrink-0"
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
              <Shield className="h-4 w-4 text-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Architecture
              </h3>
            </div>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
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
                    className="hover:text-foreground transition-colors"
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
              <Code2 className="h-4 w-4 text-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Integrations
              </h3>
            </div>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
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
                    className="hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources & Platform */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-4 w-4 text-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Platform &amp; Specs
              </h3>
            </div>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/docs"
                  className="hover:text-foreground transition-colors"
                >
                  Documentation &amp; API
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing &amp; Scale Tiers
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-foreground transition-colors"
                >
                  Developer Console
                </Link>
              </li>
              <li className="flex items-center justify-between group cursor-default pt-1">
                <span className="group-hover:text-foreground transition-colors">
                  RFC-7636 (PKCE S256)
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-mono border border-border">
                  ENFORCED
                </span>
              </li>
              <li className="flex items-center justify-between group cursor-default">
                <span className="group-hover:text-foreground transition-colors">
                  RFC-7519 (HS256 JWT)
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono border border-emerald-500/20">
                  ACTIVE
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Social Accounts */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Share2 className="h-4 w-4 text-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Community &amp; Social
              </h3>
            </div>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              {AUTHTSPHERE_SOCIAL_CHANNELS.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between hover:text-foreground transition-colors group"
                  >
                    <span className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 opacity-75 group-hover:opacity-100 transition-opacity text-current" />
                      <span>{item.name}</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Typographic Architectural Watermark Logo */}
        <div
          aria-hidden="true"
          className="w-full flex items-center justify-center py-6 sm:py-10 select-none pointer-events-none overflow-hidden"
        >
          <img
            src={watermarkDark}
            alt="AuthSphere Watermark"
            className="hidden dark:block w-full max-w-4xl h-auto max-h-24 sm:max-h-36 md:max-h-44 object-contain opacity-25 hover:opacity-35 transition-opacity"
          />
          <img
            src={watermarkLight}
            alt="AuthSphere Watermark"
            className="block dark:hidden w-full max-w-4xl h-auto max-h-24 sm:max-h-36 md:max-h-44 object-contain opacity-20 hover:opacity-30 transition-opacity"
          />
        </div>
      </div>

      {/* Bottom Legal & Telemetry Bar */}
      <div className="w-full border-t border-border bg-muted/20 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          {/* Brand & Copyright */}
          <div className="flex items-center gap-3">
            <AuthSphereLogo className="w-5 h-5 text-foreground" />
            <span className="font-medium text-foreground">AuthSphere</span>
            <span className="text-border">|</span>
            <span>© 2026 Core Infrastructure.</span>
          </div>

          {/* Official Social Channels Strip */}
          <div className="flex items-center gap-2">
            {AUTHTSPHERE_SOCIAL_CHANNELS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.name} (${item.handle})`}
                title={`${item.name} (${item.handle})`}
                className="p-2 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80 transition-all shadow-xs"
              >
                <item.icon className="w-4 h-4 text-current" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
