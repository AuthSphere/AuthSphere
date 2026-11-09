import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useAuthStore from "@/store/authStore";

export const FinalCtaSection = () => {
  const { user } = useAuthStore();

  return (
    <section className="w-full bg-background text-foreground py-24 border-b border-border isolate">
      <div className="max-w-340 mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
        <div className="max-w-3xl flex flex-col items-center gap-6">
          <div className="text-[11px] font-mono tracking-widest text-muted-foreground uppercase">
            START BUILDING
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Build your next application.
            <br />
            We&apos;ll handle the identity layer.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
            Explore AuthSphere and start building authentication into your next
            project with clean APIs, open standards, and total runtime autonomy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to={user ? "/dashboard" : "/login"}
              className="inline-flex items-center justify-center gap-2 px-7 h-11 rounded-md bg-primary text-primary-foreground font-mono text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
            >
              <span>{user ? "Go to Dashboard" : "Get Started"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/AuthSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-md bg-card text-foreground border border-border hover:border-foreground/40 font-mono text-xs font-semibold transition-all cursor-pointer"
            >
              <span>View on GitHub</span>
            </a>
          </div>
          <div className="text-[11px] font-mono text-muted-foreground pt-3">
            Free &amp; Open Source forever. MIT Licensed. Zero vendor lock-in.
            Self-hostable.
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
