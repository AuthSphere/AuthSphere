 
import React from "react";
import {
  Globe,
  Smartphone,
  Code2,
  ShieldCheck,
  Cpu,
  ScanFace,
  ServerCog,
  Database,
  GitMerge,
  BarChart2,
  KeyRound,
  Layers,
  Shield,
  ArrowRight,
} from "lucide-react";

const LEFT_NODES = [
  { id: "web", icon: Globe, title: "Web Client" },
  { id: "mobile", icon: Smartphone, title: "Mobile SDK" },
  { id: "server", icon: Code2, title: "Server SDK" },
  { id: "oauth", icon: ShieldCheck, title: "OAuth 2.1" },
  { id: "iot", icon: Cpu, title: "IoT Edge" },
  { id: "biometrics", icon: ScanFace, title: "WebAuthn / Passkeys" },
];

const RIGHT_NODES = [
  { id: "rpc", icon: ServerCog, title: "gRPC Clusters" },
  { id: "db", icon: Database, title: "PostgreSQL" },
  { id: "stream", icon: GitMerge, title: "Kafka Event Mesh" },
  { id: "analytics", icon: BarChart2, title: "Audit & Analytics" },
  { id: "vault", icon: KeyRound, title: "KMS / HSM Keys" },
  { id: "cache", icon: Layers, title: "Redis Sessions" },
];

const ArchNode = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-card border border-border hover:bg-muted/50 transition-colors w-full">
    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
    <span className="text-xs font-medium text-foreground truncate">
      {title}
    </span>
  </div>
);

const Architecture = () => {
  return (
    <section className="py-20 border-b border-border/40">
      <div className="mx-auto w-[92%] max-w-7xl">
        <div className="flex flex-col items-center gap-2 mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Architecture
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Decentralized session verification between client applications and
            downstream infrastructure.
          </p>
        </div>

        {/* Minimal 3-column architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Column 1: Client Surfaces */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
              Clients &amp; Inputs
            </span>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {LEFT_NODES.map((node) => (
                <ArchNode key={node.id} {...node} />
              ))}
            </div>
          </div>

          {/* Column 2: AuthSphere Core */}
          <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-border bg-card shadow-xs text-center space-y-4">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center border border-border/60">
              <Shield className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                AuthSphere Core Engine
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Stateless token rotation, asymmetric verification, and
                cryptographic signing.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded border border-border/40">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>RS256 &bull; Sub-millisecond</span>
            </div>
          </div>

          {/* Column 3: Downstream Services */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
              Infrastructure &amp; Storage
            </span>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {RIGHT_NODES.map((node) => (
                <ArchNode key={node.id} {...node} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Architecture;
