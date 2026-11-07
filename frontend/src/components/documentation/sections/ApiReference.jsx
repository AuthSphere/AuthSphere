import React from "react";
import {
  Code2,
  Hash,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  ExternalLink,
} from "lucide-react";
import TechSeparator from "@/components/common/TechSeparator";
import DocsCodeBlock from "../DocsCodeBlock";

const ApiReference = () => {
  const sdkMethods = [
    {
      name: "initAuth(options)",
      signature: "initAuth(options: InitOptions): void",
      desc: "Initializes the global AuthSphere client instance with your project configuration.",
      params: [
        {
          name: "publicKey",
          type: "string",
          required: true,
          desc: "Project public key (pk_live_...)",
        },
        {
          name: "redirectUri",
          type: "string",
          required: true,
          desc: "Registered OAuth callback URL",
        },
        {
          name: "baseUrl",
          type: "string",
          required: false,
          desc: "Custom AuthSphere host (default: https://api.authsphere.io)",
        },
        {
          name: "autoRefresh",
          type: "boolean",
          required: false,
          desc: "Enable background silent refresh (default: true)",
        },
      ],
      returns: "void",
    },
    {
      name: "loginLocal(credentials)",
      signature: "loginLocal({ email, password }): Promise<AuthResult>",
      desc: "Authenticates using email and password against Bcrypt hash store.",
      params: [
        {
          name: "email",
          type: "string",
          required: true,
          desc: "User email address",
        },
        {
          name: "password",
          type: "string",
          required: true,
          desc: "Plaintext password (checked against HIBP and Bcrypt)",
        },
      ],
      returns: "Promise<{ user: UserProfile, tokens: SessionTokens }>",
    },
    {
      name: "register(details)",
      signature:
        "register({ email, password, name? }): Promise<RegisterResult>",
      desc: "Creates a new identity record and dispatches a 6-digit OTP to the email.",
      params: [
        {
          name: "email",
          type: "string",
          required: true,
          desc: "User email address",
        },
        {
          name: "password",
          type: "string",
          required: true,
          desc: "Password (min 8 chars, checked against breach database)",
        },
        {
          name: "name",
          type: "string",
          required: false,
          desc: "Optional user display name",
        },
      ],
      returns: "Promise<{ success: boolean, sdk_request: string }>",
    },
    {
      name: "verifyOTP(challenge)",
      signature: "verifyOTP({ email, otp, sdk_request }): Promise<AuthResult>",
      desc: "Validates verification code and mints initial HS256 session tokens.",
      params: [
        {
          name: "email",
          type: "string",
          required: true,
          desc: "User email address",
        },
        {
          name: "otp",
          type: "string",
          required: true,
          desc: "6-digit verification code",
        },
        {
          name: "sdk_request",
          type: "string",
          required: true,
          desc: "Transaction ID from register or login response",
        },
      ],
      returns: "Promise<{ user: UserProfile, tokens: SessionTokens }>",
    },
    {
      name: "redirectToLogin(provider)",
      signature:
        "redirectToLogin(provider: 'google' | 'github' | 'discord'): void",
      desc: "Generates PKCE code challenge and redirects browser to provider authorization endpoint.",
      params: [
        {
          name: "provider",
          type: "'google' | 'github' | 'discord'",
          required: true,
          desc: "OAuth provider identity",
        },
      ],
      returns: "void",
    },
    {
      name: "handleAuthCallback()",
      signature: "handleAuthCallback(): Promise<AuthResult>",
      desc: "Extracts authorization code from query parameters, exchanges it for HS256 tokens via PKCE, and clears state.",
      params: [],
      returns: "Promise<{ user: UserProfile, tokens: SessionTokens }>",
    },
    {
      name: "refreshToken()",
      signature: "refreshToken(): Promise<SessionTokens>",
      desc: "Manually triggers a rotation of the current access token using the active refresh token.",
      params: [],
      returns: "Promise<SessionTokens>",
    },
    {
      name: "logout()",
      signature: "logout(): Promise<void>",
      desc: "Purges client-side credentials and invalidates the session in the database.",
      params: [],
      returns: "Promise<void>",
    },
    {
      name: "getUser()",
      signature: "getUser(): UserProfile | null",
      desc: "Synchronously reads the active verified user profile from decrypted memory cache.",
      params: [],
      returns: "UserProfile | null",
    },
  ];

  const endpoints = [
    {
      method: "POST",
      path: "/sdk/login-local",
      desc: "Validates local credentials and mints HS256 access & refresh tokens.",
      headers: [
        "X-Public-Key: pk_live_...",
        "Content-Type: application/json",
        "Origin: https://app.yourdomain.com",
      ],
      reqBody: {
        email: "alex@engineering.io",
        password: "••••••••••••",
      },
      resBody: {
        success: true,
        user: {
          id: "usr_99f2b8a7",
          email: "alex@engineering.io",
          name: "Alex Vance",
          role: "user",
          is_verified: true,
        },
        tokens: {
          accessToken: "eyJhbGciOiJIUzI1NiIs...",
          refreshToken: "rt_88b19...",
          expiresIn: 900,
        },
      },
    },
    {
      method: "POST",
      path: "/sdk/verify-otp",
      desc: "Confirms 6-digit email OTP and transitions user to ACTIVE state.",
      headers: [
        "X-Public-Key: pk_live_...",
        "Content-Type: application/json",
        "Origin: https://app.yourdomain.com",
      ],
      reqBody: {
        email: "alex@engineering.io",
        otp: "849201",
        sdk_request: "as_req_49a1bc...",
      },
      resBody: {
        success: true,
        message: "Email verified successfully.",
        tokens: {
          accessToken: "eyJhbGciOiJIUzI1NiIs...",
          refreshToken: "rt_88b19...",
          expiresIn: 900,
        },
      },
    },
    {
      method: "POST",
      path: "/sdk/refresh",
      desc: "Rotates short-lived access token using long-lived refresh token.",
      headers: [
        "X-Public-Key: pk_live_...",
        "Content-Type: application/json",
        "Origin: https://app.yourdomain.com",
      ],
      reqBody: {
        refreshToken: "rt_88b19...",
      },
      resBody: {
        success: true,
        tokens: {
          accessToken: "eyJhbGciOiJIUzI1NiIs...",
          expiresIn: 900,
        },
      },
    },
    {
      method: "POST",
      path: "/sdk/token",
      desc: "Exchanges OAuth authorization code and PKCE code_verifier for session tokens.",
      headers: ["X-Public-Key: pk_live_...", "Content-Type: application/json"],
      reqBody: {
        code: "as_auth_code_9a8f...",
        code_verifier: "dBjftJeZ4CVP-mB92K...",
        redirect_uri: "https://app.yourdomain.com/callback",
      },
      resBody: {
        success: true,
        user: {
          id: "usr_99f2b8a7",
          email: "alex@engineering.io",
          username: "alexv",
        },
        tokens: {
          accessToken: "eyJhbGciOiJIUzI1NiIs...",
          refreshToken: "rt_88b19...",
          expiresIn: 900,
        },
      },
    },
  ];

  return (
    <article className="space-y-8 text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Eyebrow Header */}
      <div className="border-b border-neutral-200 dark:border-[#222329] pb-4 space-y-2">
        <div className="flex items-center text-xs font-mono text-neutral-500 uppercase tracking-widest">
          <span>09</span>
          <TechSeparator />
          <span>TECHNICAL SPECIFICATION</span>
          <TechSeparator />
          <span>API &amp; SDK REFERENCE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          SDK &amp; REST API Reference
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed max-w-3xl">
          Deterministic method signatures, HTTP request headers, query
          parameters, and JSON payloads for client and server integrations.
        </p>
      </div>

      <div className="space-y-8">
        {/* SDK Methods */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-neutral-500">
              [01]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Client SDK Methods
            </h2>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed">
            All methods are exposed on the primary <code>AuthSphere</code>{" "}
            singleton.
          </p>

          <div className="rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] divide-y divide-neutral-200/60 dark:divide-[#1e2026] overflow-hidden">
            {sdkMethods.map((m, idx) => (
              <div key={idx} className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
                      {m.name}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {m.returns}
                  </span>
                </div>

                <div className="bg-neutral-50 dark:bg-[#181920] px-3 py-1.5 rounded border border-neutral-200 dark:border-[#25262f] font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                  <code>{m.signature}</code>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                  {m.desc}
                </p>

                {m.params.length > 0 && (
                  <div className="pt-1 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider">
                      Parameters
                    </span>
                    <div className="space-y-1">
                      {m.params.map((p, pIdx) => (
                        <div
                          key={pIdx}
                          className="text-xs font-mono flex items-start gap-2"
                        >
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            ({p.type})
                          </span>
                          <span className="text-neutral-500 dark:text-neutral-400 font-sans text-[11px]">
                            — {p.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* REST Endpoints */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-neutral-500">
              [02]
            </span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Direct REST Endpoints
            </h2>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed">
            If you are building custom clients (e.g. Flutter, Go, Rust, React
            Native) without the official JavaScript SDK, you can interact
            directly with the following HTTP endpoints:
          </p>

          <div className="space-y-6">
            {endpoints.map((ep, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-[#1d1e24] pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        ep.method === "POST"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
                      {ep.path}
                    </span>
                  </div>
                  <span className="text-xs font-sans text-neutral-500 dark:text-neutral-400">
                    {ep.desc}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Headers & Request Body */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                        Headers
                      </span>
                      <div className="p-2.5 rounded bg-neutral-50 dark:bg-[#181920] border border-neutral-200 dark:border-[#25262f] space-y-1 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                        {ep.headers.map((h, hIdx) => (
                          <div key={hIdx}>{h}</div>
                        ))}
                      </div>
                    </div>

                    {ep.reqBody && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                          Request Payload
                        </span>
                        <DocsCodeBlock
                          id={`req-${idx}`}
                          code={JSON.stringify(ep.reqBody, null, 2)}
                          language="json"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right: Response Body */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Response (HTTP 200 OK)
                    </span>
                    <DocsCodeBlock
                      id={`res-${idx}`}
                      code={JSON.stringify(ep.resBody, null, 2)}
                      language="json"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};

export default ApiReference;
