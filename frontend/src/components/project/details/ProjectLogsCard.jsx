import React, { useState, useEffect } from "react";
import { getProjectLogs } from "@/api/AuditLogAPI";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  RefreshCw,
  Clock,
  ShieldAlert,
  User,
  Activity,
  Zap,
  Lock,
  Globe,
  Loader2,
  FileJson,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProjectLogsCard = ({ projectId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, security, verify, flow

  const fetchLogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProjectLogs(projectId);
      if (res.success) {
        setLogs(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (projectId) fetchLogs();
  }, [projectId, fetchLogs]);

  const getIcon = (category) => {
    switch (category) {
      case "security":
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case "auth":
        return <Lock className="h-4 w-4 text-primary" />;
      case "user":
        return <User className="h-4 w-4 text-blue-500" />;
      case "project":
        return <Activity className="h-4 w-4 text-orange-500" />;
      default:
        return <Zap className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.actor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      log.metadata?.ip?.includes(search);

    const matchesFilter = filter === "all" || log.category === filter;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      return format(new Date(dateString), "MMM dd, HH:mm:ss");
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <Card className="bg-card/30 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Audit Trail
            </CardTitle>
            <CardDescription>
              Immutable record of all security and administrative events within
              this project.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchLogs}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs by action, user, or IP..."
              className="pl-9 bg-background/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: "all", label: "All Events" },
              { id: "security", label: "Security" },
              { id: "auth", label: "Auth" },
              { id: "user", label: "Users" },
            ].map((f) => (
              <Button
                key={f.id}
                variant={filter === f.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter(f.id)}
                className="text-xs"
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border bg-background/40 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-45">Timestamp</TableHead>
                <TableHead className="w-50">Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-37.5">Actor</TableHead>
                <TableHead className="w-12.5 text-right">Meta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      Loading audit history...
                    </span>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No logs found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log._id} className="group hover:bg-muted/30">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {formatDate(log.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getIcon(log.category)}
                        <span className="font-medium text-sm">
                          {log.action}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground/80 max-w-75 truncate">
                      {log.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                          {log.actor?.name?.charAt(0) || "?"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium truncate max-w-25">
                            {log.actor?.name || "System"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {log.metadata?.ip || "Internal"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FileJson className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Log Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground block text-xs uppercase tracking-wider font-bold mb-1">
                                  Action
                                </span>
                                <Badge variant="outline">{log.action}</Badge>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-xs uppercase tracking-wider font-bold mb-1">
                                  Category
                                </span>
                                <Badge variant="secondary">
                                  {log.category}
                                </Badge>
                              </div>
                              <div className="col-span-2">
                                <span className="text-muted-foreground block text-xs uppercase tracking-wider font-bold mb-1">
                                  Description
                                </span>
                                <p className="p-3 bg-muted/50 rounded-md border text-sm">
                                  {log.description}
                                </p>
                              </div>
                            </div>
                            <div className="bg-black/90 p-4 rounded-lg border border-white/10 overflow-x-auto">
                              <pre className="text-xs font-mono text-green-400">
                                {JSON.stringify(log, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectLogsCard;
