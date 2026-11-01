import React from "react";
import { Badge } from "@/components/ui/badge";
import DocsCodeBlock from "../DocsCodeBlock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Code2, Hash, ShieldCheck, RefreshCw } from "lucide-react";

const ApiReference = () => {
  const sdkMethods = [
    {
      name: "initAuth(config)",
      desc: "Global initialization of the SDK singleton.",
      params: [
        {
          name: "publicKey",
          type: "string",
          desc: "Your project's public key.",
        },
        { name: "projectId", type: "string", desc: "Your unique project ID." },
        {
          name: "redirectUri",
          type: "string",
          desc: "Whitelist callback URL.",
        },
        {
          name: "baseUrl",
          type: "string",
          desc: "AuthSphere API root (Default: Production).",
        },
      ],
    },
    {
      name: "loginLocal({ email, password })",
      desc: "Primary authentication for email/password credentials.",
      returns: "Promise<AuthResult>",
      throws: "AuthError (EMAIL_NOT_VERIFIED)",
    },
    {
      name: "redirectToLogin(provider)",
      desc: "Triggers the OIDC redirect flow for social providers.",
      params: [
        {
          name: "provider",
          type: "'google'|'github'|'discord'",
          desc: "Provider identity.",
        },
      ],
    },
    {
      name: "handleAuthCallback()",
      desc: "Negotiates the authorization code for tokens after a redirect.",
      returns: "Promise<{ user, tokens }>",
    },
  ];

  const endpoints = [
    {
      method: "POST",
      path: "/sdk/login-local",
      desc: "Direct credential validation endpoint.",
      headers: ["X-Public-Key: string", "Content-Type: application/json"],
      body: {
        email: "string",
        password: "string",
        public_key: "string",
        projectId: "string",
        sdk_request: "string",
      },
    },
    {
      method: "POST",
      path: "/sdk/verify-otp",
      desc: "Promotes unverified users to ACTIVE state.",
      body: { email: "string", otp: "string", sdk_request: "string" },
    },
    {
      method: "POST",
      path: "/sdk/refresh",
      desc: "Rotates short-lived access tokens using long-lived refresh tokens.",
      body: { refreshToken: "string" },
    },
  ];

  return (
    <article className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">API Reference</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Comprehensive technical reference for the AuthSphere SDK and
          underlying REST endpoints. All responses follow the standard JSON:API
          specification.
        </p>
      </div>

      {/* SDK Methods Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">SDK Method Reference</h2>
        </div>

        <div className="rounded-2xl border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[200px] text-[11px] font-bold uppercase">
                  Method
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase">
                  Description
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase text-right">
                  Returns
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sdkMethods.map((method, i) => (
                <TableRow
                  key={i}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="font-mono text-xs font-bold text-primary">
                    {method.name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground leading-relaxed">
                    {method.desc}
                    {method.params && (
                      <div className="mt-2 space-y-1">
                        {method.params.map((p, j) => (
                          <div key={j} className="text-[10px] flex gap-2">
                            <span className="text-foreground font-bold">
                              {p.name}:
                            </span>
                            <span className="text-muted-foreground/70">
                              {p.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-[10px] text-foreground/80">
                    {method.returns || "void"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* REST Endpoints Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">REST Endpoints</h2>
        </div>

        <div className="space-y-10">
          {endpoints.map((ep, i) => (
            <div key={i} className="grid lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-500 border-none px-2 py-0.5 font-bold uppercase text-[10px]"
                  >
                    {ep.method}
                  </Badge>
                  <code className="text-xs font-bold text-foreground">
                    {ep.path}
                  </code>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {ep.desc}
                </p>
                {ep.headers && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Required Headers
                    </h4>
                    <div className="space-y-1">
                      {ep.headers.map((h, j) => (
                        <code
                          key={j}
                          className="block text-[10px] bg-muted p-2 rounded border border-transparent hover:border-primary/10 transition-colors"
                        >
                          {h}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Sample Payload
                </h4>
                <DocsCodeBlock
                  id={`ep-${i}`}
                  code={JSON.stringify(ep.body, null, 2)}
                  language="json"
                />
                <div className="mt-4 flex gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Rate Limited
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500">
                    <RefreshCw className="h-3.5 w-3.5" />
                    CORS Enabled
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ApiReference;
