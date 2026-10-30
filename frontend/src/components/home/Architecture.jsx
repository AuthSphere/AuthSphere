 
import React, { useRef } from "react";
import { Badge } from "@/components/ui/badge";
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
  Share2,
} from "lucide-react";

/* ─── Node data ─── */
const LEFT_NODES = [
  { id: "web", icon: Globe, title: "Web Client", color: "#3b82f6" },
  { id: "mobile", icon: Smartphone, title: "Mobile SDK", color: "#a855f7" },
  { id: "server", icon: Code2, title: "Server SDK", color: "#f97316" },
  { id: "oauth", icon: ShieldCheck, title: "OAuth 2.1", color: "#ec4899" },
  { id: "iot", icon: Cpu, title: "IoT Edge", color: "#eab308" },
  { id: "biometrics", icon: ScanFace, title: "Biometrics", color: "#f43f5e" },
];

const RIGHT_NODES = [
  { id: "rpc", icon: ServerCog, title: "gRPC Cluster", color: "#10b981" },
  { id: "db", icon: Database, title: "Postgres XL", color: "#f59e0b" },
  { id: "stream", icon: GitMerge, title: "Kafka Mesh", color: "#6366f1" },
  { id: "analytics", icon: BarChart2, title: "Realtime BI", color: "#06b6d4" },
  { id: "vault", icon: KeyRound, title: "Vault HSM", color: "#8b5cf6" },
  { id: "cache", icon: Layers, title: "Redis Cache", color: "#84cc16" },
];

/* ─── Single node card ─── */
const ArchNode = React.forwardRef(({ icon: Icon, title, color }, ref) => (
  <div
    ref={ref}
    className="group z-40 flex items-center gap-2.5 px-3 py-2.5 rounded-xl
               bg-background border border-border/50 hover:border-border/90
               hover:shadow-sm transition-all duration-200 w-full"
  >
    <div
      className="shrink-0 h-7 w-7 rounded-lg border flex items-center justify-center
                 transition-transform duration-300 group-hover:scale-105"
      style={{ backgroundColor: `${color}14`, borderColor: `${color}28` }}
    >
      <Icon style={{ color }} className="h-3.5 w-3.5" />
    </div>
    <span
      className="text-[11px] font-semibold tracking-tight text-muted-foreground
                     group-hover:text-foreground transition-colors truncate leading-none"
    >
      {title}
    </span>
  </div>
));
ArchNode.displayName = "ArchNode";

/* ═══════════════════════════════════════════════════════════════ */
const Architecture = () => {
  const containerRef = useRef(null);
  const coreRef = useRef(null);

  const leftRefs = React.useMemo(
    () => LEFT_NODES.map(() => React.createRef()),
    [],
  );
  const rightRefs = React.useMemo(
    () => RIGHT_NODES.map(() => React.createRef()),
    [],
  );

  return (
    <section
      ref={containerRef}
      className="relative py-20 sm:py-28 overflow-hidden bg-transparent"
    >
      {/* ── Soft grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right,hsl(var(--border)/0.5) 1px,transparent 1px)," +
            "linear-gradient(to bottom,hsl(var(--border)/0.5) 1px,transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%,#000 60%,transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-[92%] max-w-7xl">
        {/* ── Section header ── */}
        <div className="flex flex-col items-center gap-3 mb-16 sm:mb-20 text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight
                         text-foreground leading-tight"
          >
            Integrated{" "}
            <span className="text-muted-foreground/40 font-light italic">
              Security Mesh
            </span>
          </h2>

          <p className="text-[13px] sm:text-sm text-muted-foreground max-w-sm sm:max-w-md leading-relaxed">
            Real-time data orchestration between edge nodes and core
            infrastructure — visualised end-to-end.
          </p>
        </div>

        {/* ── Three-column diagram ── */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6 relative">
          {/* Left column */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 w-full lg:w-[185px] lg:shrink-0">
            {LEFT_NODES.map((node, i) => (
              <ArchNode key={node.id} ref={leftRefs[i]} {...node} />
            ))}
          </div>

          {/* Center hub */}
          <div className="relative flex items-center justify-center shrink-0 my-2 lg:my-0">
            {/* Outer ring */}
            <div className="absolute h-52 w-52 sm:h-60 sm:w-60 rounded-full border border-dashed border-border/30 animate-[spin_30s_linear_infinite]" />
            <div className="absolute h-36 w-36 sm:h-40 sm:w-40 rounded-full border border-dashed border-border/20 animate-[spin_20s_linear_infinite_reverse]" />

            {/* Hub card */}
            <div
              ref={coreRef}
              className="relative z-50 h-36 w-36 sm:h-40 sm:w-40 rounded-[2rem] bg-background
                         border border-border shadow-[0_8px_40px_rgba(0,0,0,.08)]
                         flex flex-col items-center justify-center gap-3 group"
            >
              <div
                className="h-12 w-12 rounded-2xl bg-muted border border-border flex items-center
                              justify-center transition-transform duration-500 group-hover:scale-105"
              >
                <Share2 className="h-5 w-5 text-foreground" />
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold tracking-[0.14em] text-foreground uppercase">
                  AuthSphere
                </span>
                <div className="flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[9px] font-semibold text-muted-foreground tracking-wider uppercase">
                    Primary Hub
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 w-full lg:w-[185px] lg:shrink-0">
            {RIGHT_NODES.map((node, i) => (
              <ArchNode key={node.id} ref={rightRefs[i]} {...node} />
            ))}
          </div>
        </div>

        {/* ── Bottom legend ── */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-14 sm:mt-16">
          {[
            { dot: "bg-blue-500", label: "Client surfaces" },
            { dot: "bg-primary", label: "AuthSphere core" },
            { dot: "bg-emerald-500", label: "Backend infrastructure" },
          ].map(({ dot, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${dot}`} />
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Architecture;
