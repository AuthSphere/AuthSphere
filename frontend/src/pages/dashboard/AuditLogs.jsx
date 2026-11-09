/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { AnimatePresence, motion as _motion } from "framer-motion";
import {
  Activity,
  Shield,
  Users,
  Key,
  PlusCircle,
  Trash2,
  RefreshCw,
  Globe,
  AlertTriangle,
  ChevronLeft,
  Loader2,
  Clock,
  MapPin,
  ShieldAlert,
  BarChart2,
  Search,
  X,
  ChevronDown,
  Download,
  Fingerprint,
  Monitor,
  Hash,
  Calendar,
  SlidersHorizontal,
  CheckCircle2,
  FileText,
  Eye,
  EyeOff,
  Cpu,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getGlobalLogs } from "@/api/AuditLogAPI";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TechSeparator from "@/components/common/TechSeparator";

/* ══════════════════════════════════════════════════════════════════
   CONSTANTS & CONFIG
   ══════════════════════════════════════════════════════════════════ */

const EVENT_META = {
  PROJECT_CREATED: {
    icon: PlusCircle,
    color: "#10b981",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  PROJECT_DELETED: {
    icon: Trash2,
    color: "#f43f5e",
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
  },
  API_KEY_ROTATED: {
    icon: Key,
    color: "#f59e0b",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
  },
  USER_REGISTERED: {
    icon: Users,
    color: "#3b82f6",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
  },
  SESSION_REVOKED: {
    icon: Shield,
    color: "#f43f5e",
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
  },
  OTHER_SESSIONS_REVOKED: {
    icon: RefreshCw,
    color: "#f43f5e",
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
  },
  ALL_SESSIONS_REVOKED: {
    icon: AlertTriangle,
    color: "#ef4444",
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
  },
};

const CATEGORY_STYLES = {
  project:
    "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400 font-mono",
  security:
    "bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:text-rose-400 font-mono",
  user: "bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400 font-mono",
  api: "bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400 font-mono",
};

const CATEGORY_CHART_COLORS = {
  project: "#10b981",
  security: "#f43f5e",
  user: "#3b82f6",
  api: "#f59e0b",
};

const ALL_CATEGORIES = ["project", "security", "user", "api"];

/* ══════════════════════════════════════════════════════════════════
   UTILITY HELPERS
   ══════════════════════════════════════════════════════════════════ */

const groupLabel = (dateStr) => {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMMM d, yyyy");
};

const groupByDate = (logs) => {
  const map = new Map();
  logs.forEach((log) => {
    const label = groupLabel(log.createdAt);
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(log);
  });
  return Array.from(map.entries());
};

const downloadJSON = (logs) => {
  const blob = new Blob([JSON.stringify(logs, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

/* ══════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════════════════════════ */

const LoadingScreen = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs">
    <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent animate-spin rounded-full" />
    <span className="text-neutral-500">QUERYING IMMUTABLE AUDIT LEDGER...</span>
  </div>
);

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#15161b] border border-neutral-200 dark:border-[#2a2b33] rounded-lg px-3 py-2 shadow-sm text-xs font-mono">
      <p className="font-semibold text-neutral-900 dark:text-white">
        {payload[0].payload.name}
      </p>
      <p className="text-neutral-500 mt-0.5">
        {payload[0].value} event{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

const EventIcon = ({ action, size = "md" }) => {
  const meta = EVENT_META[action];
  const Icon = meta?.icon ?? Activity;
  const s = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const ic = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <div
      className={`${s} rounded-lg border flex items-center justify-center shrink-0`}
      style={{
        backgroundColor: meta ? `${meta.color}14` : undefined,
        borderColor: meta ? `${meta.color}28` : undefined,
      }}
    >
      <Icon className={ic} style={{ color: meta?.color ?? "currentColor" }} />
    </div>
  );
};

const CategoryBadge = ({ category, className = "" }) => (
  <Badge
    variant="outline"
    className={`text-[9px] px-1.5 py-0 uppercase font-semibold tracking-wider ${CATEGORY_STYLES[category] ?? ""} ${className}`}
  >
    {category}
  </Badge>
);

const DateDivider = ({ label }) => (
  <div className="flex items-center gap-3 px-5 py-2 bg-neutral-50 dark:bg-[#14151a] border-y border-neutral-200 dark:border-[#222329] sticky top-0 z-10 font-mono">
    <Calendar className="h-3 w-3 text-neutral-400 shrink-0" />
    <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
      {label}
    </span>
  </div>
);

const LogRow = ({ log, onClick }) => (
  <_motion.div
    layout
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
    onClick={() => onClick(log)}
    className="flex items-start gap-3.5 px-5 py-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#14151a] transition-colors group border-b border-neutral-100 dark:border-[#1e2026] last:border-0"
  >
    <EventIcon action={log.action} />

    <div className="flex-1 min-w-0 space-y-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono font-semibold text-neutral-900 dark:text-white truncate">
            {log.action.replace(/_/g, " ")}
          </span>
          <CategoryBadge category={log.category} />
        </div>
        <div className="flex items-center gap-1 shrink-0 text-[10px] font-mono text-neutral-400">
          <Clock className="h-2.5 w-2.5" />
          <span>
            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate leading-snug">
        {log.description}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[10px] text-neutral-400 font-mono">
        <span className="flex items-center gap-1">
          <MapPin className="h-2.5 w-2.5" />
          {log.metadata?.ip ?? "127.0.0.1"}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" />
          {format(new Date(log.createdAt), "HH:mm:ss")}
        </span>
        {log.metadata?.details?.deviceInfo && (
          <span className="hidden md:flex items-center gap-1">
            <Monitor className="h-2.5 w-2.5" />
            {log.metadata.details.deviceInfo.os} /{" "}
            {log.metadata.details.deviceInfo.browser}
          </span>
        )}
        <span className="ml-auto text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors flex items-center gap-1">
          <Eye className="h-2.5 w-2.5" />
          <span className="hidden sm:inline">INSPECT →</span>
        </span>
      </div>
    </div>
  </_motion.div>
);

const EmptyState = ({ hasFilter, onClear }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center font-mono">
    <div className="h-10 w-10 rounded-lg bg-neutral-100 dark:bg-[#181920] border border-neutral-200 dark:border-[#2a2b33] flex items-center justify-center mb-3">
      {hasFilter ? (
        <Search className="h-4 w-4 text-neutral-400" />
      ) : (
        <Activity className="h-4 w-4 text-neutral-400" />
      )}
    </div>
    <p className="text-xs font-semibold text-neutral-900 dark:text-white mb-1">
      {hasFilter ? "No matching audit records" : "No audit events recorded"}
    </p>
    <p className="text-[11px] text-neutral-500 mb-4 max-w-xs leading-relaxed">
      {hasFilter
        ? "Try adjusting query parameters or category selection filters."
        : "Audit events will appear here as activity occurs in your projects."}
    </p>
    {hasFilter && (
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs font-mono rounded"
        onClick={onClear}
      >
        <X className="h-3 w-3 mr-1.5" />
        Reset Filters
      </Button>
    )}
  </div>
);

const SectionLabel = ({ children }) => (
  <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">
    {children}
  </p>
);

const MetaRow = ({ label, value, mono = false, copyable = false }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-0.5 font-mono text-xs">
      <p className="text-[9px] uppercase tracking-wider text-neutral-400">
        {label}
      </p>
      <div className="flex items-center gap-1.5 group/copy">
        <p
          className={`text-neutral-900 dark:text-white break-all leading-snug ${mono ? "font-mono text-[11px]" : "font-sans text-xs"}`}
        >
          {value ?? <span className="text-neutral-400 italic">—</span>}
        </p>
        {copyable && value && (
          <button
            onClick={copy}
            className="opacity-0 group-hover/copy:opacity-100 transition-opacity ml-1 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
          >
            {copied ? (
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            ) : (
              <Hash className="h-3 w-3" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const LogDetailDialog = ({ log, onClose }) => {
  const [showRaw, setShowRaw] = useState(false);

  if (!log) return null;

  const device = log.metadata?.details?.deviceInfo;
  const rawPayload = JSON.stringify(log.metadata?.details ?? {}, null, 2);

  return (
    <Dialog open={!!log} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[92vw]! max-w-3xl! max-h-[85vh]! p-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] shadow-xl">
        <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-200 dark:border-[#222329] bg-neutral-50/80 dark:bg-[#15161b]">
          <div className="flex items-center gap-3">
            <EventIcon action={log.action} size="sm" />
            <div>
              <DialogTitle className="text-xs font-mono font-bold tracking-tight text-neutral-900 dark:text-white">
                {log.action.replace(/_/g, " ")}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <CategoryBadge category={log.category} />
                <span className="text-[10px] text-neutral-400 font-mono">
                  ID: {log._id}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs font-mono gap-1.5 border-neutral-200 dark:border-[#2a2b33]"
            onClick={() => setShowRaw((v) => !v)}
          >
            {showRaw ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            {showRaw ? "FORMATTED" : "RAW JSON"}
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-70px)]">
          {showRaw ? (
            <div className="p-5 font-mono">
              <div className="rounded-lg border border-neutral-800 bg-[#07080a] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 text-[10px] text-neutral-400">
                  <span>PAYLOAD_RAW // SYNTAX_JSON</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(rawPayload);
                      toast.success("JSON copied to clipboard");
                    }}
                    className="text-emerald-400 hover:underline cursor-pointer"
                  >
                    COPY ALL
                  </button>
                </div>
                <pre className="p-4 text-[11px] font-mono leading-relaxed text-emerald-400 overflow-auto max-h-[50vh] whitespace-pre-wrap">
                  {rawPayload}
                </pre>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 dark:divide-[#222329]">
              <div className="p-6 space-y-5">
                <div>
                  <SectionLabel>EVENT DESCRIPTION</SectionLabel>
                  <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-mono">
                    {log.description}
                  </p>
                </div>

                <div>
                  <SectionLabel>TEMPORAL COORDINATES</SectionLabel>
                  <div className="space-y-3">
                    <MetaRow
                      label="Timestamp"
                      value={format(
                        new Date(log.createdAt),
                        "yyyy-MM-dd HH:mm:ss 'UTC'",
                      )}
                      mono
                    />
                    <MetaRow
                      label="Relative Velocity"
                      value={formatDistanceToNow(new Date(log.createdAt), {
                        addSuffix: true,
                      })}
                      mono
                    />
                  </div>
                </div>

                <div>
                  <SectionLabel>NETWORK INGRESS</SectionLabel>
                  <div className="space-y-3">
                    <MetaRow
                      label="IP Address"
                      value={log.metadata?.ip ?? "127.0.0.1"}
                      mono
                      copyable
                    />
                    <MetaRow
                      label="Project ID"
                      value={log.projectId ?? "SYSTEM_GLOBAL"}
                      mono
                      copyable
                    />
                    <MetaRow
                      label="Subject / Developer ID"
                      value={log.developerId ?? "ROOT"}
                      mono
                      copyable
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {device ? (
                  <div>
                    <SectionLabel>DEVICE FINGERPRINT</SectionLabel>
                    <div className="space-y-3">
                      <MetaRow label="Platform OS" value={device.os} mono />
                      <MetaRow
                        label="Client Browser"
                        value={device.browser}
                        mono
                      />
                      <MetaRow
                        label="Raw User-Agent"
                        value={device.ua}
                        mono
                        copyable
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <SectionLabel>DEVICE FINGERPRINT</SectionLabel>
                    <p className="text-[11px] text-neutral-400 font-mono italic">
                      No device information recorded.
                    </p>
                  </div>
                )}

                <div>
                  <SectionLabel>RECORD INTEGRITY</SectionLabel>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-neutral-50 dark:bg-[#15161b] border border-neutral-200 dark:border-[#222329] font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                    <Fingerprint className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Verified audit log entry.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ── Filter dropdown ── */
const FilterDropdown = ({ activeCategories, onChange }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1.5 text-xs font-mono border-border bg-card hover:bg-accent text-foreground"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>FILTER</span>
        {activeCategories.length < ALL_CATEGORIES.length && (
          <span className="ml-1 h-4 px-1 rounded bg-primary text-primary-foreground text-[9px] font-bold">
            {activeCategories.length}
          </span>
        )}
        <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="w-44 font-mono text-xs border-border bg-popover text-popover-foreground"
    >
      <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        CATEGORIES
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {ALL_CATEGORIES.map((cat) => (
        <DropdownMenuCheckboxItem
          key={cat}
          checked={activeCategories.includes(cat)}
          onCheckedChange={(checked) =>
            onChange(
              checked
                ? [...activeCategories, cat]
                : activeCategories.filter((c) => c !== cat),
            )
          }
          className="text-xs capitalize font-mono"
        >
          <span
            className="mr-2 h-2 w-2 rounded-full inline-block"
            style={{ backgroundColor: CATEGORY_CHART_COLORS[cat] }}
          />
          {cat}
        </DropdownMenuCheckboxItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        checked={activeCategories.length === ALL_CATEGORIES.length}
        onCheckedChange={(checked) => onChange(checked ? ALL_CATEGORIES : [])}
        className="text-xs font-mono"
      >
        ALL CATEGORIES
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════ */

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [activeCategories, setActiveCategories] = useState(ALL_CATEGORIES);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getGlobalLogs();
        if (res.success) setLogs(res.data);
      } catch {
        toast.error("Failed to fetch activity logs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredLogs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return logs.filter((log) => {
      const matchesSearch =
        !q ||
        log.description.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.metadata?.ip?.includes(q);
      const matchesCategory = activeCategories.includes(log.category);
      return matchesSearch && matchesCategory;
    });
  }, [logs, searchQuery, activeCategories]);

  const groupedLogs = useMemo(() => groupByDate(filteredLogs), [filteredLogs]);

  const stats = useMemo(
    () => ({
      total: logs.length,
      security: logs.filter((l) => l.category === "security").length,
      uniqueIps: new Set(logs.map((l) => l.metadata?.ip).filter(Boolean)).size,
      byCategory: ALL_CATEGORIES.map((cat) => ({
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: logs.filter((l) => l.category === cat).length,
        color: CATEGORY_CHART_COLORS[cat],
      })).filter((c) => c.value > 0),
    }),
    [logs],
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveCategories(ALL_CATEGORIES);
  }, []);

  const hasActiveFilter =
    searchQuery.length > 0 || activeCategories.length < ALL_CATEGORIES.length;

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-background text-foreground antialiased relative isolate selection:bg-primary selection:text-primary-foreground">
      {/* Precision Engineering Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-background">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/50 dark:to-black/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Engineering Eyebrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-2">
          <div className="flex items-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
            <Link
              to="/dashboard"
              className="hover:text-foreground inline-flex items-center gap-1.5"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>DASHBOARD</span>
            </Link>
            <TechSeparator />
            <span>GLOBAL AUDIT &amp; COMPLIANCE LEDGER</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>RFC-6962 IMMUTABLE TRAIL</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs font-mono border-border bg-card hover:bg-accent text-foreground gap-1.5"
              onClick={() => {
                downloadJSON(filteredLogs);
                toast.success("Audit ledger exported as JSON");
              }}
            >
              <Download className="h-3 w-3" />
              <span>EXPORT JSON</span>
            </Button>
          </div>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Audit Logs
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            Event ledger tracking security, administrative, and authentication
            activity across your projects.
          </p>
        </div>

        {/* 4 Precision Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
              01 // TOTAL EVENTS
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-foreground">
                {stats.total}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/80">
                ({filteredLogs.length} VISIBLE)
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
              02 // SECURITY ALERTS
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {stats.security}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/80">
                FLAGGED
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
              03 // UNIQUE INGRESS IPS
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-foreground">
                {stats.uniqueIps}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/80">
                ORIGINS
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
              04 // LEDGER INTEGRITY
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                99.999%
              </span>
              <span className="text-[10px] font-mono text-emerald-500">
                VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Category Distribution & Origin Analytics */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
              <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground">
                  EVENT DISTRIBUTION
                </span>
                <span className="text-muted-foreground text-[10px]">
                  CATEGORY SHARE
                </span>
              </div>
              <div className="p-5">
                {stats.byCategory.length > 0 ? (
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.byCategory}
                        layout="vertical"
                        margin={{ left: -24, right: 8, top: 4, bottom: 4 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 10,
                            fontFamily: "monospace",
                            fill: "currentColor",
                          }}
                          width={68}
                        />
                        <RechartsTooltip
                          cursor={{ fill: "rgba(0,0,0,0.05)" }}
                          content={<ChartTooltip />}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                          {stats.byCategory.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center font-mono text-xs text-muted-foreground">
                    NO CATEGORY DATA
                  </div>
                )}
              </div>
            </div>

            {/* Top Origins IP Box */}
            {stats.uniqueIps > 0 && (
              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
                <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-foreground">
                    TOP ORIGIN IPS
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    GEO_IP
                  </span>
                </div>
                <div className="p-5 space-y-2.5 font-mono text-xs">
                  {Array.from(
                    logs.reduce((acc, l) => {
                      const ip = l.metadata?.ip ?? "127.0.0.1";
                      acc.set(ip, (acc.get(ip) ?? 0) + 1);
                      return acc;
                    }, new Map()),
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([ip, count]) => (
                      <div
                        key={ip}
                        className="flex items-center justify-between gap-3 text-xs"
                      >
                        <span className="text-foreground truncate">{ip}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="h-1 w-16 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${(count / logs.length) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-muted-foreground text-[10px] w-4 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Activity Stream */}
          <div className="lg:col-span-8 space-y-4">
            {/* Search and Filter Command Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filter events by description, action, or IP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs font-mono bg-background border-input rounded-md focus:border-ring text-foreground"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <FilterDropdown
                activeCategories={activeCategories}
                onChange={setActiveCategories}
              />
            </div>

            {/* Stream Shell */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
              <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-bold text-foreground">
                    CHRONOLOGICAL ACTIVITY STREAM
                  </span>
                </div>
                <span className="text-muted-foreground text-[11px]">
                  {filteredLogs.length} RECORD
                  {filteredLogs.length !== 1 ? "S" : ""}
                </span>
              </div>

              <div className="divide-y divide-border max-h-160 overflow-y-auto">
                {filteredLogs.length === 0 ? (
                  <EmptyState
                    hasFilter={hasActiveFilter}
                    onClear={clearFilters}
                  />
                ) : (
                  <AnimatePresence mode="popLayout">
                    {groupedLogs.map(([label, group]) => (
                      <React.Fragment key={label}>
                        <DateDivider label={label} />
                        {group.map((log) => (
                          <LogRow
                            key={log._id}
                            log={log}
                            onClick={setSelectedLog}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <LogDetailDialog log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
};

export default AuditLogs;
