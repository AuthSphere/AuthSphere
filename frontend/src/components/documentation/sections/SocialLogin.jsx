import React from "react";
import { Globe, ArrowRightLeft, ShieldCheck, GitMerge } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";
import TechSeparator from "@/components/common/TechSeparator";

const SocialLogin = () => {
  return (
    <article className="space-y-8 text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Eyebrow Header */}
      <div className="border-b border-neutral-200 dark:border-[#222329] pb-4 space-y-2">
        <div className="flex items-center text-xs font-mono text-neutral-500 uppercase tracking-widest">
          <span>04</span>
          <TechSeparator />
          <span>FEDERATED IDENTITY</span>
          <TechSeparator />
          <span>SOCIAL &amp; OIDC LOGIN</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Social Login &amp; OAuth 2.0
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed max-w-2xl">
          Authenticate users via Google, GitHub, and Discord with automated PKCE
          S256 code challenges, CSRF state verification, and normalized user
          profiles.
        </p>
      </div>

      <div className="space-y-8">
        {/* Triggering Login */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
            <span>[01]</span>
            <span>Initiating the Social Handshake</span>
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed">
            Call <code>redirectToLogin(provider)</code>. The SDK automatically
            generates a cryptographic <code>code_verifier</code> and{" "}
            <code>code_challenge</code> (PKCE S256), stores the state token to
            prevent CSRF, and redirects the browser to the identity provider:
          </p>
          <DocsCodeBlock
            id="social-login-call"
            code={`import AuthSphere from '@authspherejs/sdk';

// Trigger OAuth redirects on button click:
const handleGoogle = () => AuthSphere.redirectToLogin('google');
const handleGitHub = () => AuthSphere.redirectToLogin('github');
const handleDiscord = () => AuthSphere.redirectToLogin('discord');`}
            language="javascript"
          />
        </section>

        {/* Normalized User Object */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
            <span>[02]</span>
            <span>Normalized User Profile Schema</span>
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed">
            Different providers return different claims (e.g. GitHub uses{" "}
            <code>avatar_url</code> and <code>login</code>, while Google uses{" "}
            <code>picture</code> and <code>email_verified</code>). AuthSphere
            normalizes all of them into a consistent structure:
          </p>
          <DocsCodeBlock
            id="normalized-user-schema"
            code={`// Returned by AuthSphere.getUser() and handleAuthCallback():
{
  id: "usr_77a28b901fc",
  email: "developer@example.com",
  username: "octodev",
  name: "Alex Rivera",
  picture: "https://avatars.githubusercontent.com/u/1029384",
  provider: "github", // 'google' | 'github' | 'discord' | 'local'
  emailVerified: true,
  createdAt: "2026-03-14T09:20:00.000Z"
}`}
            language="json"
          />
        </section>

        {/* Account Linking & Collisions */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
            <span>[03]</span>
            <span>Email Collision &amp; Provider Linking</span>
          </h2>
          <div className="rounded-xl border border-neutral-200 dark:border-[#222329] bg-neutral-50/50 dark:bg-[#121316] p-5 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
              <GitMerge className="h-4 w-4 text-emerald-500" />
              <span>DETERMINISTIC LINKING POLICY</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              If a user signs in with Google using{" "}
              <code>alice@company.com</code> after previously registering with
              password auth using the same email, AuthSphere automatically links
              the Google identity provider to the existing account once the
              email ownership is verified, preventing duplicate split profiles.
            </p>
          </div>
        </section>
      </div>
    </article>
  );
};

export default SocialLogin;
