import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
  Github,
  Twitter,
  DiscIcon,
  BookOpen,
  CreditCard,
  Activity,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-6 py-6 sm:py-8">
        {/* Top */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {/* Brand */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-center gap-2">
              <div className="h-8 w-8 rounded-lg border flex items-center justify-center bg-card">
                <img
                  src="/assets/AuthSphere(main).png"
                  alt="AuthSphere"
                  className="h-5 w-5 object-contain"
                />
              </div>
              <span className="text-base font-semibold tracking-tight">
                AuthSphere
              </span>
            </div>

            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-full flex items-center justify-center">
              <span>
                Secure, modern authentication infrastructure built for
                developers.
              </span>
            </p>
          </div>

          {/* Resources */}
          <div className="space-y-3 pl-20">
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-foreground">
              Resources
            </h4>

            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link
                to="/pricing"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <CreditCard className="h-3.5 w-3.5" />
                Pricing
              </Link>

              <Link
                to="/docs"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Documentation
              </Link>

              <Link
                to="#"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Activity className="h-3.5 w-3.5" />
                Status
              </Link>
            </nav>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-foreground">
              Community
            </h4>

            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link
                to="#"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </Link>

              <Link
                to="#"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Twitter className="h-3.5 w-3.5" />
                Twitter
              </Link>

              <Link
                to="#"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <DiscIcon className="h-3.5 w-3.5" />
                Discord
              </Link>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-6 sm:my-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 AuthSphere. All rights reserved.</p>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium tracking-tight">
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
