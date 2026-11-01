import React from "react";
import {
  Info,
  AlertCircle,
  Fingerprint,
  MailCheck,
  ShieldAlert,
  Key,
} from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";
import { Badge } from "@/components/ui/badge";

const LocalAuth = () => {
  return (
    <article className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-3">
        <Badge
          variant="outline"
          className="bg-primary/5 text-primary border-primary/20"
        >
          Protocol: Email/Password
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          Local Authentication
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          The local authentication module provides a cryptographically secure
          implementation for traditional credential-based access. It handles
          salted hashing via Argon2id, automated challenge delivery (OTP), and
          atomic OIDC-compliant token exchange upon verification.
        </p>
      </div>

      <div className="space-y-16">
        {/* Registration Flow */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Fingerprint className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">User Provisioning Lifecycle</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                When a user registers, they are placed in a{" "}
                <strong>PENDING_VERIFICATION</strong> state. AuthSphere
                generates a 6-digit cryptographic challenge and delivers it via
                the configured SMTP relay.
              </p>
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                  Registration Schema
                </h4>
                <ul className="space-y-1.5">
                  {[
                    "email (Required, Unique)",
                    "password (Min 8 chars, Mixed Case)",
                    "username (Optional)",
                    "metadata (Object)",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <div className="h-1 w-1 rounded-full bg-primary/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <DocsCodeBlock
              id="register"
              code={`try {\n  const response = await AuthSphere.register({\n    email: 'user@example.com',\n    password: 'SecurePassword123!',\n    username: 'identity_explorer',\n    sdk_request: sdk_request // optional, preserves context\n  });\n  // Redirect to OTP entry view\n} catch (err) {\n  console.error('Registration Error:', err.message);\n}`}
              language="javascript"
            />
          </div>
        </section>

        {/* Authentication & Verification Redirects */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">State-Aware Authentication</h3>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            The <code>loginLocal</code> method doesn't just check passwords; it
            verifies the user's operational state. If the account requires
            verification, the SDK throws an <code>AuthError</code> containing
            the <code>sdk_request</code>.
          </p>

          <DocsCodeBlock
            id="login-local"
            code={`try {\n  const res = await AuthSphere.loginLocal({ email, password });\n  if (res && res.redirect) window.location.href = res.redirect;\n} catch (err) {\n  if (err instanceof AuthError && err.message.includes('not verified')) {\n    // Extract the challenge context\n    const { sdk_request } = err;\n    navigate(\`/verify?email=\${email}&sdk_request=\${sdk_request}\`);\n  }\n}`}
            language="javascript"
          />

          <div className="p-4 rounded-xl border bg-card/50 space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-amber-600">
              <AlertCircle className="h-3.5 w-3.5" />
              Pre-emptive Rate Limiting
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AuthSphere implements an adaptive exponential backoff for failed
              attempts. After 5 failed attempts, the IP is throttled for 15
              minutes to prevent brute-force dictionary attacks.
            </p>
          </div>
        </section>

        {/* OTP Verification */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <MailCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Challenge Resolution</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Resolving the challenge promotes the user to{" "}
                <strong>ACTIVE</strong> and performs an immediate OIDC token
                exchange. The <code>sdk_request</code> links the original login
                attempt to this verification.
              </p>
              <DocsCodeBlock
                id="resend"
                code={`// If the user didn't receive the email\nawait AuthSphere.resendVerification(email);`}
                language="javascript"
              />
            </div>
            <DocsCodeBlock
              id="verify-otp"
              code={`await AuthSphere.verifyOTP({\n  email: 'user@example.com',\n  otp: '772910',\n  sdk_request: 'as_99aB...' \n});\n\n// user is now authenticated.`}
              language="javascript"
            />
          </div>
        </section>

        {/* Advanced: Security Config */}
        <section className="p-8 rounded-3xl border bg-muted/20 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Key className="h-4 w-4 text-primary" />
            Argon2id Memory Hardening
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            Traditional MD5 or SHA-256 hashes are vulnerable to ASIC-based
            cracking. AuthSphere uses <strong>Argon2id</strong>
            which is memory-hard. Even if your database is compromised, the cost
            to crack a single password on modern hardware remains prohibitively
            high due to the deliberate memory allocation required for each
            verification.
          </p>
        </section>
      </div>
    </article>
  );
};

export default LocalAuth;
