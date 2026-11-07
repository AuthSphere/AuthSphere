import React, { useState } from "react";
import { Lock, Webhook, Cpu, Layers, Copy, Check } from "lucide-react";

const CODE_EXAMPLE = `const { AuthSphere } = require('@authsphere/node-sdk');

const auth = new AuthSphere({
  projectId: process.env.AUTH_PROJECT_ID,
  secretKey: process.env.AUTH_SECRET_KEY,
});

app.get('/v1/user/profile', auth.middleware(), (req, res) => {
  const user = req.session.user;
  res.json({ status: "AUTHENTICATED", email: user.email });
});`;

const FEATURES = [
  {
    icon: Lock,
    title: "Stateless Tokens",
    description: "Signed HS256 Bearer tokens for distributed verification.",
  },
  {
    icon: Webhook,
    title: "Event Mesh",
    description: "Real-time HMAC-SHA256 webhooks for async processing.",
  },
  {
    icon: Cpu,
    title: "JIT Provisioning",
    description: "Dynamic user creation and profile sync on first login.",
  },
  {
    icon: Layers,
    title: "Multi-Tenancy",
    description: "Logical isolation for enterprise-ready SaaS apps.",
  },
];

const Integration = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_EXAMPLE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 border-b border-border/40">
      <div className="mx-auto w-[92%] max-w-7xl">
        <div className="grid xl:grid-cols-2 gap-12 items-start">
          {/* Left: Copy & features */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
              Developer SDK &amp; Integration
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-8">
              Drop-in middleware for Node.js, Next.js, and Express with
              automatic token validation and session caching.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="p-3.5 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="h-4 w-4 text-foreground/80 shrink-0" />
                    <h3 className="text-xs font-semibold text-foreground">
                      {title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 p-4 rounded-lg border border-border bg-card text-center divide-x divide-border">
              <div>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider mb-0.5">
                  Latency
                </p>
                <p className="text-base font-semibold text-foreground">
                  &lt; 12ms
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider mb-0.5">
                  Algorithm
                </p>
                <p className="text-base font-semibold text-foreground">HS256</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider mb-0.5">
                  Uptime
                </p>
                <p className="text-base font-semibold text-foreground">
                  99.99%
                </p>
              </div>
            </div>
          </div>

          {/* Right: Clean minimal code card */}
          <div className="rounded-lg border border-border bg-zinc-950 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/50">
              <span className="text-xs font-mono text-zinc-400">app.js</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-2 py-1 rounded hover:bg-zinc-800"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
              <code>{CODE_EXAMPLE}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integration;
