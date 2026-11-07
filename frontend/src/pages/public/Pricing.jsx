import React from "react";
import {
  Shield,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Cpu,
  Check,
  Github,
  Heart,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TechSeparator from "@/components/common/TechSeparator";

const Pricing = () => {
  const faqs = [
    {
      id: "faq-01",
      index: "[FAQ_01]",
      question: "Is AuthSphere truly free to self-host?",
      answer:
        "Yes. AuthSphere is released under the permissive MIT License. You can clone the source code, run it locally with Node.js, deploy it to your VPS, or package it into Docker containers with zero licensing fees, zero artificial limits, and no per-user penalties.",
    },
    {
      id: "faq-02",
      index: "[FAQ_02]",
      question: "Can I use AuthSphere for commercial projects?",
      answer:
        "Yes. The MIT license allows both commercial and private use. You have full ownership of your data, database credentials, and user records.",
    },
    {
      id: "faq-03",
      index: "[FAQ_03]",
      question: "How are passwords and tokens secured?",
      answer:
        "Passwords are hashed using bcrypt with 10 salt rounds. During registration and updates, passwords are also checked against the HaveIBeenPwned database via 5-character SHA-1 k-anonymity so compromised passwords are blocked. Access tokens are HMAC-SHA256 (HS256) JWTs with 15-minute expiration, and refresh tokens are 40-byte cryptographically random hex strings with native MongoDB TTL indexes.",
    },
    {
      id: "faq-04",
      index: "[FAQ_04]",
      question: "Which OAuth providers are supported?",
      answer:
        "AuthSphere supports Google, GitHub, Discord, Microsoft, LinkedIn, GitLab, Twitch, and Bitbucket with RFC-7636 PKCE S256 challenge verification, plus local credentials with optional email verification codes.",
    },
    {
      id: "faq-05",
      index: "[FAQ_05]",
      question: "How can I support AuthSphere's ongoing development?",
      answer:
        "You can contribute code and bug reports on GitHub, share feedback in our Discord community, or support ongoing hosting and tooling development through our Patreon page.",
    },
  ];

  const highlights = [
    {
      title: "MIT Permissive License",
      description:
        "100% open source. Use it in personal projects, startups, or commercial production apps without royalties.",
    },
    {
      title: "Self-Hostable Anywhere",
      description:
        "Run directly on any VPS, Kubernetes, Docker container, or bare metal server. Your user database stays yours.",
    },
    {
      title: "Zero Artificial Paywalls",
      description:
        "No gated SSO features, no per-MAU charges, and no hidden lock-in. All implemented protocols are fully available.",
    },
    {
      title: "HaveIBeenPwned Breach Protection",
      description:
        "Built-in k-anonymity checking automatically rejects passwords exposed in known global data breaches.",
    },
    {
      title: "RFC-7636 PKCE OAuth 2.0",
      description:
        "Battle-tested authorization code exchange with S256 code challenge generation for web and single-page apps.",
    },
    {
      title: "Real-Time Revocation",
      description:
        "Immediate database session eviction and WebSocket broadcast events via Socket.io when credentials terminate.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f9] dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black relative isolate">
      {/* Precision Engineering Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#fbf9f9] dark:bg-[#09090c]">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/50 dark:to-black/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        {/* Eyebrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 dark:border-[#222329] pb-3 gap-2">
          <div className="flex items-center text-xs font-mono text-neutral-500 uppercase tracking-widest">
            <span>05</span>
            <TechSeparator />
            <span>OPEN SOURCE LICENSING</span>
            <TechSeparator />
            <span>ZERO FEES</span>
          </div>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>MIT LICENSE // 100% FREE FOREVER</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Open-source authentication.
            <br />
            Zero licensing fees.
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            AuthSphere is free and open source. No subscription tiers, no
            per-MAU traps, and no feature paywalls. Self-host on your own
            infrastructure with total data ownership, or test using our free
            community developer instance.
          </p>

          {/* Direct Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 h-10 rounded text-xs font-mono font-medium bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-sm transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="https://github.com/AuthSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 h-10 rounded text-xs font-mono font-medium border border-neutral-300 dark:border-[#2a2b33] text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub Repository</span>
            </a>
            <a
              href="https://www.patreon.com/cw/AuthSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 h-10 rounded text-xs font-mono font-medium border border-neutral-300 dark:border-[#2a2b33] text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            >
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              <span>Support on Patreon</span>
            </a>
          </div>
        </div>

        {/* Open Source Guarantees Grid */}
        <div className="rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] overflow-hidden shadow-xs">
          <div className="px-6 py-3.5 border-b border-neutral-200 dark:border-[#222329] bg-neutral-50/80 dark:bg-[#15161b] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900 dark:text-white">
                OPEN SOURCE GUARANTEES
              </span>
              <TechSeparator />
              <span className="text-neutral-500">
                WHAT YOU GET OUT OF THE BOX
              </span>
            </div>
            <div className="text-neutral-500 text-[11px] font-mono">
              LICENSE: MIT
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200/60 dark:divide-[#1e2026]">
            {highlights.slice(0, 3).map((item, idx) => (
              <div key={idx} className="p-6 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-900 dark:text-white">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200/60 dark:divide-[#1e2026] border-t border-neutral-200 dark:border-[#222329]">
            {highlights.slice(3, 6).map((item, idx) => (
              <div key={idx} className="p-6 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-900 dark:text-white">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Answered Questions (Technical Accordion) */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest flex items-center justify-center">
              <span>06</span>
              <TechSeparator />
              <span>FREQUENTLY ANSWERED QUESTIONS</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Questions &amp; Technical Specifications
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] rounded-lg px-5 shadow-xs"
              >
                <AccordionTrigger className="text-left py-4 hover:no-underline font-mono text-xs text-neutral-900 dark:text-neutral-100 cursor-pointer">
                  <span className="flex items-center gap-3">
                    <span className="text-neutral-400 font-normal">
                      {faq.index}
                    </span>
                    <span className="font-medium">{faq.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pb-4 pt-1 font-sans">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Community & Open-Source Collaboration Card */}
        <div className="rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] p-8 text-center space-y-4 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-[#2a2b33] bg-neutral-50 dark:bg-[#15161b] text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
            <Cpu className="h-3.5 w-3.5 text-neutral-500" />
            <span>OPEN SOURCE &amp; COMMUNITY DRIVEN</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Have questions or want to contribute?
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            AuthSphere is developed out in the open. Join our community on
            Discord, report bugs or submit pull requests on GitHub, or back the
            project on Patreon.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/AuthSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 h-9 rounded text-xs font-mono font-medium bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-sm transition-all"
            >
              <span>Explore GitHub Repository</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.patreon.com/cw/AuthSphere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 h-9 rounded text-xs font-mono font-medium border border-neutral-200 dark:border-[#2a2b33] text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            >
              <span>Support on Patreon</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
