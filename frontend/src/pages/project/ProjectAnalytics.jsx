import React from "react";
import { useParams, Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Users,
  UserPlus,
  LogIn,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ArrowLeft,
  ChevronLeft,
  Loader2,
  Zap,
  ShieldCheck,
  RefreshCw,
  BarChart2,
  Lock,
} from "lucide-react";

import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import TechSeparator from "@/components/common/TechSeparator";

const COLORS = [
  "#00E5FF",
  "#00E68A",
  "#A78BFA",
  "#F59E0B",
  "#3B82F6",
  "#EC4899",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#14151a] border border-[#eaeaea] dark:border-[#222329] rounded-md p-3 shadow-md font-mono text-xs">
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">
          {label ? format(new Date(label), "MMM dd, yyyy") : ""}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="text-neutral-500 capitalize">{entry.name}:</span>
            <span className="font-bold text-neutral-900 dark:text-white">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ProjectAnalytics = () => {
  const { projectId } = useParams();
  const { overview, charts, activity, isLoading, isError } =
    useAnalytics(projectId);

  if (isError) {
    toast.error("Failed to load analytics data");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#09090c] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-neutral-300 dark:border-neutral-700 border-t-black dark:border-t-white rounded-full animate-spin mb-2" />
        <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400 tracking-wider">
          SYNCHRONIZING TELEMETRY STREAM...
        </p>
      </div>
    );
  }

  const providerData = charts.data?.providerDistribution || [];

  const combinedChartData =
    charts.data?.dailySignups?.map((s, i) => ({
      date: s.date,
      signups: s.count,
      active: charts.data.dailyActiveUsers?.[i]?.count || 0,
    })) || [];

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 antialiased selection:bg-black selection:text-white relative isolate">
      {/* Precision Engineering Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/30 dark:to-black/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ─── COMMAND BAR & HEADER ─── */}
        <header className="pb-6 border-b border-[#eaeaea] dark:border-[#222329] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
              <Link
                to={`/projects/${projectId}`}
                className="flex items-center gap-1.5 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors group cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>PROJECT PROFILE</span>
              </Link>
              <TechSeparator />
              <span className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                TELEMETRY &amp; ANALYTICS
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>TELEMETRY ACTIVE</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Project Performance Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Real-time audit velocity, concurrent principal sessions, provider
              distribution, and protocol round-trip latency.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="h-9 px-3 text-xs font-mono border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] hover:bg-neutral-100 dark:hover:bg-[#1a1b22] text-neutral-900 dark:text-white cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              <span>Refresh Metrics</span>
            </Button>
          </div>
        </header>

        {/* ─── 4 PRECISION METRIC TILES ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              index: "01",
              label: "MONTHLY ENROLLMENTS",
              value: overview.data?.signups?.month || 0,
              trend: overview.data?.signups?.trend,
              icon: UserPlus,
              color: "text-blue-500",
            },
            {
              index: "02",
              label: "ACTIVE TODAY",
              value: overview.data?.logins?.today || 0,
              trend: overview.data?.logins?.trend,
              icon: LogIn,
              color: "text-emerald-500",
            },
            {
              index: "03",
              label: "RETENTION QUOTIENT",
              value: overview.data?.activeUsers?.retention || "84.2%",
              trend: "+2.4%",
              icon: Users,
              color: "text-violet-500",
            },
            {
              index: "04",
              label: "DISPATCH LATENCY",
              value: overview.data?.health?.latency || "< 42ms",
              trend: "OPTIMAL",
              icon: Zap,
              color: "text-amber-500",
            },
          ].map((m) => (
            <div
              key={m.index}
              className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] rounded-xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between font-mono text-xs mb-3">
                <span className="text-[10px] text-neutral-400 tracking-wider">
                  {m.index} // {m.label}
                </span>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white">
                    {m.value}
                  </span>
                  {m.trend && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        m.trend.startsWith("+") || m.trend === "OPTIMAL"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border-neutral-200 dark:border-neutral-800 text-neutral-500"
                      }`}
                    >
                      {m.trend}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── MAIN CHARTS GRID ─── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Activity Area Chart (2/3) */}
          <div className="lg:col-span-2 border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="px-5 py-3.5 border-b border-[#eaeaea] dark:border-[#222329] flex items-center justify-between text-xs font-mono bg-neutral-50/70 dark:bg-[#14151a]">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                  AUTHENTICATION FLOW VELOCITY (30-DAY)
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-neutral-900 dark:bg-white" />
                  <span className="text-neutral-500">Signups</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-neutral-500">Active</span>
                </div>
              </div>
            </div>

            <div className="p-5 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedChartData}>
                  <defs>
                    <linearGradient
                      id="colorSignups"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorActive"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#00E68A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00E68A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    className="text-neutral-200 dark:text-neutral-800"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "#888888",
                      fontFamily: "monospace",
                    }}
                    tickFormatter={(str) => format(new Date(str), "MMM d")}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "#888888",
                      fontFamily: "monospace",
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    name="Signups"
                    type="monotone"
                    dataKey="signups"
                    stroke="#111827"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSignups)"
                  />
                  <Area
                    name="Active Users"
                    type="monotone"
                    dataKey="active"
                    stroke="#00E68A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorActive)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Provider Share Pie Chart (1/3) */}
          <div className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="px-5 py-3.5 border-b border-[#eaeaea] dark:border-[#222329] flex items-center justify-between text-xs font-mono bg-neutral-50/70 dark:bg-[#14151a]">
              <span className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                IDENTITY PROVIDER SHARE
              </span>
              <span className="text-[10px] text-neutral-500">SPEC: OIDC</span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              {providerData.length > 0 ? (
                <>
                  <div className="h-45 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={providerData}
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                        >
                          {providerData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none font-mono">
                      <p className="text-[9px] text-neutral-400 uppercase">
                        LEAD
                      </p>
                      <p className="text-xs font-bold text-neutral-900 dark:text-white">
                        {providerData[0]?.name}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-[11px]">
                    {providerData.slice(0, 4).map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded border border-[#eaeaea] dark:border-[#26262b] bg-neutral-50 dark:bg-[#16171d]"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <div
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{
                              backgroundColor: COLORS[i % COLORS.length],
                            }}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>
                        <span className="font-semibold">
                          {(
                            (item.value /
                              providerData.reduce((a, b) => a + b.value, 0)) *
                            100
                          ).toFixed(0)}
                          %
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-center font-mono text-xs text-neutral-500">
                  <ShieldCheck className="h-8 w-8 text-neutral-300 dark:text-neutral-700 mb-2" />
                  <p>No provider telemetry recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── RECENT ACTIVITY TIMELINE ─── */}
        <div className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] rounded-xl shadow-xs overflow-hidden font-mono text-xs">
          <div className="px-5 py-3.5 border-b border-[#eaeaea] dark:border-[#222329] flex items-center justify-between bg-neutral-50/70 dark:bg-[#14151a]">
            <span className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              <span>RECENT AUTHENTICATION EXCHANGES</span>
            </span>
            <Link
              to="/audit-logs"
              className="text-[11px] text-neutral-500 hover:text-black dark:hover:text-white underline cursor-pointer"
            >
              All Audit Logs →
            </Link>
          </div>

          <div className="divide-y divide-[#eaeaea] dark:divide-[#222329]">
            {activity.data?.recentLogins?.length > 0 ? (
              activity.data.recentLogins.slice(0, 6).map((login, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 hover:bg-neutral-50/80 dark:hover:bg-[#16171d] transition-colors gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-[#181920] border border-[#eaeaea] dark:border-[#26262b] flex items-center justify-center font-bold text-xs text-neutral-900 dark:text-white shrink-0">
                      {login.user?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-white truncate font-sans text-xs">
                        {login.user}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate max-w-56">
                        {login.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2 py-0.5 rounded border border-[#eaeaea] dark:border-[#26262b] bg-neutral-100 dark:bg-[#16171d] text-neutral-700 dark:text-neutral-300 text-[10px] font-semibold uppercase">
                      {login.provider || "LOCAL"}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {formatDistanceToNow(new Date(login.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-500 text-xs">
                No recent authentication activity recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
