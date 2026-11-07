import React from "react";
import {
  AlertCircle,
  Terminal,
  ShieldAlert,
  ArrowRight,
  LifeBuoy,
} from "lucide-react";
import TechSeparator from "@/components/common/TechSeparator";
import DocsCodeBlock from "../DocsCodeBlock";

const ErrorHandling = () => {
  const errorCatalog = [
    {
      code: "INVALID_CREDENTIALS",
      status: "401 Unauthorized",
      cause:
        "Supplied email or password does not match Bcrypt hashed credentials.",
      recovery: "Prompt user to re-enter password or initiate password reset.",
    },
    {
      code: "EMAIL_NOT_VERIFIED",
      status: "403 Forbidden",
      cause:
        "Project enforces strict verification and user has not verified email.",
      recovery:
        "Redirect user to /verify with email and sdk_request transaction ID.",
    },
    {
      code: "USER_ALREADY_EXISTS",
      status: "409 Conflict",
      cause:
        "Registration attempted with an email already bound to an identity.",
      recovery: "Advise user to log in or use forgot password flow.",
    },
    {
      code: "INVALID_OTP",
      status: "400 Bad Request",
      cause: "The 6-digit verification code is incorrect.",
      recovery:
        "Allow user to re-enter code (up to 5 attempts before invalidation).",
    },
    {
      code: "OTP_EXPIRED",
      status: "410 Gone",
      cause: "Verification code exceeded the 10-minute validity window.",
      recovery:
        "Trigger resend OTP endpoint to dispatch a fresh verification code.",
    },
    {
      code: "ORIGIN_NOT_ALLOWED",
      status: "403 Forbidden",
      cause: "HTTP Origin header does not match project's CORS whitelist.",
      recovery: "Add domain to Allowed Origins in AuthSphere dashboard.",
    },
    {
      code: "TOKEN_EXPIRED",
      status: "401 Unauthorized",
      cause:
        "HS256 access token has passed its 15-minute expiration timestamp.",
      recovery: "Call AuthSphere.refreshToken() to mint a new access token.",
    },
    {
      code: "TOKEN_REVOKED",
      status: "401 Unauthorized",
      cause:
        "Refresh token was invalidated in the database by user logout or admin revocation.",
      recovery: "Clear local session storage and redirect user to /login.",
    },
    {
      code: "RATE_LIMIT_EXCEEDED",
      status: "429 Too Many Requests",
      cause:
        "Request velocity exceeded sliding window rate limit for IP or token.",
      recovery:
        "Inspect Retry-After header and display backoff countdown timer.",
    },
  ];

  return (
    <article className="space-y-8 text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Eyebrow Header */}
      <div className="border-b border-neutral-200 dark:border-[#222329] pb-4 space-y-2">
        <div className="flex items-center text-xs font-mono text-neutral-500 uppercase tracking-widest">
          <span>11</span>
          <TechSeparator />
          <span>EXCEPTION SPECIFICATION</span>
          <TechSeparator />
          <span>ERROR CODES &amp; RECOVERY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Structured Error Codes &amp; Recovery Workflows
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed max-w-3xl">
          Deterministic error schemas, standard HTTP status mapping, and
          resilient client-side recovery patterns.
        </p>
      </div>

      <div className="space-y-8">
        {/* Error Contract */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-neutral-500">
              [01]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Deterministic Error Contract
            </h2>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed">
            Every failure response returned by AuthSphere adheres strictly to a
            machine-readable JSON payload. Client applications can branch logic
            on <code>error_code</code> instead of parsing unpredictable error
            strings:
          </p>

          <DocsCodeBlock
            id="error-schema"
            code={`{
  "success": false,
  "error_code": "EMAIL_NOT_VERIFIED",
  "message": "User email address is not verified. Complete OTP verification.",
  "status": 403,
  "sdk_request": "as_req_88f910ab3c...",
  "timestamp": "2026-11-07T11:45:00.000Z"
}`}
            language="json"
          />
        </section>

        {/* Error Code Catalog */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-neutral-500">
              [02]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Complete Error Code Catalog
            </h2>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] overflow-hidden">
            <div className="px-5 py-2.5 border-b border-neutral-200 dark:border-[#222329] bg-neutral-100/60 dark:bg-[#15161b] text-[11px] font-mono text-neutral-500 font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>ERROR CODE &amp; STATUS</span>
              <span>CAUSE &amp; RECOVERY STRATEGY</span>
            </div>
            <div className="divide-y divide-neutral-200/60 dark:divide-[#1e2026]">
              {errorCatalog.map((err, idx) => (
                <div
                  key={idx}
                  className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 text-xs font-mono"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-neutral-900 dark:text-white block">
                      {err.code}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      HTTP {err.status}
                    </span>
                  </div>
                  <div className="space-y-1 md:max-w-md text-left md:text-right font-sans">
                    <p className="text-neutral-700 dark:text-neutral-300 text-xs">
                      {err.cause}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                      ↳ {err.recovery}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Catch Implementation */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-neutral-500">
              [03]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Production Exception Catching Pattern
            </h2>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed">
            Here is a resilient client-side authentication flow handling
            unexpected states and redirecting to the OTP challenge smoothly:
          </p>

          <DocsCodeBlock
            id="error-catch-code"
            code={`import { AuthSphere, AuthError } from '@authsphere/sdk';

async function handleLogin(email, password) {
  try {
    const { user, tokens } = await AuthSphere.loginLocal({ email, password });
    console.log('Logged in as:', user.email);
    window.location.href = '/dashboard';
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.code) {
        case 'EMAIL_NOT_VERIFIED':
          // Pass the transaction ID to the verification page
          window.location.href = \`/verify-otp?email=\${encodeURIComponent(email)}&req=\${err.sdk_request}\`;
          break;

        case 'INVALID_CREDENTIALS':
          setErrorMessage('Invalid email or password. Please verify your credentials.');
          break;

        case 'RATE_LIMIT_EXCEEDED':
          setErrorMessage('Too many attempts. Please wait 60 seconds before retrying.');
          break;

        default:
          setErrorMessage(err.message || 'An unexpected authentication error occurred.');
      }
    } else {
      console.error('Network or gateway failure:', err);
      setErrorMessage('Unable to reach authentication server. Check your connection.');
    }
  }
}`}
            language="javascript"
          />
        </section>
      </div>
    </article>
  );
};

export default ErrorHandling;
