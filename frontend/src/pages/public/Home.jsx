import React from "react";
import useAuthStore from "@/store/authStore";

// Home Components
import Hero from "@/components/home/Hero";
import Architecture from "@/components/home/Architecture";
import FunctionalSpecs from "@/components/home/FunctionalSpecs";
import Integration from "@/components/home/Integration";
import DataModel from "@/components/home/DataModel";

// Icons
import {
  Fingerprint,
  Terminal,
  Shield,
  Globe,
  Box,
  Database,
  Zap,
  Key,
  Clock,
  Activity,
  Lock,
  Smartphone,
  Ban,
  FileSignature,
} from "lucide-react";

// -----------------------------------------------------------------------------
// STATIC CONTENT
// -----------------------------------------------------------------------------

const SYSTEM_MODULES = [
  {
    title: "Auth Core (OIDC)",
    icon: <Fingerprint className="h-5 w-5 text-primary" />,
    description:
      "A high-throughput implementation of OAuth 2.0 and OpenID Connect 1.0. The engine manages the full identity lifecycle—from JIT provisioning via PKCE to cryptographically signed RS256 token rotation and session persistence across distributed clusters.",
    details: [
      "OAuth2.1 / OIDC compliance: full spec support",
      "Stateless RS256 JWTs: with dynamic key rotation",
      "PKCE + Authorization Code: secure mobile/web flows",
      "MFA (TOTP/WebAuthn): multi-layer verification",
      "Brute-force mitigation: adaptive rate limiting",
      "Stateless revocation: using Bloom filters",
    ],
  },
  {
    title: "DX & Event Mesh",
    icon: <Terminal className="h-5 w-5 text-primary" />,
    description:
      "A developer-first control plane. Exposes a gRPC-enabled Management API and an event-driven webhook mesh. Automates project orchestration, granular permission scoping, and real-time identity stream synchronization across your entire service ecosystem.",
    details: [
      "RESTful / gRPC Management: full API exposure",
      "Scoped API Keys: precise permission guarding",
      "HMAC-SHA256 Webhooks: real-time event sync",
      "CLI / SDK Surface: Node, Python, Go, and React",
      "OpenAPI v3.0 specs: auto-generated documentation",
      "Project Isolation: logical multi-tenant separation",
    ],
  },
  {
    title: "Security & Auditing",
    icon: <Shield className="h-5 w-5 text-primary" />,
    description:
      "Deep security integration providing immutable audit trails and real-time anomaly detection. Every request is scrubbed against a zero-trust policy engine, ensuring strictly isolated data environments and compliance with SOC2/GDPR identity standards.",
    details: [
      "Immutable Audit Records: per-request logging",
      "AES-256-GCM Encryption: for sensitive PII data",
      "Strict Security Headers: HSTS, CSP, and XFO",
      "IP Geofencing: regional access control policies",
      "Vulnerability Scanning: automated threat detection",
      "Anomaly Detection: ML-driven login patterns",
    ],
  },
  {
    title: "Edge Distribution",
    icon: <Globe className="h-5 w-5 text-primary" />,
    description:
      "Engineered for sub-10ms response times at any scale. The global infrastructure utilizes a tiered caching strategy—segregating high-frequency read operations from transactional write consistency to ensure zero-downtime identity resolution.",
    details: [
      "L1/L2 Cache Layer: multi-tier Redis clusters",
      "Sharded Database Mesh: high-availability MongoDB",
      "K8s Ready: automatic horizontal pod scaling",
      "Health Probes: real-time liveness & readiness",
      "Global Load Balancing: intelligent traffic routing",
      "Anycast DNS: low-latency identity discovery",
    ],
  },
];

