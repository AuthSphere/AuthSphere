import React from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  UserPlus,
  ShieldPlus,
  Layers,
  ArrowRightLeft,
  Info,
} from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";
import { Badge } from "@/components/ui/badge";

const SocialLogin = () => {
  return (
    <article className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-3">
        <Badge
          variant="outline"
          className="bg-primary/5 text-primary border-primary/20"
        >
          Protocol: OIDC / OAuth 2.0
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          Social Identity Integration
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          AuthSphere normalizes identity data from disparate third-party
          providers into a strictly typed identity object. Our abstraction layer
          handles the OIDC handshake, PKCE challenges, and state verification
          automatically.
        </p>
      </div>

      <div className="space-y-16">
        {/* Handshake Flow */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">The OIDC Handshake</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                When <code>redirectToLogin</code> is called, the SDK initiates a
                PKCE-hardened redirect to the provider's authorization endpoint.
                We generate a cryptographically random <code>state</code> and{" "}
                <code>nonce</code> to prevent Replay and CSRF attacks.
              </p>
              <div className="p-4 rounded-xl border bg-card/50">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Default Scopes
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {["openid", "profile", "email"].map((s) => (
                    <code
                      key={s}
                      className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-primary"
                    >
                      {s}
                    </code>
                  ))}
                </div>
              </div>
            </div>
            <DocsCodeBlock
              id="social-init"
              code={`// Trigger the redirect flow\nAuthSphere.redirectToLogin('google');\n\n// Supported: 'google', 'github', 'discord'`}
              language="javascript"
            />
          </div>
        </section>

        {/* Identity Normalization */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Identity Normalization</h3>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            AuthSphere automatically maps provider-specific claims to a
            standardized <code>User</code> object. This allows you to write one
            set of logic for all identity sources.
          </p>

          <DocsCodeBlock
            id="user-object"
            code={`// Standardized user object structure\n{\n  id: "as_7721...",\n  email: "dev@example.com",\n  name: "Alex Dev",\n  picture: "https://...",\n  provider: "google",\n  providerId: "1029384756...",\n  emailVerified: true\n}`}
            language="javascript"
          />
        </section>

        {/* Conflict Resolution */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <ShieldPlus className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Automatic Identity Merging</h3>
          </div>

          <div className="p-8 rounded-3xl border bg-emerald-500/5 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "What happens if a user signs up with Email/Password and later
              tries to 'Sign in with Google' using the same email?"
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If the emails match and the incoming OIDC provider has verified
              the email, AuthSphere automatically links the social identity to
              the existing local account, preventing fragmented identity silos.
            </p>
          </div>
        </section>
      </div>

      <div className="p-6 rounded-2xl border bg-amber-500/5 border-amber-500/10 flex gap-4 items-start">
        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
            Prerequisite Configuration
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Before integrating social login, ensure you have configured the{" "}
            <strong>Client ID</strong> and
            <strong>Client Secret</strong> in the{" "}
            <Link to="/dashboard" className="font-bold underline">
              Providers Settings
            </Link>
            .
          </p>
        </div>
      </div>
    </article>
  );
};

export default SocialLogin;
