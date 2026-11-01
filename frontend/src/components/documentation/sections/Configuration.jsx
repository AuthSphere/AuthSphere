import React from "react";
import { Settings2, ShieldCheck, Mail, Zap, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Configuration = () => {
  return (
    <article className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-3">
        <Badge
          variant="outline"
          className="bg-primary/5 text-primary border-primary/20"
        >
          Policy Engine v1.2
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          Project Configuration & Policy Engine
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          AuthSphere provides a centralized command center for your identity
          policies. Changes made in the dashboard are propagated across our
          global edge nodes in under 2 seconds.
        </p>
      </div>

      <div className="space-y-16">
        {/* Security Policies */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Identity Security Policies</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold flex items-center gap-2">
                Strict Verification
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When enabled, the system enforces a <strong>hard-block</strong>{" "}
                on unverified users. No JWTs will be issued until the user
                successfully clears the email challenge. Recommended for
                production environments to prevent account-takeover vectors.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold flex items-center gap-2">
                Adaptive Rate Limiting
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Protects your project from brute-force attempts. Our engine
                analyzes login velocity and automatically blacklists suspicious
                IPs. You can configure custom thresholds for critical endpoints
                like <code>/login</code> and <code>/register</code>.
              </p>
            </div>
          </div>
        </section>

        {/* Network & CORS */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Network & Origin Security</h3>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            AuthSphere utilizes a dynamic Origin policy engine. Every SDK
            request must contain an <code>Origin</code>
            header matching your whitelist. Requests from unauthorized origins
            are rejected with a <code>403 Forbidden</code> response.
          </p>

          <div className="p-6 rounded-2xl border bg-card/50 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Best Practices
            </h4>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {[
                "Avoid wildcards (*) in production.",
                "Explicitly list dev/staging subdomains.",
                "Enable HSTS on all client origins.",
                "Use separate projects for Dev and Prod.",
              ].map((li, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-[11px] text-muted-foreground"
                >
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  {li}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Brand Configuration */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Settings2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">
              Brand Syncing & Template Orchestration
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Every project includes a dedicated **Email Customization
                Engine**. You can override the default system appearance to
                match your application's design system.
              </p>
              <ul className="space-y-2">
                {[
                  "Primary brand color for buttons and links",
                  "Custom logo URL for email headers",
                  "Configurable Support, Privacy, and Security URLs",
                  "Technical metadata visibility toggles",
                ].map((li, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-indigo-500" />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-2xl border bg-card/30 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Test Delivery
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Before going live, use the integrated **Deliverability Tester**.
                It sends a real-world render of your template to your specific
                inbox, allowing you to catch layout issues across different
                email clients (Gmail, Outlook, Apple Mail).
              </p>
            </div>
          </div>
        </section>

        {/* Real-time propagation */}
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4 items-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold">
              Real-time Policy Synchronization
            </h4>
            <p className="text-xs text-muted-foreground">
              When you toggle a security policy, the AuthSphere SDKs in the wild
              receive the update in real-time via our persistent socket bridge,
              ensuring zero-lag security enforcement.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Configuration;
