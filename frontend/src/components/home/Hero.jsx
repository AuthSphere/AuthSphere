import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GitBranch, ArrowRight, Download, CheckCircle2 } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";
import ErrorCodes from "@/components/home/ErrorCodes";

const TrustPill = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
    <CheckCircle2 className="h-3.5 w-3.5 text-foreground/70 shrink-0" />
    {children}
  </span>
);

const Hero = ({ user, errorCodes }) => {
  const { isInstallable, installPWA } = usePWA();

  return (
    <section className="relative pt-20 pb-24 border-b border-border/40">
      <div className="mx-auto w-[92%] max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 items-start justify-between">
          {/* Left: copy */}
          <div className="flex-1 lg:pt-4 max-w-2xl">
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
                AuthSphere
                <br />
                <span className="text-muted-foreground font-normal">
                  Developer Identity Mesh
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mb-8">
              Open-source, low-latency authentication engine architected for
              modern web apps and microservices.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8">
              <Button
                asChild
                size="lg"
                className="h-10 px-6 rounded-md bg-foreground text-background hover:bg-foreground/90 text-sm font-medium transition-colors"
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
                className="h-10 px-6 rounded-md border-border bg-card hover:bg-muted text-sm font-medium transition-colors"
              >
                <a
                  href="https://github.com/madhav9757/AuthSphere"
                  target="_blank"
                  rel="noreferrer"
                >
                  <GitBranch className="mr-2 h-3.5 w-3.5" />
                  GitHub
                </a>
              </Button>
              {isInstallable && (
                <Button
                  onClick={installPWA}
                  size="lg"
                  variant="outline"
                  className="h-10 px-6 rounded-md border-border text-sm font-medium transition-colors"
                >
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Install App
                </Button>
              )}
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 border-t border-border/40">
              <TrustPill>OAuth 2.1 compliant</TrustPill>
              <TrustPill>RS256 &bull; PKCE &bull; MFA</TrustPill>
              <TrustPill>Open source &bull; MIT</TrustPill>
            </div>
          </div>

          {/* Right: API Reference preview */}
          <div className="flex-1 w-full lg:max-w-lg xl:max-w-xl">
            <ErrorCodes errorCodes={errorCodes} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
