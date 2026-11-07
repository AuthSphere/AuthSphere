import React, { useState, useEffect } from "react";
import { getProjectLogs } from "@/api/AuditLogAPI";
import { format } from "date-fns";
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
  FileJson,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TechSeparator from "@/components/common/TechSeparator";

const ProjectLogsCard = ({ projectId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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
        return <ShieldAlert className="h-3.5 w-3.5 text-red-500" />;
      case "auth":
        return <Lock className="h-3.5 w-3.5 text-emerald-500" />;
      case "user":
        return <User className="h-3.5 w-3.5 text-blue-500" />;
      case "project":
        return <Activity className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <Zap className="h-3.5 w-3.5 text-neutral-400" />;
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
    <div className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] rounded-xl shadow-xs overflow-hidden font-mono text-xs">
      {/* ─── CARD HEADER BAR ─── */}
      <div className="px-5 py-3.5 border-b border-[#eaeaea] dark:border-[#222329] flex items-center justify-between bg-neutral-50/70 dark:bg-[#14151a]">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-500" />
          <span className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
            IMMUTABLE AUDIT RECORD ({filteredLogs.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-500">SPEC: RFC-5424</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchLogs}
            disabled={loading}
            className="h-7 w-7 p-0 cursor-pointer text-neutral-500 hover:text-black dark:hover:text-white"
            title="Refresh stream"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* ─── TOOLBAR & SEARCH ─── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <Input
              placeholder="Filter by action, user actor, or IP address..."
              className="pl-9 h-9 text-xs font-mono border-[#eaeaea] dark:border-[#26262b] bg-neutral-50/60 dark:bg-[#16171e]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1">
            {[
              { id: "all", label: "ALL" },
              { id: "security", label: "SECURITY" },
              { id: "auth", label: "AUTH" },
              { id: "user", label: "USERS" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                  filter === f.id
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-[#181920]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── TABLE RECORD ─── */}
        <div className="rounded-lg border border-[#eaeaea] dark:border-[#26262b] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#eaeaea] dark:border-[#26262b] text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-50/60 dark:bg-[#14151a]">
                <TableHead className="w-40 font-semibold uppercase">
                  Timestamp
                </TableHead>
                <TableHead className="w-48 font-semibold uppercase">
                  Action
                </TableHead>
                <TableHead className="font-semibold uppercase">
                  Description
                </TableHead>
                <TableHead className="w-36 font-semibold uppercase">
                  Actor
                </TableHead>
                <TableHead className="w-16 font-semibold uppercase text-right">
                  Meta
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#eaeaea] dark:divide-[#26262b]">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-28 text-center text-neutral-500"
                  >
                    <div className="w-5 h-5 border-2 border-neutral-300 border-t-black dark:border-t-white rounded-full animate-spin mx-auto mb-2" />
                    <span>Streaming audit history...</span>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-neutral-500 text-xs"
                  >
                    No audit records matching specified filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow
                    key={log._id}
                    className="hover:bg-neutral-50/60 dark:hover:bg-[#16171d] transition-colors"
                  >
                    <TableCell className="text-neutral-500 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-neutral-400" />
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getIcon(log.category)}
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {log.action}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-neutral-600 dark:text-neutral-300">
                      {log.description}
                    </TableCell>

                    <TableCell className="text-neutral-500 text-[11px]">
                      {log.actor?.name || log.actor?.email || "System Daemon"}
                    </TableCell>

                    <TableCell className="text-right">
                      {log.metadata && Object.keys(log.metadata).length > 0 ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 cursor-pointer hover:bg-neutral-200 dark:hover:bg-[#22242c]"
                              title="Inspect Payload"
                            >
                              <FileJson className="h-3.5 w-3.5 text-neutral-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg font-mono text-xs border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#0c0d10]">
                            <DialogHeader>
                              <DialogTitle className="text-sm font-bold text-neutral-900 dark:text-white">
                                Event Telemetry Payload
                              </DialogTitle>
                            </DialogHeader>
                            <pre className="bg-[#0a0b0e] p-4 rounded-lg text-emerald-400 text-xs overflow-auto max-h-80 border border-[#22242c]">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <span className="text-[10px] text-neutral-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProjectLogsCard;