const ERROR_CODES = [
  {
    code: "AUTH_001",
    message: "Invalid API Key",
    description:
      "The provided API key is missing, malformed, or has been revoked.",
    solution:
      "Check your dashboard for the correct key and ensure it has the required scopes.",
    icon: Key,
  },
  {
    code: "AUTH_002",
    message: "Token Expired",
    description:
      "The access token has expired. Use the refresh token to obtain a new one.",
    solution:
      "Implement refresh token rotation and call /oauth/token to get a new access_token.",
    icon: Clock,
  },
  {
    code: "AUTH_003",
    message: "Rate Limit Exceeded",
    description:
      "Too many requests from this IP or Project. Please wait before retrying.",
    solution:
      "Check X-RateLimit headers and implement exponential backoff in your client.",
    icon: Activity,
  },
  {
    code: "AUTH_004",
    message: "Invalid Scope",
    description:
      "The requested scope is invalid or exceeds the permissions of the client.",
    solution:
      "Verify the scope names in your request and ensure the project allows them.",
    icon: Lock,
  },
  {
    code: "AUTH_005",
    message: "MFA Required",
    description:
      "Multi-factor authentication is required to complete this action.",
    solution:
      "Redirect the user to the MFA verification flow before retrying the operation.",
    icon: Smartphone,
  },
  {
    code: "AUTH_006",
    message: "Unauthorized Origin",
    description:
      "The request origin (CORS) is not whitelisted for this project.",
    solution:
      "Add your domain to the 'Allowed Origins' list in the project settings.",
    icon: Globe,
  },
  {
    code: "AUTH_007",
    message: "Project Suspended",
    description:
      "The project has been deactivated due to billing or policy violations.",
    solution:
      "Contact AuthSphere support or check the billing console for status updates.",
    icon: Ban,
  },
  {
    code: "AUTH_008",
    message: "Signature Mismatch",
    description:
      "The webhook HMAC-SHA256 signature does not match the payload.",
    solution:
      "Ensure you are using the correct Webhook Secret and raw request body.",
    icon: FileSignature,
  },
];

const DATA_SCHEMAS = [
  {
    title: "Project",
    label: "Base",
    icon: Box,
    color: "#3b82f6",
    fields: [
      { id: "id", type: "UUID" },
      { id: "slug", type: "STR" },
      { id: "meta", type: "JSON" },
      { id: "active", type: "BOOL" },
    ],
  },
  {
    title: "Identity",
    label: "Auth",
    icon: Shield,
    color: "#a855f7",
    fields: [
      { id: "uid", type: "PK" },
      { id: "hash", type: "ARG2" },
      { id: "mfa", type: "BOOL" },
      { id: "role", type: "ENUM" },
    ],
  },
  {
    title: "Ledger",
    label: "Log",
    icon: Database,
    color: "#10b981",
    fields: [
      { id: "tid", type: "UUID" },
      { id: "ts", type: "UNIX" },
      { id: "op", type: "OP_CODE" },
      { id: "sig", type: "HEX" },
    ],
  },
  {
    title: "Session",
    label: "Edge",
    icon: Zap,
    color: "#f97316",
    fields: [
      { id: "token", type: "JWT" },
      { id: "exp", type: "TTL" },
      { id: "geo", type: "IP" },
      { id: "agent", type: "STR" },
    ],
  },
];

// -----------------------------------------------------------------------------
// SECTION DIVIDER — subtle visual separator between sections
// -----------------------------------------------------------------------------
const SectionDivider = () => (
  <div className="w-full mx-auto max-w-7xl px-6">
    <div className="h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
  </div>
);

// -----------------------------------------------------------------------------
// HOME
// -----------------------------------------------------------------------------
const Home = () => {
  const { user } = useAuthStore();

  return (
    <div className="relative flex flex-col min-h-screen bg-transparent text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      /* Minimal background handled by MainLayout */
      {/* ── Sections ── */}
      <Hero user={user} errorCodes={ERROR_CODES} />
      <SectionDivider />
      <Architecture />
      <SectionDivider />
      <div
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "auto 600px",
        }}
      >
        <FunctionalSpecs modules={SYSTEM_MODULES} />
      </div>
      <SectionDivider />
      <div
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "auto 500px",
        }}
      >
        <Integration />
      </div>
      <SectionDivider />
      <div
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "auto 600px",
        }}
      >
        <DataModel schemas={DATA_SCHEMAS} />
      </div>
    </div>
  );
};

export default Home;
