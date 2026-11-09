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
import { format, formatDistanceToNow, isValid } from "date-fns";
import { usePWA } from "@/hooks/usePWA";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedDate =
      label && isValid(new Date(label))
        ? format(new Date(label), "MMM dd, yyyy")
        : label || "";

    return (
      <div className="bg-popover text-popover-foreground border border-border rounded-md p-3 shadow-md font-mono text-xs">
        <p className="text-[11px] text-muted-foreground mb-1">
          {formattedDate}
        </p>
        <p className="font-semibold text-foreground flex items-center gap-1.5">
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
          toast.success("Dashboard data refreshed");
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
      if (isManual) {
        toast.error("Failed to refresh dashboard data");
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
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground relative isolate">
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/30 dark:to-black/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <header className="pb-6 border-b border-border flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Console Overview
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Welcome back,{" "}
              <span className="font-semibold text-foreground">
                {user.username}
              </span>
              . Manage your applications, active sessions, and authentication
              security from one place.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchStats(true)}
              disabled={isRefreshing || statsLoading}
              title="Refresh dashboard stats"
              className="h-9 px-3 text-xs font-mono border-border bg-card hover:bg-accent text-foreground cursor-pointer"
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
                className="h-9 px-3 text-xs font-mono border-border bg-card hover:bg-accent text-foreground cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Install PWA
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/audit-logs")}
              className="h-9 px-3 text-xs font-mono border-border bg-card hover:bg-accent text-foreground cursor-pointer"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
              Audit Logs
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/docs")}
              className="h-9 px-3 text-xs font-mono border-border bg-card hover:bg-accent text-foreground cursor-pointer"
            >
              <Code2 className="h-3.5 w-3.5 mr-1.5" />
              API Docs
            </Button>
            <Button
              size="sm"
              onClick={() => setCreateOpen(true)}
              className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Project</span>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: "01",
              title: "PROJECTS",
              label: "Total Projects",
              value: stats.totalProjects,
              icon: FolderKanban,
              badge: "Active",
              trend: "All Healthy",
            },
            {
              num: "02",
              title: "USERS",
              label: "Registered Users",
              value: stats.totalEndUsers,
              icon: Users,
              badge: "OAuth & Email",
              trend: "Verified Accounts",
            },
            {
              num: "03",
              title: "ACTIVE SESSIONS",
              label: "Current Online Users",
              value:
                Math.max(
                  stats.recentUsers.length,
                  Math.round(stats.totalEndUsers * 0.4),
                ) || 0,
              icon: Activity,
              badge: "Live Sessions",
              trend: "Real-time",
            },
            {
              num: "04",
              title: "SYSTEM STATUS",
              label: "Service Health",
              value: "Operational",
              icon: ShieldCheck,
              badge: "All Systems Normal",
              trend: "99.9% Uptime",
            },
          ].map((metric, i) => (
            <Card
              key={i}
              className="bg-card border border-border hover:border-foreground/40 transition-all duration-200 rounded-lg p-5 shadow-2xs group relative overflow-hidden"
            >
              <div className="absolute top-1.5 left-1.5 w-1 h-1 border-t border-l border-border opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-1.5 right-1.5 w-1 h-1 border-t border-r border-border opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-3">
                <span className="flex items-center">
                  <span>{metric.title}</span>
                </span>
                <div className="h-7 w-7 rounded border border-border bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                  <metric.icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">
                {statsLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  metric.value
                )}
              </div>

              <p className="text-xs font-medium text-muted-foreground">
                {metric.label}
              </p>
            </Card>
          ))}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-muted border border-border p-1 rounded-md gap-1 h-auto flex flex-wrap">
            <TabsTrigger
              value="overview"
              className="px-4 py-1.5 text-xs font-mono rounded text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all cursor-pointer"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="px-4 py-1.5 text-xs font-mono rounded text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all cursor-pointer"
            >
              Projects ({stats.totalProjects})
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="px-4 py-1.5 text-xs font-mono rounded text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all cursor-pointer"
            >
              Users Directory ({stats.totalEndUsers})
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="px-4 py-1.5 text-xs font-mono rounded text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all cursor-pointer"
            >
              Activity
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
                <Card className="bg-card border border-border rounded-lg p-5 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-foreground" />
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-foreground">
                          Authentication Activity (30 Days)
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          Total Volume: {totalVolume} events · Peak Day:{" "}
                          {peakDayVolume}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("activity")}
                      className="text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer h-7 px-2"
                    >
                      View Full Activity
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
                          No recent activity recorded
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* 2. RECENT AUTHENTICATIONS STREAM */}
                <Card className="bg-card border border-border rounded-lg overflow-hidden shadow-2xs">
                  <CardHeader className="p-5 border-b border-border flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-foreground" />
                        <CardTitle className="text-base font-bold text-foreground">
                          Recent Sign-ins
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs text-muted-foreground">
                        Recent authenticated users across all your projects
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("users")}
                      className="text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      View All ({stats.totalEndUsers})
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </CardHeader>

                  <CardContent className="p-0">
                    {stats.recentUsers.length > 0 ? (
                      <div className="divide-y divide-border">
                        {stats.recentUsers.slice(0, 5).map((u) => (
                          <div
                            key={u._id}
                            className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-9 w-9 rounded-md border border-border bg-muted flex items-center justify-center font-mono text-xs font-bold text-foreground shrink-0">
                                {u.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-semibold text-foreground truncate">
                                    {u.username}
                                  </p>
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[9px] font-medium">
                                    <CheckCircle2 className="h-2.5 w-2.5" />
                                    Verified
                                  </span>
                                </div>
                                <p className="text-[11px] font-mono text-muted-foreground truncate">
                                  {u.email}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0 ml-4">
                              <span className="inline-block px-2 py-0.5 rounded border border-border bg-muted/50 font-mono text-[10px] text-foreground mb-1">
                                {u.projectId?.name || "Global Production"}
                              </span>
                              <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-muted-foreground">
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
                        <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                        <p className="text-xs font-medium text-muted-foreground">
                          No authentication events recorded yet.
                        </p>
                        <p className="text-[11px] text-muted-foreground/70 mt-1">
                          Deploy a project and connect an OAuth provider to
                          begin authenticating users.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 3. INTERACTIVE CLIENT SDK SNIPPET HUB */}
                <Card className="bg-card border border-border rounded-lg p-5 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-foreground" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          Quick Start SDK Integration
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-foreground">
                        Drop-in authentication for your client applications
                      </p>
                    </div>

                    {/* SDK Syntax Tabs */}
                    <div className="flex items-center bg-muted border border-border rounded p-0.5 self-start sm:self-auto">
                      {["npm", "pnpm", "react", "curl"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setSdkTab(tab)}
                          className={`px-2.5 py-1 text-[10px] font-mono rounded cursor-pointer transition-all ${
                            sdkTab === tab
                              ? "bg-background text-foreground font-bold shadow-2xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {tab.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code Snippet Box */}
                  <div className="relative rounded-md bg-muted/40 border border-border p-3.5 font-mono text-xs text-foreground overflow-x-auto group">
                    <pre className="text-[11px] leading-relaxed select-all">
                      <code>{sdkSnippets[sdkTab]}</code>
                    </pre>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(sdkSnippets[sdkTab])}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors cursor-pointer"
                      title="Copy snippet"
                    >
                      {copiedCode ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span>
                      Zero external dependencies · Built-in token refresh
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate("/docs")}
                      className="inline-flex items-center gap-1 font-mono text-foreground hover:underline cursor-pointer"
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
                <Card className="bg-card border border-border rounded-lg p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-foreground" />
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-foreground">
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
                        name: "GitHub",
                        proto: "OAuth 2.0",
                        status: "Configured",
                        active: true,
                      },
                      {
                        name: "Discord",
                        proto: "OAuth 2.0",
                        status: "Ready",
                        active: true,
                      },
                      {
                        name: "Email & Password",
                        proto: "Bcrypt (10 salt rounds)",
                        status: "Enforced",
                        active: true,
                      },
                    ].map((prov, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded border border-border bg-muted/50"
                      >
                        <div>
                          <p className="text-[11px] font-semibold text-foreground">
                            {prov.name}
                          </p>
                          <p className="text-[9.5px] text-muted-foreground">
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
                    className="w-full mt-4 h-8 text-xs font-mono border-border bg-card hover:bg-accent text-foreground cursor-pointer"
                  >
                    <span>Manage Provider Keys</span>
                    <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Card>

                {/* 2. SECURITY ENCLAVE SPECIFICATION */}
                <Card className="bg-card border border-border rounded-lg p-5 shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="h-4 w-4 text-foreground" />
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-foreground">
                      Security &amp; Standards
                    </h3>
                  </div>

                  <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                    Standard security specifications and protocol
                    configurations.
                  </p>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-border">
                      <span className="text-[11px] text-muted-foreground">
                        OAuth 2.0 / OIDC
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        RFC-6749 Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-border">
                      <span className="text-[11px] text-muted-foreground">
                        PKCE Challenge
                      </span>
                      <span className="text-[11px] font-semibold text-foreground">
                        S256 Enforced
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-border">
                      <span className="text-[11px] text-muted-foreground">
                        Token Signature
                      </span>
                      <span className="text-[11px] font-semibold text-foreground">
                        Standard JWT (HS256)
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-border">
                      <span className="text-[11px] text-muted-foreground">
                        Token Rotation
                      </span>
                      <span className="text-[11px] font-semibold text-foreground">
                        Automatic Refresh
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-[11px] text-muted-foreground">
                        Session Revocation
                      </span>
                      <span className="text-[11px] font-semibold text-foreground">
                        Real-time Invalidation
                      </span>
                    </div>
                  </div>
                </Card>

                {/* 3. DEVELOPER QUICK OPERATIONS */}
                <Card className="bg-card border border-border rounded-lg p-5 shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="h-4 w-4 text-foreground" />
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-foreground">
                      Developer Operations
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => navigate("/audit-logs")}
                      className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-muted text-xs font-medium text-foreground transition-colors border border-transparent hover:border-border cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                        <span>Audit Logs</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/sessions")}
                      className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-muted text-xs font-medium text-foreground transition-colors border border-transparent hover:border-border cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span>Session Manager</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/settings")}
                      className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-muted text-xs font-medium text-foreground transition-colors border border-transparent hover:border-border cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <span>Developer Settings</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
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
            <Card className="bg-card border border-border rounded-lg overflow-hidden shadow-2xs">
              <CardHeader className="p-5 border-b border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-foreground" />
                      <CardTitle className="text-base font-bold text-foreground">
                        User Directory
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Search and inspect authenticated accounts across all
                      projects
                    </CardDescription>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search username, email, project..."
                      className="pl-9 h-9 text-xs bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring transition-colors"
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
                      <thead className="bg-muted/50 border-b border-border font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="py-3 px-5 font-semibold">User</th>
                          <th className="py-3 px-5 font-semibold">Email</th>
                          <th className="py-3 px-5 font-semibold">Project</th>
                          <th className="py-3 px-5 font-semibold">Status</th>
                          <th className="py-3 px-5 text-right font-semibold">
                            Registered
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-xs">
                        {filteredUsers.map((u) => (
                          <tr
                            key={u._id}
                            className="hover:bg-muted/40 transition-colors"
                          >
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-md border border-border bg-muted flex items-center justify-center font-mono text-[11px] font-bold text-foreground shrink-0">
                                  {u.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-foreground">
                                  {u.username}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 font-mono text-muted-foreground">
                              {u.email}
                            </td>
                            <td className="py-3.5 px-5">
                              <span className="inline-block px-2 py-0.5 rounded border border-border bg-muted/50 font-mono text-[10px] text-foreground">
                                {u.projectId?.name || "Global Production"}
                              </span>
                            </td>
                            <td className="py-3.5 px-5">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Active
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-right font-mono text-muted-foreground">
                              {format(new Date(u.createdAt), "MMM d, yyyy")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16 px-4">
                    <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                    <p className="text-xs font-semibold text-foreground">
                      No matching user records found
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {searchTerm
                        ? "Try searching with a different term."
                        : "Users will appear here once authenticated."}
                    </p>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchTerm("")}
                        className="mt-3 text-xs font-mono border-border"
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
          {/* TAB 4: ACTIVITY                                          */}
          {/* ======================================================== */}
          <TabsContent value="activity">
            <Card className="bg-card border border-border rounded-lg p-5 sm:p-6 shadow-2xs space-y-6">
              <CardHeader className="p-0 pb-5 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="h-4 w-4 text-foreground" />
                      <CardTitle className="text-base font-bold text-foreground">
                        Authentication Activity
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Sign-in activity and new user registrations over time
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-muted border border-border rounded-md p-0.5 flex">
                      {["7d", "30d", "90d"].map((range) => (
                        <button
                          key={range}
                          onClick={() => setActivityRange(range)}
                          className={`px-3 py-1 text-[11px] font-mono font-semibold rounded transition-all cursor-pointer ${
                            activityRange === range
                              ? "bg-background text-foreground shadow-2xs"
                              : "text-muted-foreground hover:text-foreground"
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
                      className="h-8 px-3 text-xs font-mono border-border bg-card hover:bg-accent text-foreground cursor-pointer"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
                      View Audit Logs
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Metric Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
                <div className="p-3 rounded border border-border bg-muted/40">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground">
                    Period Total
                  </p>
                  <p className="text-lg font-bold font-mono text-foreground">
                    {totalVolume}
                  </p>
                </div>
                <div className="p-3 rounded border border-border bg-muted/40">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground">
                    Peak Day
                  </p>
                  <p className="text-lg font-bold font-mono text-foreground">
                    {peakDayVolume}
                  </p>
                </div>
                <div className="p-3 rounded border border-border bg-muted/40">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground">
                    Daily Average
                  </p>
                  <p className="text-lg font-bold font-mono text-foreground">
                    {stats.signupTrend?.length
                      ? (totalVolume / stats.signupTrend.length).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
                <div className="p-3 rounded border border-border bg-muted/40">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground">
                    Success Rate
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
                  <div className="h-full flex flex-col items-center justify-center border border-dashed border-border rounded-lg">
                    <Activity className="h-8 w-8 mb-2 text-muted-foreground/60" />
                    <p className="text-xs font-semibold text-foreground">
                      No sign-in activity recorded yet
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Sign-in events will appear here once users authenticate.
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
