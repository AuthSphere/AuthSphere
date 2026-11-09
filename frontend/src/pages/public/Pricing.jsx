import React from "react";
import {
  Shield,
  Lock,
  ArrowRight,
  Check,
  Github,
  Heart,
  Server,
  Database,
  Code2,
  ExternalLink,
  Layers,
  Scale,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Pricing = () => {
  const faqs = [
    {
      id: "faq-license",
      question: "Is AuthSphere completely free for commercial products?",
      answer:
        "Yes. AuthSphere is released under the permissive MIT license. You can freely use, modify, distribute, and embed the code in commercial or private products without paying royalties or fees.",
    },
    {
      id: "faq-self-host",
      question: "Why choose self-hosted authentication over managed SaaS?",
      answer:
        "Managed authentication services typically charge per Monthly Active User (MAU), which quickly escalates into thousands of dollars per month as your app grows. Self-hosting AuthSphere keeps your user records and session data entirely on your own infrastructure with zero per-user billing.",
    },
    {
      id: "faq-security",
      question: "How are passwords and session tokens secured?",
      answer:
        "Passwords are hashed using bcrypt with 10 salt rounds. During registration and updates, passwords are automatically checked against the HaveIBeenPwned database via 5-character SHA-1 k-anonymity to block known compromised credentials. Access tokens use HMAC-SHA256 (HS256) with 15-minute expiration, and refresh tokens are 40-byte cryptographically random strings backed by native MongoDB TTL indexes.",
    },
    {
      id: "faq-providers",
      question: "Which OAuth providers are supported?",
      answer:
        "AuthSphere supports Google, GitHub, Discord, Microsoft, LinkedIn, GitLab, Twitch, and Bitbucket with OAuth 2.0 and PKCE S256 challenge verification, plus local credentials with optional email verification codes.",
    },
    {
      id: "faq-sustainability",
      question: "How is AuthSphere sustained without subscription fees?",
      answer:
        "AuthSphere is developed independently as free software. Infrastructure costs, server upkeep, and new features are supported through community contributions on GitHub and developer sponsorships on Patreon.",
    },
  ];

  const guarantees = [
    {
      icon: Scale,
      title: "Permissive MIT License",
      description:
        "Complete freedom for commercial and personal projects. Modify, redistribute, or embed in client apps without licensing restrictions.",
    },
    {
      icon: Database,
      title: "Full Data Sovereignty",
      description:
        "User records, password hashes, and active sessions live in your own MongoDB. No third-party access or hidden data harvesting.",
    },
    {
      icon: Layers,
      title: "Zero MAU Invoices",
      description:
        "Whether you serve 50 users or 500,000, AuthSphere will never send a bill. Capacity depends entirely on your server hardware.",
    },
    {
      icon: Lock,
      title: "PKCE S256 Protection",
      description:
        "Standard authorization code flow with SHA-256 challenge generation for Google, GitHub, Discord, and supported providers.",
    },
    {
      icon: Shield,
      title: "HaveIBeenPwned Defense",
      description:
        "Automatic k-anonymity verification against hundreds of millions of exposed passwords during signup and credential changes.",
    },
    {
      icon: Code2,
      title: "Single-Use Token Rotation",
      description:
        "40-byte random refresh tokens with automatic rotation and instant Socket.io real-time session eviction upon logout.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground relative isolate">
      {/* Precision Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-background">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-muted/40 dark:to-black/60" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-20">
        {/* Humanized Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              MIT Licensed Open Source
            </span>
            <span className="text-xs text-muted-foreground hidden md:inline">
              Self-host on any Linux server, Docker, or bare metal
            </span>
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            No subscription tiers · No per-user fees
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            Authentication infrastructure
            <br />
            <span className="text-muted-foreground font-normal">
              that you actually own.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            AuthSphere is free software built for developers who want full
            control over their user authentication without artificial paywalls,
            per-user seat pricing, or vendor lock-in. Run it on your own server,
            connect your database, and keep your credentials private.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/AuthSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 h-10 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all"
            >
              <Github className="h-4 w-4" />
              <span>Clone on GitHub</span>
            </a>
            <Link
              to="/docs"
              className="inline-flex items-center justify-center gap-2 px-5 h-10 rounded-md text-xs font-medium border border-border text-foreground hover:bg-muted bg-card transition-all"
            >
              <span>Read Documentation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="https://www.patreon.com/cw/AuthSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 h-10 rounded-md text-xs font-medium border border-border text-foreground hover:bg-muted bg-card transition-all"
            >
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              <span>Back on Patreon</span>
            </a>
          </div>
        </div>

        {/* Featured Open Source Contract Card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="p-8 sm:p-10 border-b border-border bg-muted/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Core Open Source Promise
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  $0 forever. Run it on your terms.
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Commercial auth providers typically lure projects with a free
                  tier that transitions into hefty monthly bills as soon as user
                  activity grows. AuthSphere offers the complete implementation
                  open source from day one: no tier caps, no gated SSO, and no
                  surprise invoices.
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end justify-center p-5 rounded-lg border border-border bg-card shrink-0">
                <span className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono">
                  $0
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  Full MIT License
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  Unlimited self-hosted users
                </span>
              </div>
            </div>
          </div>

          {/* 6 Core Commitments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {guarantees.slice(0, 3).map((item, idx) => (
              <div key={idx} className="p-6 sm:p-7 space-y-3">
                <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-foreground">
                  <item.icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-t border-border">
            {guarantees.slice(3, 6).map((item, idx) => (
              <div key={idx} className="p-6 sm:p-7 space-y-3">
                <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-foreground">
                  <item.icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Real Cost of Self-Hosting Transparency Card */}
        <div className="rounded-xl border border-border bg-card p-7 sm:p-9 space-y-6 shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Infrastructure Reality
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              What does self-hosting actually cost?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Software is free, but computers still cost electricity. Here is
              what you need to run AuthSphere reliably in production on your own
              terms:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-lg border border-border bg-muted/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Server className="h-4 w-4" />
                <span>Compute (VPS / Node)</span>
              </div>
              <div className="text-lg font-bold text-foreground font-mono">
                ~$4 to $6 / mo
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Any standard Linux VPS (1 CPU, 1GB RAM) on Hetzner,
                DigitalOcean, or an existing Kubernetes cluster.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-border bg-muted/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Database className="h-4 w-4" />
                <span>MongoDB Storage</span>
              </div>
              <div className="text-lg font-bold text-foreground font-mono">
                $0 / mo
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Run locally on the same server or connect to a free-tier MongoDB
                Atlas cluster for lightweight workloads.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-border bg-muted/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>AuthSphere License</span>
              </div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                $0 forever
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Permissive MIT license. No licensing fees, no renewal traps, and
                no telemetry restrictions.
              </p>
            </div>
          </div>
        </div>

        {/* Humanized Technical FAQs */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Clear Answers
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-border bg-card rounded-lg px-5 shadow-xs"
              >
                <AccordionTrigger className="text-left py-4 hover:no-underline text-xs sm:text-sm font-semibold text-foreground cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4 pt-1 font-sans">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Community & Sponsorship Card */}
        <div className="rounded-xl border border-border bg-card p-8 sm:p-10 text-center space-y-4 shadow-xs">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Built by developers. Maintained in the open.
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            AuthSphere is an independent open-source project. If it saves your
            team time and money, consider starring our GitHub repository,
            reporting bugs, or backing server maintenance on Patreon.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/AuthSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 h-10 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all"
            >
              <Github className="h-4 w-4" />
              <span>Explore GitHub Repository</span>
            </a>
            <a
              href="https://www.patreon.com/cw/AuthSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 h-10 rounded-md text-xs font-medium border border-border text-foreground hover:bg-muted bg-card transition-all"
            >
              <Heart className="h-4 w-4 text-rose-500" />
              <span>Support on Patreon</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
