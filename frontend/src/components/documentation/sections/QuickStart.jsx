import React from "react";
import { Link } from "react-router-dom";
import { Terminal, Globe, ShieldCheck, Code2, AlertCircle } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";
import TechSeparator from "@/components/common/TechSeparator";

const QuickStart = ({ publicKey, projectId }) => {
  return (
    <article className="space-y-8 text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Eyebrow Header */}
      <div className="border-b border-neutral-200 dark:border-[#222329] pb-4 space-y-2">
        <div className="flex items-center text-xs font-mono text-neutral-500 uppercase tracking-widest">
          <span>02</span>
          <TechSeparator />
          <span>IMPLEMENTATION GUIDE</span>
          <TechSeparator />
          <span>QUICK START</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Client Integration in 4 Steps
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed max-w-2xl">
          Integrate AuthSphere into your web application, configure your CORS
          allowlist, and start authenticating users with PKCE S256.
        </p>
      </div>

      <div className="space-y-8">
        {/* Step 1: Install SDK */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            <span className="w-5 h-5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-[#181920] flex items-center justify-center text-[10px]">
              01
            </span>
            <span>Install the Client SDK</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
            Install the official lightweight JavaScript SDK via your preferred
            package manager:
          </p>
          <DocsCodeBlock
            id="install-cmd"
            code="npm install @authspherejs/sdk"
            language="bash"
          />
        </section>

        {/* Step 2: Configure Origin in Dashboard */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            <span className="w-5 h-5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-[#181920] flex items-center justify-center text-[10px]">
              02
            </span>
            <span>Whitelist Allowed Frontend Origin</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed">
            AuthSphere enforces strict CORS matching. Ensure your local dev
            server and production domain are added to your project's allowed
            origins:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-[#222329] bg-neutral-50 dark:bg-[#15161b]">
              <span className="text-[10px] text-neutral-400 block mb-1 uppercase">
                LOCAL DEVELOPMENT
              </span>
              <code className="text-emerald-600 dark:text-emerald-400">
                http://localhost:5173
              </code>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-[#222329] bg-neutral-50 dark:bg-[#15161b]">
              <span className="text-[10px] text-neutral-400 block mb-1 uppercase">
                PRODUCTION DOMAIN
              </span>
              <code className="text-emerald-600 dark:text-emerald-400">
                https://app.yourdomain.com
              </code>
            </div>
          </div>
        </section>

        {/* Step 3: Initialize the SDK */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            <span className="w-5 h-5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-[#181920] flex items-center justify-center text-[10px]">
              03
            </span>
            <span>Initialize Client in Entrypoint</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed">
            Call <code>initAuth()</code> once at the root of your application
            (e.g. <code>main.jsx</code> or <code>App.jsx</code>):
          </p>
          <DocsCodeBlock
            id="quickstart-init"
            code={`import AuthSphere from '@authspherejs/sdk';

AuthSphere.initAuth({
  publicKey: '${publicKey || "as_pub_live_7721..."}',
  projectId: '${projectId || "67a3f890..."}',
  redirectUri: window.location.origin + '/callback',
  baseUrl: 'https://api.authsphere.dev',
  options: {
    autoRefresh: true, // Silently rotates access tokens before 15m expiry
    storageType: 'local', // Or 'session'
  }
});`}
            language="javascript"
          />
        </section>

        {/* Step 4: Handle the Redirect Callback */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            <span className="w-5 h-5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-[#181920] flex items-center justify-center text-[10px]">
              04
            </span>
            <span>Handle OAuth / Magic Link Callback</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed">
            Mount a dedicated route matching your <code>redirectUri</code> (e.g.{" "}
            <code>/callback</code>) to complete the token exchange:
          </p>
          <DocsCodeBlock
            id="quickstart-callback"
            code={`import { useEffect } from 'react';
import AuthSphere from '@authspherejs/sdk';

export const Callback = () => {
  useEffect(() => {
    async function exchange() {
      try {
        const { user, tokens } = await AuthSphere.handleAuthCallback();
        console.log('Logged in as:', user.email);
        window.location.href = '/dashboard';
      } catch (err) {
        console.error('Handshake failed:', err.message);
        window.location.href = '/login?error=' + encodeURIComponent(err.message);
      }
    }
    exchange();
  }, []);

  return <div>Authenticating session...</div>;
};`}
            language="javascript"
          />
        </section>
      </div>
    </article>
  );
};

export default QuickStart;
