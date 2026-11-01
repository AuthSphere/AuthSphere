import React from "react";
import { Link } from "react-router-dom";
import { Info, Terminal, Globe, ShieldCheck, Code2 } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";
import { Badge } from "@/components/ui/badge";

const QuickStart = ({ publicKey }) => {
  return (
    <article className="space-y-10 animate-in fade-in duration-500">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
            Step-by-Step
          </Badge>
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
            Est. time: 5 mins
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Quick Start Guide</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Establishing a secure identity handshake between your client and
          AuthSphere's infrastructure. This guide covers installation,
          initialization, and the OIDC callback lifecycle.
        </p>
      </div>

      <div className="space-y-12">
        {/* Step 1: Package Installation */}
        <section className="relative pl-8 border-l-2 border-primary/20">
          <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]">
            1
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Terminal className="h-4 w-4 text-primary" />
              <h3 className="text-base font-bold">Install Runtime SDK</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The SDK handles the heavy lifting: PKCE code challenge generation,
              state management for CSRF protection, and automatic token rotation
              using silent refresh.
            </p>
            <DocsCodeBlock
              id="install"
              code="npm install @authspherejs/sdk"
              language="terminal"
            />
          </div>
        </section>

        {/* Step 2: Configure Allowed Origins */}
        <section className="relative pl-8 border-l-2 border-primary/20">
          <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
            2
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="text-base font-bold">
                Origin Policy Configuration
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For security, AuthSphere strictly enforces CORS policies. You must
              white-list your application domains in the
              <Link
                to="/dashboard"
                className="text-primary font-medium hover:underline mx-1"
              >
                Project Dashboard
              </Link>
              .
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-card/50 space-y-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Development
                </span>
                <code className="block text-xs text-primary">
                  http://localhost:3000
                </code>
              </div>
              <div className="p-4 rounded-xl border bg-card/50 space-y-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Production
                </span>
                <code className="block text-xs text-primary">
                  https://app.yourdomain.com
                </code>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-3 items-start">
              <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                <strong>Safety Note:</strong> Wildcards (e.g.,{" "}
                <code>*.domain.com</code>) are supported but should be used
                sparingly to prevent subdomain hijacking.
              </p>
            </div>
          </div>
        </section>

        {/* Step 3: Initialize SDK */}
        <section className="relative pl-8 border-l-2 border-primary/20">
          <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
            3
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h3 className="text-base font-bold">Client Initialization</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Initialize the AuthSphere client at your application's root. This
              establishes the persistent connection and sets up the event
              listeners for token expiry.
            </p>
            <DocsCodeBlock
              id="init"
              code={`import AuthSphere from '@authspherejs/sdk'\n\n// Initialize the singleton instance\nAuthSphere.initAuth({\n  publicKey: '${publicKey}',\n  projectId: 'YOUR_PROJECT_ID', // Found in Dashboard\n  baseUrl: 'https://auth-sphere-6s2v.vercel.app',\n  redirectUri: window.location.origin + '/callback',\n  options: {\n    debug: process.env.NODE_ENV !== 'production',\n    autoRefresh: true,\n    storageType: 'local' // or 'session'\n  }\n});`}
              language="javascript"
            />
          </div>
        </section>

        {/* Step 4: Handle Callback */}
        <section className="relative pl-8 border-l-2 border-muted">
          <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
            4
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Code2 className="h-4 w-4 text-primary" />
              <h3 className="text-base font-bold">Processing the Callback</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create a dedicated route (e.g., <code>/callback</code>) to handle
              the OIDC redirect. The <code>handleCallback</code> method
              exchanges the temporary authorization code for high-entropy JWTs.
            </p>
            <DocsCodeBlock
              id="callback"
              code={`// In your Callback.jsx component\nuseEffect(() => {\n  const processAuth = async () => {\n    try {\n      const { user, tokens } = await AuthSphere.handleAuthCallback();\n      console.log('Successfully authenticated:', user.email);\n      window.location.href = '/dashboard';\n    } catch (error) {\n      console.error('Authentication failed:', error.message);\n      window.location.href = '/login?error=' + error.message;\n    }\n  };\n  processAuth();\n}, []);`}
              language="javascript"
            />
          </div>
        </section>
      </div>

      {/* Support Footer */}
      <div className="p-6 rounded-2xl border bg-muted/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold">Need help with initialization?</h4>
          <p className="text-xs text-muted-foreground">
            Checkout our example repositories for React, Next.js, and Vue.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-card border text-xs font-bold hover:bg-muted transition-colors">
            Github Examples
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">
            Contact Support
          </button>
        </div>
      </div>
    </article>
  );
};

export default QuickStart;
