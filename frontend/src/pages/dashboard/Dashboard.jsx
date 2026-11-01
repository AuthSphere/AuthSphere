import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

import ProjectList from "@/components/project/ProjectList";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Activity,
  ShieldCheck,
  Code2,
  Clock,
  Zap,
  Plus,
  ChevronRight,
  Loader2,
  FileSpreadsheet,
  Key,
  Download,
  Search,
  ArrowUpRight,
  ArrowDownRight,
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
import { Input } from "@/components/ui/input";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg p-3 shadow-lg">
        <p className="text-xs text-muted-foreground mb-1">
          {format(new Date(label), "MMM dd, yyyy")}
        </p>
        <p className="text-sm font-bold text-primary">
          {payload[0].value} signups
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
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
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [activityRange, setActivityRange] = useState("30d");

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setStatsLoading(false);
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

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-xs text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  // CustomTooltip moved outside Dashboard

  const filteredUsers = stats.recentUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.projectId.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      <div className="w-[96vw] mx-auto space-y-4">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, {user.username.split(" ")[0]}
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {isInstallable && (
              <Button
                variant="outline"
                size="sm"
                onClick={installPWA}
                className="border-primary/50 text-primary bg-primary/5 animate-pulse"
              >
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/docs")}
              className="whitespace-nowrap"
            >
              <Code2 className="h-4 w-4 mr-2" />
              API Docs
            </Button>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Projects",
              value: stats.totalProjects,
              icon: FolderKanban,
              color: "text-blue-500",
              trend: "+2",
              trendUp: true,
            },
            {
              label: "Total Users",
              value: stats.totalEndUsers,
              icon: Users,
              color: "text-emerald-500",
              trend: "+12%",
              trendUp: true,
            },
            {
              label: "Active Sessions",
              value: Math.round(stats.totalEndUsers * 0.4),
              icon: Activity,
              color: "text-violet-500",
              trend: "-3%",
              trendUp: false,
            },
            {
              label: "Avg Latency",
              value: "124ms",
              icon: Zap,
              color: "text-amber-500",
              trend: "穩定",
              trendUp: null,
            },
          ].map((metric, i) => (
            <Card
              key={i}
              className="bg-card/50 border-border/50 hover:bg-card/70 transition-all hover:shadow-lg group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-muted ${metric.color}`}>
                    <metric.icon className="h-4 w-4" />
                  </div>
                  {metric.trend && (
                    <div
                      className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        metric.trendUp === true
                          ? "bg-emerald-500/10 text-emerald-500"
                          : metric.trendUp === false
                            ? "bg-red-500/10 text-red-500"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {metric.trendUp === true && (
                        <ArrowUpRight className="h-3 w-3" />
                      )}
                      {metric.trendUp === false && (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {metric.trend}
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold mb-1">
                  {statsLoading ? (
                    <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                  ) : (
                    metric.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TABS */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-muted/50 border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* RECENT USERS */}
              <div className="lg:col-span-2">
                <Card className="bg-card/30 border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Recent Users
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Latest authentication events
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("users")}
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {stats.recentUsers.length > 0 ? (
                      <div className="space-y-2">
                        {stats.recentUsers.slice(0, 5).map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                          >
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {user.username}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant="outline"
                                className="text-[10px] mb-1"
                              >
                                {user.projectId.name}
                              </Badge>
                              <p className="text-[10px] text-muted-foreground">
                                {formatDistanceToNow(new Date(user.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground">
                          No users yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* SIDEBAR */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="bg-card/30 border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                      onClick={() => navigate("/audit-logs")}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      View Audit Logs
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                      onClick={() => navigate("/docs")}
                    >
                      <Code2 className="h-4 w-4 mr-2" />
                      API Reference
                    </Button>
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
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Uptime
                        </span>
                        <span className="text-xs font-bold text-emerald-500">
                          99.98%
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          OAuth 2.0
                        </span>
                        <Badge className="bg-emerald-500 text-[10px]">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Encryption
                        </span>
                        <span className="text-xs font-mono">AES-256</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* PROJECTS TAB */}
          <TabsContent value="projects">
            <ProjectList />
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users">
            <Card className="bg-card/30 border-border/50">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">All Users</CardTitle>
                    <CardDescription className="text-xs">
                      Complete user directory across all projects
                    </CardDescription>
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users or projects..."
                      className="pl-9 h-9 text-xs bg-muted/30"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/30 border-y">
                        <tr>
                          <th className="py-3 px-4 text-left text-xs font-bold text-muted-foreground">
                            User
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-bold text-muted-foreground">
                            Email
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-bold text-muted-foreground">
                            Project
                          </th>
                          <th className="py-3 px-4 text-right text-xs font-bold text-muted-foreground">
                            Created
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-muted/20">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold border">
                                  {user.username.charAt(0)}
                                </div>
                                <span className="text-sm font-medium">
                                  {user.username}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {user.email}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="text-xs">
                                {user.projectId.name}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right text-sm">
                              {format(new Date(user.createdAt), "MMM d, yyyy")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground">
                      No users found
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACTIVITY TAB */}
          <TabsContent value="activity">
            <Card className="bg-card/30 border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Authentication Activity
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Signup trends over the last 30 days
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted/50 border rounded-lg p-1 hidden sm:flex">
                      {["7d", "30d", "90d"].map((range) => (
                        <button
                          key={range}
                          onClick={() => setActivityRange(range)}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                            activityRange === range
                              ? "bg-card text-foreground shadow-sm"
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
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Full Logs
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-100">
                {stats.signupTrend?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={stats.signupTrend}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
                            stopColor="var(--primary)"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--primary)"
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
                        type="monotone"
                        dataKey="signups"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorSignups)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg">
                    <Activity className="h-8 w-8 mb-2 text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground">
                      No activity data
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
