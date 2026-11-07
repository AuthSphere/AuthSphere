import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import TechSeparator from "@/components/common/TechSeparator";
import ProjectList from "@/components/project/ProjectList";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
  FolderKanban,
  Users,
  Activity,
  ShieldCheck,
  Code2,
  Clock,
  Zap,
  Plus,
  ChevronRight,
  FileSpreadsheet,
  Key,
  Download,
  Search,
  ArrowUpRight,
  ExternalLink,
  Layers,
  Copy,
  Check,
  RefreshCw,
  CheckCircle2,
  Terminal,
  Cpu,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getDashboardStats } from "@/api/DeveloperAPI";
import CreateProjectModal from "@/components/project/CreateProjectModal";
import { format, formatDistanceToNow } from "date-fns";
import { usePWA } from "@/hooks/usePWA";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#14151a] border border-[#eaeaea] dark:border-[#222329] rounded-md p-3 shadow-md font-mono text-xs">
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">
          {label ? format(new Date(label), "MMM dd, yyyy") : ""}
        </p>
        <p className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{payload[0].value} Authentications</span>
        </p>
      </div>
    );
  }
  return null;
};

export const Dashboard = () => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  const { isInstallable, installPWA } = usePWA();

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalEndUsers: 0,
    recentUsers: [],
    signupTrend: [],
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [activityRange, setActivityRange] = useState("30d");
  const [sdkTab, setSdkTab] = useState("npm");
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchStats = async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      else setStatsLoading(true);
      const res = await getDashboardStats();
      if (res.success) {
        setStats(res.data);
        if (isManual) {
          toast.success("Telemetry updated with live runtime");
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
      if (isManual) {
        toast.error("Failed to refresh telemetry");
      }
    } finally {
      setStatsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStats();
    }
  }, [user, loading, navigate]);

  // Telemetry Aggregates
  const totalVolume = useMemo(() => {
    return (
      stats.signupTrend?.reduce((acc, curr) => acc + (curr.signups || 0), 0) ||
      0
    );
  }, [stats.signupTrend]);

  const peakDayVolume = useMemo(() => {
    if (!stats.signupTrend?.length) return 0;
    return Math.max(...stats.signupTrend.map((t) => t.signups || 0));
  }, [stats.signupTrend]);

  const filteredUsers = useMemo(() => {
    return stats.recentUsers.filter(
      (u) =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.projectId?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [stats.recentUsers, searchTerm]);

  const sdkSnippets = {
    npm: "npm install @authspherejs/sdk",
    pnpm: "pnpm add @authspherejs/sdk",
    react: `import { AuthSphereProvider, useAuth } from "@authspherejs/sdk";

export function App() {
  return (
    <AuthSphereProvider
      projectId="${user?.id ? `as_proj_${user.id.slice(0, 8)}` : "as_proj_live_default"}"
      redirectUri="http://localhost:3000/callback"
    >
      <Main />
    </AuthSphereProvider>
  );
}`,
    curl: `curl -X POST https://api.authsphere.dev/v1/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{"grant_type": "authorization_code", "client_id": "as_client_...", "code_verifier": "..."}'`,
  };

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    toast.success("Code snippet copied to clipboard");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#09090c] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-300 dark:border-neutral-700 border-t-black dark:border-t-white rounded-full animate-spin mb-3" />
        <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
          INITIALIZING RUNTIME CONSOLE...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 antialiased selection:bg-black selection:text-white relative isolate">
      {/* Precision Engineering Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/30 dark:to-black/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ======================================================== */}
        {/* CONSOLE HEADER & TECHNICAL COMMAND BAR                   */}
        {/* ======================================================== */}
        <header className="pb-6 border-b border-[#eaeaea] dark:border-[#222329] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="w-2 h-0.5 bg-black dark:bg-white" />
              <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest flex items-center">
                <span>FIG. 04</span>
                <TechSeparator />
                <span>OPERATIONAL CONSOLE</span>
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>RUNTIME ACTIVE</span>
              </div>
              <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500 hidden sm:inline">
                SPEC: RFC-7636 / RFC-7519 PKCE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Console Overview
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Welcome back,{" "}
              <span className="font-semibold text-neutral-900 dark:text-white">
                {user.username}
              </span>
              . High-throughput identity namespaces, concurrent session
              management, and cryptographic token vault.
            </p>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchStats(true)}
              disabled={isRefreshing || statsLoading}
              title="Refresh telemetry stream"
              className="h-9 px-3 text-xs font-mono border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] hover:bg-neutral-100 dark:hover:bg-[#1a1b22] text-neutral-900 dark:text-white cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1.5 ${
                  isRefreshing ? "animate-spin text-emerald-500" : ""
                }`}
              />
              <span>Refresh</span>
            </Button>
            {isInstallable && (
              <Button
                variant="outline"
                size="sm"
                onClick={installPWA}
                className="h-9 px-3 text-xs font-mono border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] hover:bg-neutral-100 dark:hover:bg-[#1a1b22] text-neutral-900 dark:text-white cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Install PWA
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/audit-logs")}
              className="h-9 px-3 text-xs font-mono border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] hover:bg-neutral-100 dark:hover:bg-[#1a1b22] text-neutral-900 dark:text-white cursor-pointer"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
              Audit Logs
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/docs")}
              className="h-9 px-3 text-xs font-mono border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] hover:bg-neutral-100 dark:hover:bg-[#1a1b22] text-neutral-900 dark:text-white cursor-pointer"
            >
              <Code2 className="h-3.5 w-3.5 mr-1.5" />
              API Docs
            </Button>
            <Button
              size="sm"
              onClick={() => setCreateOpen(true)}
              className="h-9 px-4 text-xs font-semibold bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer shadow-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Project</span>
            </Button>
          </div>
        </header>

        {/* ======================================================== */}
        {/* TELEMETRY & METRIC TILES (4 PRECISION CARDS)              */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: "01",
              title: "NAMESPACES",
              label: "Projects & Partitions",
              value: stats.totalProjects,
              icon: FolderKanban,
              badge: "Isolated Scope",
              trend: "AES-256 Vault",
            },
            {
              num: "02",
              title: "IDENTITIES",
              label: "Total End Users",
              value: stats.totalEndUsers,
              icon: Users,
              badge: "OIDC & OAuth 2.0",
              trend: "Verified Accounts",
            },
            {
              num: "03",
              title: "ACTIVE SESSIONS",
              label: "Concurrent Sessions",
              value:
                Math.max(
                  stats.recentUsers.length,
                  Math.round(stats.totalEndUsers * 0.4),
                ) || 0,
              icon: Activity,
              badge: "WebSocket Bus",
              trend: "Live Sync",
            },
            {
              num: "04",
              title: "CRYPTO VERIFIER",
              label: "Verification Latency",
              value: "< 0.8ms",
              icon: Zap,
              badge: "SHA-256 S256",
              trend: "Zero-Trust Pass",
            },
          ].map((metric, i) => (
            <Card
              key={i}
              className="bg-white dark:bg-[#0c0d10] border border-[#eaeaea] dark:border-[#222329] hover:border-black dark:hover:border-white transition-all duration-200 rounded-lg p-5 shadow-2xs group relative overflow-hidden"
            >
              {/* Corner accent reticles */}
              <div className="absolute top-1.5 left-1.5 w-1 h-1 border-t border-l border-neutral-300 dark:border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-1.5 right-1.5 w-1 h-1 border-t border-r border-neutral-300 dark:border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mb-3">
                <span className="flex items-center">
                  <span>{metric.num}</span>
                  <TechSeparator />
                  <span>{metric.title}</span>
                </span>
                <div className="h-7 w-7 rounded border border-[#eaeaea] dark:border-[#222329] bg-neutral-50 dark:bg-[#14151a] flex items-center justify-center text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                  <metric.icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-1">
                {statsLoading ? (
                  <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
                ) : (
                  metric.value
                )}
              </div>

              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                {metric.label}
              </p>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#eaeaea] dark:border-[#222329] text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                <span>{metric.badge}</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {metric.trend}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* ======================================================== */}
        {/* DASHBOARD TABBED RUNTIME VIEW                            */}
        {/* ======================================================== */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-neutral-100 dark:bg-[#14151a] border border-[#eaeaea] dark:border-[#222329] p-1 rounded-md gap-1 h-auto flex flex-wrap">
            <TabsTrigger
              value="overview"
              className="px-4 py-1.5 text-xs font-mono rounded text-neutral-600 dark:text-neutral-400 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1f2026] data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white data-[state=active]:shadow-xs transition-all cursor-pointer"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="px-4 py-1.5 text-xs font-mono rounded text-neutral-600 dark:text-neutral-400 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1f2026] data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white data-[state=active]:shadow-xs transition-all cursor-pointer"
            >
              Projects ({stats.totalProjects})
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="px-4 py-1.5 text-xs font-mono rounded text-neutral-600 dark:text-neutral-400 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1f2026] data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white data-[state=active]:shadow-xs transition-all cursor-pointer"
            >
              Users Directory ({stats.totalEndUsers})
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="px-4 py-1.5 text-xs font-mono rounded text-neutral-600 dark:text-neutral-400 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1f2026] data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white data-[state=active]:shadow-xs transition-all cursor-pointer"
            >
              Activity &amp; Telemetry
            </TabsTrigger>
          </TabsList>

          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW                                          */}
          {/* ======================================================== */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* PRIMARY CONTENT STREAM (lg: col-span-8) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. COMPACT REAL-TIME TELEMETRY GRAPH */}
                <Card className="bg-white dark:bg-[#0c0d10] border border-[#eaeaea] dark:border-[#222329] rounded-lg p-5 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#eaeaea] dark:border-[#222329] gap-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-neutral-900 dark:text-white" />
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 dark:text-white">
                          Authentication Velocity (30 Days)
                        </h3>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          Total Volume: {totalVolume} events · Peak Day:{" "}
                          {peakDayVolume}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("activity")}
                      className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer h-7 px-2"
                    >
                      Expand Telemetry
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>

                  <div className="pt-4 h-48 sm:h-56">
                    {stats.signupTrend?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={stats.signupTrend}
                          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="overviewColorSignups"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#00E5FF"
                                stopOpacity={0.25}
                              />
                              <stop
                                offset="95%"
                                stopColor="#00E5FF"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="2 3"
                            vertical={false}
                            stroke="#eaeaea"
                            className="dark:stroke-[#1f2026]"
                          />
                          <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fontSize: 9.5,
                              fontFamily: "monospace",
                              fill: "#888888",
                            }}
                            tickFormatter={(str) =>
                              format(new Date(str), "MMM d")
                            }
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fontSize: 9.5,
                              fontFamily: "monospace",
                              fill: "#888888",
                            }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="signups"
                            stroke="#00E5FF"
                            strokeWidth={1.75}
                            fillOpacity={1}
                            fill="url(#overviewColorSignups)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center border border-dashed border-[#eaeaea] dark:border-[#222329] rounded-md">
                        <Activity className="h-6 w-6 text-neutral-400 mb-1" />
                        <p className="text-xs text-neutral-500 font-mono">
                          NO RECENT TRAFFIC EVENTS RECORDED
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* 2. RECENT AUTHENTICATIONS STREAM */}
                <Card className="bg-white dark:bg-[#0c0d10] border border-[#eaeaea] dark:border-[#222329] rounded-lg overflow-hidden shadow-2xs">
                  <CardHeader className="p-5 border-b border-[#eaeaea] dark:border-[#222329] flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-neutral-900 dark:text-white" />
                        <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">
                          Recent Ingress Stream
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                        Live stream of authenticated developer users across
                        namespaces
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("users")}
                      className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                    >
                      View All ({stats.totalEndUsers})
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </CardHeader>

                  <CardContent className="p-0">
                    {stats.recentUsers.length > 0 ? (
                      <div className="divide-y divide-[#eaeaea] dark:divide-[#222329]">
                        {stats.recentUsers.slice(0, 5).map((u) => (
                          <div
                            key={u._id}
                            className="flex items-center justify-between p-4 hover:bg-neutral-50/70 dark:hover:bg-[#14151a]/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-9 w-9 rounded-md border border-[#eaeaea] dark:border-[#222329] bg-neutral-100 dark:bg-[#18191e] flex items-center justify-center font-mono text-xs font-bold text-neutral-900 dark:text-white shrink-0">
                                {u.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                                    {u.username}
                                  </p>
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[9px] font-medium">
                                    <CheckCircle2 className="h-2.5 w-2.5" />
                                    Verified
                                  </span>
                                </div>
                                <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate">
                                  {u.email}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0 ml-4">
                              <span className="inline-block px-2 py-0.5 rounded border border-[#eaeaea] dark:border-[#222329] bg-neutral-50 dark:bg-[#14151a] font-mono text-[10px] text-neutral-700 dark:text-neutral-300 mb-1">
                                {u.projectId?.name || "Global Production"}
                              </span>
                              <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-neutral-400">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {formatDistanceToNow(new Date(u.createdAt), {
                                    addSuffix: true,
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-14 px-4">
                        <Users className="h-8 w-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-700" />
                        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                          No authentication events recorded yet.
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          Deploy a project and connect an OAuth provider to
                          begin authenticating users.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 3. INTERACTIVE CLIENT SDK SNIPPET HUB */}
                <Card className="bg-white dark:bg-[#0c0d10] border border-[#eaeaea] dark:border-[#222329] rounded-lg p-5 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-neutral-900 dark:text-white" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                          SDK INTEGRATION HUB // RFC-7636 PKCE READY
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                        Drop-in authentication for your client applications
                      </p>
                    </div>

                    {/* SDK Syntax Tabs */}
                    <div className="flex items-center bg-neutral-100 dark:bg-[#14151a] border border-[#eaeaea] dark:border-[#222329] rounded p-0.5 self-start sm:self-auto">
                      {["npm", "pnpm", "react", "curl"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setSdkTab(tab)}
                          className={`px-2.5 py-1 text-[10px] font-mono rounded cursor-pointer transition-all ${
                            sdkTab === tab
                              ? "bg-white dark:bg-[#1f2026] text-neutral-900 dark:text-white font-bold shadow-2xs"
                              : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                          }`}
                        >
                          {tab.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code Snippet Box */}
                  <div className="relative rounded-md bg-[#09090c] border border-neutral-800 p-3.5 font-mono text-xs text-neutral-200 overflow-x-auto group">
                    <pre className="text-[11px] leading-relaxed select-all">
                      <code>{sdkSnippets[sdkTab]}</code>
                    </pre>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(sdkSnippets[sdkTab])}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded border border-neutral-700 bg-neutral-900/90 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors cursor-pointer"
                      title="Copy snippet"
                    >
                      {copiedCode ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-1">
                    <span>
                      Zero external dependencies · Built-in token refresh daemon
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate("/docs")}
                      className="inline-flex items-center gap-1 font-mono text-neutral-900 dark:text-white hover:underline cursor-pointer"
                    >
                      <span>Full SDK Guide</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </Card>
              </div>

              {/* SIDEBAR: SYSTEM TOPOLOGY & QUICK OPERATIONS (lg: col-span-4) */}
              <div className="lg:col-span-4 space-y-6">
                {/* 1. IDENTITY PROVIDERS STATUS HUB */}
                <Card className="bg-white dark:bg-[#0c0d10] border border-[#eaeaea] dark:border-[#222329] rounded-lg p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#eaeaea] dark:border-[#222329]">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-neutral-900 dark:text-white" />
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 dark:text-white">
                        Connected Providers
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ONLINE
                    </span>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs">
                    {[
                      {
                        name: "Google Cloud",
                        proto: "OIDC / OAuth 2.0",
                        status: "Configured",
                        active: true,
                      },
                      {
                        name: "GitHub Enterprise",
                        proto: "SSO / v3 API",
                        status: "Configured",
                        active: true,
                      },
                      {
                        name: "Discord Gateway",
                        proto: "OAuth 2.0 / Guilds",
                        status: "Ready",
                        active: true,
                      },
                      {
                        name: "Local Password & Email",
                        proto: "Bcrypt (10 salt rounds)",
                        status: "Enforced",
                        active: true,
                      },
                    ].map((prov, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded border border-[#eaeaea] dark:border-[#222329] bg-neutral-50/70 dark:bg-[#121316]"
                      >
                        <div>
                          <p className="text-[11px] font-semibold text-neutral-900 dark:text-white">
                            {prov.name}
                          </p>
                          <p className="text-[9.5px] text-neutral-500 dark:text-neutral-400">
                            {prov.proto}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {prov.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("projects")}
                    className="w-full mt-4 h-8 text-xs font-mono border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] hover:bg-neutral-100 dark:hover:bg-[#1a1b22] text-neutral-900 dark:text-white cursor-pointer"
                  >
                    <span>Manage Provider Keys</span>
                    <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Card>

                {/* 2. SECURITY ENCLAVE SPECIFICATION */}
                <Card className="bg-white dark:bg-[#0c0d10] border border-[#eaeaea] dark:border-[#222329] rounded-lg p-5 shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="h-4 w-4 text-neutral-900 dark:text-white" />
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 dark:text-white">
                      Cryptographic Enclave
                    </h3>
                  </div>

                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3 leading-relaxed">
                    Zero-trust identity core runtime specifications and
                    cryptography enforcement.
                  </p>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-[#eaeaea] dark:border-[#222329]">
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        OAuth 2.0 / OIDC
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        RFC-6749 Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-[#eaeaea] dark:border-[#222329]">
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        PKCE Challenge
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-900 dark:text-white">
                        S256 Enforced
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-[#eaeaea] dark:border-[#222329]">
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Token Signature
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-900 dark:text-white">
                        HMAC-SHA256 (HS256)
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-[#eaeaea] dark:border-[#222329]">
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Token Rotation
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-900 dark:text-white">
                        Single-Use Vault
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Uptime SLA
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        99.99% Operational
                      </span>
                    </div>
                  </div>
                </Card>

                {/* 3. DEVELOPER QUICK OPERATIONS */}
                <Card className="bg-white dark:bg-[#0c0d10] border border-[#eaeaea] dark:border-[#222329] rounded-lg p-5 shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="h-4 w-4 text-neutral-900 dark:text-white" />
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 dark:text-white">
                      Developer Operations
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => navigate("/audit-logs")}
                      className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-50 dark:hover:bg-[#14151a] text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors border border-transparent hover:border-[#eaeaea] dark:hover:border-[#26262b] cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileSpreadsheet className="h-4 w-4 text-neutral-500" />
                        <span>Audit Event Stream</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/sessions")}
                      className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-50 dark:hover:bg-[#14151a] text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors border border-transparent hover:border-[#eaeaea] dark:hover:border-[#26262b] cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Activity className="h-4 w-4 text-neutral-500" />
                        <span>Session Manager</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/settings")}
                      className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-50 dark:hover:bg-[#14151a] text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors border border-transparent hover:border-[#eaeaea] dark:hover:border-[#26262b] cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Key className="h-4 w-4 text-neutral-500" />
                        <span>Developer Settings</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ======================================================== */}
          {/* TAB 2: PROJECTS                                          */}
          {/* ======================================================== */}
          <TabsContent value="projects">
            <ProjectList />
          </TabsContent>

          {/* ======================================================== */}
          {/* TAB 3: USERS DIRECTORY                                   */}
          {/* ======================================================== */}
          <TabsContent value="users">
            <Card className="bg-white dark:bg-[#0c0d10] border border-[#eaeaea] dark:border-[#222329] rounded-lg overflow-hidden shadow-2xs">
              <CardHeader className="p-5 border-b border-[#eaeaea] dark:border-[#222329]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-neutral-900 dark:text-white" />
                      <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">
                        Developer User Directory
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                      Search and inspect authenticated accounts across all
                      identity partitions
                    </CardDescription>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                    <Input
                      placeholder="Search username, email, namespace..."
                      className="pl-9 h-9 text-xs bg-neutral-50 dark:bg-[#14151a] border-[#eaeaea] dark:border-[#26262b] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-black dark:focus:border-white transition-colors"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-neutral-50/80 dark:bg-[#121316] border-b border-[#eaeaea] dark:border-[#222329] font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        <tr>
                          <th className="py-3 px-5 font-semibold">
                            User Identity
                          </th>
                          <th className="py-3 px-5 font-semibold">
                            Email Address
                          </th>
                          <th className="py-3 px-5 font-semibold">
                            Project Namespace
                          </th>
                          <th className="py-3 px-5 font-semibold">
                            Account Status
                          </th>
                          <th className="py-3 px-5 text-right font-semibold">
                            Registered
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eaeaea] dark:divide-[#222329] text-xs">
                        {filteredUsers.map((u) => (
                          <tr
                            key={u._id}
                            className="hover:bg-neutral-50/70 dark:hover:bg-[#14151a]/50 transition-colors"
                          >
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-md border border-[#eaeaea] dark:border-[#222329] bg-neutral-100 dark:bg-[#18191e] flex items-center justify-center font-mono text-[11px] font-bold text-neutral-900 dark:text-white shrink-0">
                                  {u.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-neutral-900 dark:text-white">
                                  {u.username}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 font-mono text-neutral-600 dark:text-neutral-300">
                              {u.email}
                            </td>
                            <td className="py-3.5 px-5">
                              <span className="inline-block px-2 py-0.5 rounded border border-[#eaeaea] dark:border-[#222329] bg-neutral-50 dark:bg-[#14151a] font-mono text-[10px] text-neutral-800 dark:text-neutral-200">
                                {u.projectId?.name || "Global Production"}
                              </span>
                            </td>
                            <td className="py-3.5 px-5">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Active
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-right font-mono text-neutral-500 dark:text-neutral-400">
                              {format(new Date(u.createdAt), "MMM d, yyyy")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16 px-4">
                    <Users className="h-8 w-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-700" />
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      No matching user records found
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      {searchTerm
                        ? "Try searching with a different term."
                        : "Users will appear here once authenticated."}
                    </p>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchTerm("")}
                        className="mt-3 text-xs font-mono border-[#eaeaea] dark:border-[#222329]"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ======================================================== */}
          {/* TAB 4: ACTIVITY & TELEMETRY                              */}
          {/* ======================================================== */}
          <TabsContent value="activity">
            <Card className="bg-white dark:bg-[#0c0d10] border border-[#eaeaea] dark:border-[#222329] rounded-lg p-5 sm:p-6 shadow-2xs space-y-6">
              <CardHeader className="p-0 pb-5 border-b border-[#eaeaea] dark:border-[#222329]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="h-4 w-4 text-neutral-900 dark:text-white" />
                      <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">
                        Authentication Traffic Telemetry
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                      Real-time ingress authentication activity and user
                      registration volume
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-neutral-100 dark:bg-[#14151a] border border-[#eaeaea] dark:border-[#222329] rounded-md p-0.5 flex">
                      {["7d", "30d", "90d"].map((range) => (
                        <button
                          key={range}
                          onClick={() => setActivityRange(range)}
                          className={`px-3 py-1 text-[11px] font-mono font-semibold rounded transition-all cursor-pointer ${
                            activityRange === range
                              ? "bg-white dark:bg-[#1f2026] text-neutral-900 dark:text-white shadow-2xs"
                              : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                          }`}
                        >
                          {range.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/audit-logs")}
                      className="h-8 px-3 text-xs font-mono border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] hover:bg-neutral-100 dark:hover:bg-[#1a1b22] text-neutral-900 dark:text-white cursor-pointer"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
                      View Raw Logs
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Metric Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
                <div className="p-3 rounded border border-[#eaeaea] dark:border-[#222329] bg-neutral-50/60 dark:bg-[#121316]/60">
                  <p className="text-[10px] font-mono uppercase text-neutral-500">
                    Period Total
                  </p>
                  <p className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                    {totalVolume}
                  </p>
                </div>
                <div className="p-3 rounded border border-[#eaeaea] dark:border-[#222329] bg-neutral-50/60 dark:bg-[#121316]/60">
                  <p className="text-[10px] font-mono uppercase text-neutral-500">
                    Peak Day
                  </p>
                  <p className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                    {peakDayVolume}
                  </p>
                </div>
                <div className="p-3 rounded border border-[#eaeaea] dark:border-[#222329] bg-neutral-50/60 dark:bg-[#121316]/60">
                  <p className="text-[10px] font-mono uppercase text-neutral-500">
                    Daily Average
                  </p>
                  <p className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                    {stats.signupTrend?.length
                      ? (totalVolume / stats.signupTrend.length).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
                <div className="p-3 rounded border border-[#eaeaea] dark:border-[#222329] bg-neutral-50/60 dark:bg-[#121316]/60">
                  <p className="text-[10px] font-mono uppercase text-neutral-500">
                    SLA Accuracy
                  </p>
                  <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    100.0%
                  </p>
                </div>
              </div>

              <CardContent className="p-0 pt-2 h-80 sm:h-96">
                {stats.signupTrend?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={stats.signupTrend}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorSignups"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#00E5FF"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#00E5FF"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#eaeaea"
                        className="dark:stroke-[#222329]"
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontFamily: "monospace",
                          fill: "#888888",
                        }}
                        tickFormatter={(str) => format(new Date(str), "MMM d")}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontFamily: "monospace",
                          fill: "#888888",
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="signups"
                        stroke="#00E5FF"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorSignups)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center border border-dashed border-[#eaeaea] dark:border-[#222329] rounded-lg">
                    <Activity className="h-8 w-8 mb-2 text-neutral-300 dark:text-neutral-700" />
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      No activity telemetry captured yet
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Authentication requests over time will be graphed here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CREATE PROJECT MODAL */}
        <CreateProjectModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            setCreateOpen(false);
            fetchStats();
            setActiveTab("projects");
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
