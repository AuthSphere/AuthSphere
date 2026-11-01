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
  ChevronLeft,
  Loader2,
  Zap,
  ShieldCheck,
} from "lucide-react";

import { useAnalytics } from "@/hooks/useAnalytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg p-3 shadow-lg">
        <p className="text-xs text-muted-foreground mb-1">
          {label ? format(new Date(label), "MMM dd, yyyy") : ""}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="text-muted-foreground capitalize">
              {entry.name}:
            </span>
            <span className="font-bold">{entry.value}</span>
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-xs text-muted-foreground">Loading analytics...</p>
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
    <div className="min-h-screen">
      <div className="w-[95vw] mx-auto py-8 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b">
          <div className="space-y-1">
            <Link
              to={`/projects/${projectId}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Project
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Monitor signups, sessions, and authentication activity.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Signups",
              value: overview.data?.signups?.month || 0,
              trend: overview.data?.signups?.trend,
              icon: UserPlus,
              color: "text-blue-500",
            },
            {
              label: "Active Today",
              value: overview.data?.logins?.today || 0,
              trend: overview.data?.logins?.trend,
              icon: LogIn,
              color: "text-emerald-500",
            },
            {
              label: "Retention",
              value: overview.data?.activeUsers?.retention || "84.2%",
              icon: Users,
              color: "text-violet-500",
            },
            {
              label: "Avg Latency",
              value: overview.data?.health?.latency || "42ms",
              icon: Zap,
              color: "text-amber-500",
            },
          ].map((metric, i) => (
            <Card
              key={i}
              className="bg-card/50 border-border/50 hover:bg-card/70 transition-colors"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-muted ${metric.color}`}>
                    <metric.icon className="h-4 w-4" />
                  </div>
                  {metric.trend && metric.trend !== "0%" && (
                    <Badge
                      variant="outline"
                      className={`text-[10px] gap-1 ${metric.trend.startsWith("+") ? "text-emerald-500" : "text-amber-500"}`}
                    >
                      {metric.trend.startsWith("+") ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {metric.trend.replace(/[+-]/g, "")}
                    </Badge>
                  )}
                </div>
                <div className="text-2xl font-bold mb-0.5">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* CHART — 2/3 width */}
          <Card className="lg:col-span-2 bg-card/30 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  User Activity
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Daily signups vs active users
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] text-muted-foreground">
                    Signups
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-muted-foreground">
                    Active
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
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
                      <stop
                        offset="5%"
                        stopColor="var(--primary)"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorActive"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "var(--muted-foreground)",
                    }}
                    tickFormatter={(str) => format(new Date(str), "MMM d")}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "var(--muted-foreground)",
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    name="Signups"
                    type="monotone"
                    dataKey="signups"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSignups)"
                  />
                  <Area
                    name="Active Users"
                    type="monotone"
                    dataKey="active"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorActive)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5">
            {/* Auth Provider Distribution */}
            <Card className="bg-card/30 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Auth Providers</CardTitle>
                <CardDescription className="text-xs">
                  Distribution by method
                </CardDescription>
              </CardHeader>
              <CardContent>
                {providerData.length > 0 ? (
                  <>
                    <div className="h-[180px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={providerData}
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                          >
                            {providerData.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              borderColor: "var(--border)",
                              color: "var(--foreground)",
                              borderRadius: "8px",
                              fontSize: "11px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <p className="text-[10px] text-muted-foreground">Top</p>
                        <p className="text-sm font-bold text-primary">
                          {providerData[0]?.name}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {providerData.slice(0, 4).map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <div
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{
                                backgroundColor: COLORS[i % COLORS.length],
                              }}
                            />
                            <span className="text-[10px] truncate">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold">
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
                  <div className="h-[180px] flex flex-col items-center justify-center">
                    <ShieldCheck className="h-8 w-8 text-muted-foreground/20 mb-2" />
                    <p className="text-xs text-muted-foreground">No data yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-card/30 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Uptime</span>
                  <span className="text-xs font-bold text-emerald-500">
                    99.99%
                  </span>
                </div>
                <Separator />
                {[
                  { name: "Auth Core", status: "Active" },
                  { name: "Session Store", status: "Active" },
                  { name: "Edge Network", status: "Active" },
                ].map((service, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs">{service.name}</span>
                    </div>
                    <Badge className="bg-emerald-500 text-[10px]">
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <Card className="bg-card/30 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Latest authentication events
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/audit-logs">
                View All
                <ChevronLeft className="h-4 w-4 ml-1 rotate-180" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {activity.data?.recentLogins?.length > 0 ? (
              <div className="divide-y">
                {activity.data.recentLogins.slice(0, 6).map((login, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {login.user[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {login.user}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {login.email}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="outline" className="text-[10px] mb-1">
                        {login.provider}
                      </Badge>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(login.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-t">
                <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">
                  No recent activity
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
