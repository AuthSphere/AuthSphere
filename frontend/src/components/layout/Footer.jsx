import React from "react";
import { Link } from "react-router-dom";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter, BookOpen, CreditCard, Activity } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-[#eaeaea] dark:border-[#222329] bg-background">
      <div className="mx-auto max-w-6xl px-6 py-6 sm:py-8">
        {/* Top */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {/* Brand */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <AuthSphereLogo className="w-6 h-6 object-contain" />
              </div>
              <span className="text-base font-semibold tracking-tight text-foreground">
                AuthSphere
              </span>
            </div>

            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Secure, modern authentication infrastructure built for developers.
            </p>
          </div>

          {/* Resources */}
          <div className="space-y-3 pl-0 sm:pl-12">
            <h4 className="text-[12px] font-mono font-semibold uppercase tracking-wider text-foreground">
              Resources
            </h4>

            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link
                to="/pricing"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <CreditCard className="h-3.5 w-3.5" />
                Pricing
              </Link>

              <Link
                to="/docs"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Documentation
              </Link>

              <div className="flex items-center gap-2 text-muted-foreground/70">
                <Activity className="h-3.5 w-3.5" />
                <span>v2.4 Core</span>
              </div>
            </nav>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-mono font-semibold uppercase tracking-wider text-foreground">
              Community
            </h4>

            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href="https://github.com/madhav9757/AuthSphere"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Twitter className="h-3.5 w-3.5" />
                Twitter
              </a>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-6 sm:my-8 bg-[#eaeaea] dark:bg-[#222329]" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <p>© 2026 AuthSphere. All rights reserved.</p>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tracking-tight">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
