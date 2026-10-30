import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Zap,
  Lock,
  Server,
  Database,
  Activity,
  Fingerprint,
  GitBranch,
  Network,
  Key,
  Cpu,
  Webhook,
  ArrowRight,
  Download,
  CheckCircle2,
} from "lucide-react";
import { usePWA } from "@/hooks/usePWA";
import ErrorCodes from "@/components/home/ErrorCodes"; // Added import

/* ── Entrance animation keyframes injected once ── */
const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  .anim-fade-up {
    opacity: 0;
    animation: fadeUp 0.55s cubic-bezier(.16,1,.3,1) forwards;
  }
`;

/* ── Tiny stat row ── */
const Stat = ({ label, value, color }) => (
  <div className="flex items-end justify-between py-3 border-b border-border/40 last:border-0">
    <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-[0.13em]">
      {label}
    </span>
    <span
      className={`text-xl font-semibold tracking-tight tabular-nums ${color}`}
    >
      {value}
    </span>
  </div>
);

/* ── Trust badge pill ── */
const TrustPill = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
    {children}
  </span>
);

/* ════════════════════════════════════════════════════════════════ */
const Hero = ({ user, errorCodes }) => {
  const { isInstallable, installPWA } = usePWA();
  return (
    <section className="relative pt-28 pb-36 overflow-hidden">
      <style>{STYLES}</style>
      {/* ── Minimalist ambient glow ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="h-[350px] w-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      {/* ── Main layout ── */}
      <div className="relative z-20 mx-auto w-[92%] max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-start justify-between">
          {/* ─── Left: copy ─── */}
          <div className="flex-1 lg:pt-8 max-w-2xl">
            <div
              className="anim-fade-up mb-6"
              style={{ animationDelay: "80ms" }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-[80px] font-semibold tracking-[-0.04em] leading-[0.9] text-foreground">
                AuthSphere
                <br />
                <span className="text-muted-foreground/60 font-light">
                  Identity Mesh
                </span>
              </h1>
            </div>
            {/* Body */}
            <div
              className="anim-fade-up mb-10"
              style={{ animationDelay: "160ms" }}
            >
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                The distributed IAM engine for global scale. Open-source,{" "}
                <span className="text-foreground font-medium">
                  sub-millisecond latency
                </span>
                , and architected for modern microservices.
              </p>
            </div>
            {/* CTAs */}
            <div
              className="anim-fade-up flex flex-col sm:flex-row flex-wrap gap-3 mb-10"
              style={{ animationDelay: "240ms" }}
            >
              <Button
                asChild
                size="lg"
                className="h-11 px-7 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium transition-all"
              >
                <Link to={user ? "/dashboard" : "/register"}>
                  {user ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 px-7 rounded-full border-border/70 bg-transparent hover:bg-muted/50 text-sm font-medium transition-all"
              >
                <a
                  href="https://github.com/madhav9757/AuthSphere"
                  target="_blank"
                  rel="noreferrer"
                >
                  <GitBranch className="mr-2 h-3.5 w-3.5" />
                  Source Code
                </a>
              </Button>
              {isInstallable && (
                <Button
                  onClick={installPWA}
                  size="lg"
                  className="h-11 px-7 rounded-full border border-primary/20 bg-primary/8 text-primary hover:bg-primary/15 text-sm font-medium transition-all"
                >
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Install App
                </Button>
              )}
            </div>
            {/* Trust signals */}
            <div
              className="anim-fade-up flex flex-wrap items-center gap-x-5 gap-y-2"
              style={{ animationDelay: "320ms" }}
            >
              <TrustPill>OAuth 2.1 compliant</TrustPill>
              <TrustPill>RS256 · PKCE · MFA</TrustPill>
              <TrustPill>Open source · MIT</TrustPill>
            </div>
          </div>
          {/* ─── Right: Interactive/Data Demo ─── */}
          <div
            className="flex-1 w-full lg:max-w-xl xl:max-w-2xl relative anim-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            <ErrorCodes errorCodes={errorCodes} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
