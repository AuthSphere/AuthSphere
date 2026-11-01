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
  Filter,
  X,
  ChevronDown,
  Download,
  Info,
  Fingerprint,
  Monitor,
  Cpu,
  Hash,
  Calendar,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  FileText,
  Eye,
  EyeOff,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  security:
    "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
  user: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  api: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
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

/** Human-friendly relative date grouping label */
const groupLabel = (dateStr) => {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMMM d, yyyy");
};

/** Group an array of logs by their date label */
const groupByDate = (logs) => {
  const map = new Map();
  logs.forEach((log) => {
    const label = groupLabel(log.createdAt);
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(log);
  });
  return Array.from(map.entries()); // [[label, [logs]], ...]
};

/** Download logs as a .json file */
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

/* ── Loading screen ── */
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3">
    <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
    </div>
    <p className="text-xs text-muted-foreground font-medium">
      Loading audit logs…
    </p>
  </div>
);

/* ── Stat card ── */
const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <Card className="bg-card/50 border-border/50 hover:bg-card/70 transition-colors">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`h-8 w-8 rounded-lg bg-muted flex items-center justify-center ${color}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-semibold tabular-nums tracking-tight mb-0.5">
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      {sub && (
        <p className="text-[10px] text-muted-foreground/50 mt-1 font-mono">
          {sub}
        </p>
      )}
    </CardContent>
  </Card>
);

/* ── Custom recharts tooltip ── */
const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-foreground">{payload[0].payload.name}</p>
      <p className="text-muted-foreground mt-0.5">
        {payload[0].value} event{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

/* ── Event icon box ── */
const EventIcon = ({ action, size = "md" }) => {
  const meta = EVENT_META[action];
  const Icon = meta?.icon ?? Activity;
  const s = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const ic = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
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

/* ── Category badge ── */
const CategoryBadge = ({ category, className = "" }) => (
  <Badge
    variant="outline"
    className={`text-[9px] px-1.5 py-0 uppercase font-semibold tracking-wider border-none ${CATEGORY_STYLES[category] ?? ""} ${className}`}
  >
    {category}
  </Badge>
);

/* ── Date group divider ── */
const DateDivider = ({ label }) => (
  <div className="flex items-center gap-3 px-5 py-2.5 bg-muted/20 border-y border-border/30 sticky top-0 z-10">
    <Calendar className="h-3 w-3 text-muted-foreground/50 shrink-0" />
    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">
      {label}
    </span>
  </div>
);

/* ── Single log row ── */
const LogRow = ({ log, onClick }) => (
  <_motion.div
    layout
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.18 }}
    onClick={() => onClick(log)}
    className="flex items-start gap-3.5 px-5 py-3.5 cursor-pointer hover:bg-muted/30 transition-colors group border-b border-border/30 last:border-0"
  >
    <EventIcon action={log.action} />

    {/* Main content */}
    <div className="flex-1 min-w-0 space-y-1">
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[13px] font-medium text-foreground truncate leading-none">
            {log.action.replace(/_/g, " ")}
          </span>
          <CategoryBadge category={log.category} />
        </div>
        <div className="flex items-center gap-1 shrink-0 text-[10px] text-muted-foreground/60">
          <Clock className="h-3 w-3" />
          <span>
            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] text-muted-foreground truncate leading-snug">
        {log.description}
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[10px] text-muted-foreground/50 font-mono">
        <span className="flex items-center gap-1">
          <MapPin className="h-2.5 w-2.5" />
          {log.metadata?.ip ?? "local"}
        </span>
        <span className="flex items-center gap-1 sm:flex">
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
        {/* Clickable hint */}
        <span className="ml-auto text-primary/40 group-hover:text-primary/70 transition-colors flex items-center gap-0.5">
          <Eye className="h-2.5 w-2.5" />
          <span className="hidden sm:inline">View details</span>
        </span>
      </div>
    </div>
  </_motion.div>
);

/* ── Empty state ── */
const EmptyState = ({ hasFilter, onClear }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="h-12 w-12 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
      {hasFilter ? (
        <Search className="h-5 w-5 text-muted-foreground/40" />
      ) : (
        <Activity className="h-5 w-5 text-muted-foreground/40" />
      )}
    </div>
    <p className="text-sm font-medium text-foreground mb-1">
      {hasFilter ? "No matching events" : "No events yet"}
    </p>
    <p className="text-[12px] text-muted-foreground mb-4 max-w-xs leading-relaxed">
      {hasFilter
        ? "Try adjusting your search query or category filters."
        : "Audit events will appear here once your system starts generating them."}
    </p>
    {hasFilter && (
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs rounded-full"
        onClick={onClear}
      >
        <X className="h-3 w-3 mr-1.5" />
        Clear filters
      </Button>
    )}
  </div>
);

/* ── Detail section label ── */
const SectionLabel = ({ children }) => (
  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground/50 mb-3">
    {children}
  </p>
);

/* ── Metadata key/value pair ── */
const MetaRow = ({ label, value, mono = false, copyable = false }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-0.5">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/50">
        {label}
      </p>
      <div className="flex items-center gap-1.5 group/copy">
        <p
          className={`text-[12px] text-foreground break-all leading-snug ${mono ? "font-mono" : "font-medium"}`}
        >
          {value ?? <span className="text-muted-foreground/40 italic">—</span>}
        </p>
        {copyable && value && (
          <button
            onClick={copy}
            className="opacity-0 group-hover/copy:opacity-100 transition-opacity ml-1 text-muted-foreground/40 hover:text-primary"
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

/* ── Detail dialog ── */
const LogDetailDialog = ({ log, onClose }) => {
  const [showRaw, setShowRaw] = useState(false);

  if (!log) return null;

  const device = log.metadata?.details?.deviceInfo;
  const rawPayload = JSON.stringify(log.metadata?.details ?? {}, null, 2);

  return (
    <Dialog open={!!log} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[92vw]! max-w-3xl! max-h-[85vh]! p-0 overflow-hidden rounded-2xl border border-border/70 bg-background shadow-2xl">
        {/* Dialog top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
            <EventIcon action={log.action} size="sm" />
            <div>
              <DialogTitle className="text-sm font-semibold tracking-tight leading-none">
                {log.action.replace(/_/g, " ")}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <CategoryBadge category={log.category} />
                <span className="text-[10px] text-muted-foreground/50 font-mono">
                  {log._id?.slice(-8)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[11px] gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => setShowRaw((v) => !v)}
            >
              {showRaw ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              {showRaw ? "Formatted" : "Raw JSON"}
            </Button>
          </div>
        </div>

        {/* Dialog body */}
        <div className="overflow-y-auto max-h-[calc(85vh-70px)]">
          {showRaw ? (
            /* ── Raw JSON view ── */
            <div className="p-5">
              <div className="rounded-xl border border-border/50 bg-[#0a0a0a] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-white/30" />
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                      raw payload
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(rawPayload);
                      toast.success("Copied");
                    }}
                    className="text-[10px] font-mono text-primary/60 hover:text-primary transition-colors"
                  >
                    copy
                  </button>
                </div>
                <pre className="p-4 text-[11px] font-mono leading-relaxed text-green-400 overflow-auto max-h-[55vh] whitespace-pre-wrap wrap-break-word">
                  {rawPayload}
                </pre>
              </div>
            </div>
          ) : (
            /* ── Formatted view ── */
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
              {/* Column 1 — Event details */}
              <div className="p-6 space-y-5">
                {/* Description */}
                <div>
                  <SectionLabel>Description</SectionLabel>
                  <p className="text-[13px] text-foreground/80 leading-relaxed">
                    {log.description}
                  </p>
                </div>

                {/* Timing */}
                <div>
                  <SectionLabel>Timing</SectionLabel>
                  <div className="space-y-3">
                    <MetaRow
                      label="Timestamp"
                      value={format(
                        new Date(log.createdAt),
                        "MMM dd, yyyy · HH:mm:ss 'UTC'",
                      )}
                    />
                    <MetaRow
                      label="Relative"
                      value={formatDistanceToNow(new Date(log.createdAt), {
                        addSuffix: true,
                      })}
                    />
                  </div>
                </div>

                {/* Origin */}
                <div>
                  <SectionLabel>Origin</SectionLabel>
                  <div className="space-y-3">
                    <MetaRow
                      label="IP Address"
                      value={log.metadata?.ip ?? "Local"}
                      mono
                      copyable
                    />
                    <MetaRow
                      label="Project"
                      value={log.projectId ?? "System"}
                      mono
                      copyable
                    />
                    <MetaRow
                      label="Developer ID"
                      value={log.developerId ?? "Unknown"}
                      mono
                      copyable
                    />
                  </div>
                </div>
              </div>

              {/* Column 2 — Device & payload */}
              <div className="p-6 space-y-5">
                {/* Device */}
                {device ? (
                  <div>
                    <SectionLabel>Device</SectionLabel>
                    <div className="space-y-3">
                      <MetaRow label="OS" value={device.os} />
                      <MetaRow label="Browser" value={device.browser} />
                      <MetaRow label="User Agent" value={device.ua} mono />
                    </div>
                  </div>
                ) : (
                  <div>
                    <SectionLabel>Device</SectionLabel>
                    <div className="flex items-center gap-2 py-3 px-3 rounded-lg bg-muted/30 border border-border/40">
                      <Monitor className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                      <p className="text-[11px] text-muted-foreground/50 italic">
                        No device information captured
                      </p>
                    </div>
                  </div>
                )}

                {/* Extra metadata fields */}
                {log.metadata?.details &&
                  Object.keys(log.metadata.details).length > 0 && (
                    <div>
                      <SectionLabel>Additional Details</SectionLabel>
                      <div className="space-y-3">
                        {Object.entries(log.metadata.details)
                          .filter(([k]) => k !== "deviceInfo")
                          .slice(0, 6)
                          .map(([k, v]) => (
                            <MetaRow
                              key={k}
                              label={k.replace(/([A-Z])/g, " $1").trim()}
                              value={
                                typeof v === "object"
                                  ? JSON.stringify(v)
                                  : String(v)
                              }
                              mono
                              copyable
                            />
                          ))}
                      </div>
                    </div>
                  )}

                {/* Full event ID */}
                <div>
                  <SectionLabel>Event ID</SectionLabel>
                  <MetaRow label="Log ID" value={log._id} mono copyable />
                </div>

                {/* Security status */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10">
                  <Fingerprint className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                  <p className="text-[11px] text-muted-foreground">
                    Immutable · Cryptographically signed
                  </p>
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
        className="h-9 gap-1.5 text-[12px] rounded-lg border-border/60"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filter
        {activeCategories.length < ALL_CATEGORIES.length && (
          <span className="ml-0.5 h-4 min-w-[16px] px-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
            {activeCategories.length}
          </span>
        )}
        <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-44 rounded-xl">
      <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold">
        Categories
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
          className="text-[12px] capitalize"
        >
          <span
            className={`mr-2 h-2 w-2 rounded-full inline-block`}
            style={{ backgroundColor: CATEGORY_CHART_COLORS[cat] }}
          />
          {cat}
        </DropdownMenuCheckboxItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        checked={activeCategories.length === ALL_CATEGORIES.length}
        onCheckedChange={(checked) => onChange(checked ? ALL_CATEGORIES : [])}
        className="text-[12px]"
      >
        All categories
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

  /* ── Fetch ── */
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

  /* ── Filtered logs ── */
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

  /* ── Grouped logs ── */
  const groupedLogs = useMemo(() => groupByDate(filteredLogs), [filteredLogs]);

  /* ── Stats ── */
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

  /* ── Handlers ── */
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveCategories(ALL_CATEGORIES);
  }, []);

  const hasActiveFilter =
    searchQuery.length > 0 || activeCategories.length < ALL_CATEGORIES.length;

  /* ── Loading ── */
  if (loading) return <LoadingScreen />;

  /* ══════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════ */
  return (
    <div className="h-[93vh] w-[90vw] mx-auto py-6 pt-0 flex flex-col overflow-hidden">
      {/* ────────────────────────────────────────────────────────
          PAGE HEADER
         ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border/50 shrink-0">
        <div className="space-y-1">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="group -ml-2 h-7 text-muted-foreground hover:text-foreground text-xs gap-1"
          >
            <ChevronLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </Button>

          <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
          <p className="text-[12px] text-muted-foreground">
            Security monitoring and event tracking across all your projects.
          </p>
        </div>

        {/* Header right */}
        <div className="flex items-center gap-2 pb-0.5">
          {/* Live badge */}
          <Badge
            variant="outline"
            className="rounded-full border-primary/20 bg-primary/5 text-primary
                       text-[9px] font-bold tracking-[0.14em] uppercase px-3 py-0.5 gap-1.5"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Live
          </Badge>

          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-[12px] rounded-full border-border/60 hidden sm:flex"
            onClick={() => {
              downloadJSON(filteredLogs);
              toast.success("Logs exported as JSON");
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          STATS ROW
         ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-4 shrink-0">
        <StatCard
          label="Total Events"
          value={stats.total}
          icon={Activity}
          color="text-primary"
          sub={`${filteredLogs.length} visible`}
        />
        <StatCard
          label="Security Alerts"
          value={stats.security}
          icon={ShieldAlert}
          color="text-rose-500"
          sub={stats.security > 0 ? "Requires review" : "All clear"}
        />
        <StatCard
          label="Unique IPs"
          value={stats.uniqueIps}
          icon={Globe}
          color="text-blue-500"
          sub="Distinct origins"
        />
        <StatCard
          label="Uptime"
          value="99.9%"
          icon={Clock}
          color="text-emerald-500"
          sub="30-day average"
        />
      </div>

      {/* ────────────────────────────────────────────────────────
          MAIN TWO-COLUMN LAYOUT
         ──────────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* ── LEFT SIDEBAR ── */}
        <div className="lg:col-span-4 flex flex-col gap-4 min-h-0 overflow-y-auto">
          {/* Event Distribution Chart */}
          <Card className="bg-card/30 border-border/50 shrink-0">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-[13px] font-semibold flex items-center gap-2">
                <BarChart2 className="h-3.5 w-3.5 text-primary" />
                Event Distribution
              </CardTitle>
              <CardDescription className="text-[11px]">
                Volume by category
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              {stats.byCategory.length > 0 ? (
                <div className="h-[130px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.byCategory}
                      layout="vertical"
                      margin={{ left: -28, right: 8, top: 4, bottom: 4 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11,
                          fontWeight: 500,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        width={68}
                      />
                      <RechartsTooltip
                        cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                        content={<ChartTooltip />}
                      />
                      <Bar dataKey="value" radius={[0, 5, 5, 0]} barSize={16}>
                        {stats.byCategory.map((entry, i) => (
                          <Cell key={i} fill={entry.color} fillOpacity={0.75} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[130px] flex items-center justify-center">
                  <p className="text-[11px] text-muted-foreground/50 italic">
                    No data
                  </p>
                </div>
              )}

              {/* Category legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 border-t border-border/40">
                {ALL_CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center gap-1.5">
                    <div
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_CHART_COLORS[cat] }}
                    />
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {cat}
                    </span>
                    <span className="text-[10px] text-muted-foreground/40 font-mono">
                      {logs.filter((l) => l.category === cat).length}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top IPs */}
          {stats.uniqueIps > 0 && (
            <Card className="bg-card/30 border-border/50 shrink-0">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-[13px] font-semibold flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-blue-500" />
                  Top Origins
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Most active IP addresses
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="space-y-2">
                  {Array.from(
                    logs.reduce((acc, l) => {
                      const ip = l.metadata?.ip ?? "local";
                      acc.set(ip, (acc.get(ip) ?? 0) + 1);
                      return acc;
                    }, new Map()),
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([ip, count]) => (
                      <div
                        key={ip}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="text-[11px] font-mono text-foreground/70 truncate">
                          {ip}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="h-1 w-16 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500/60 rounded-full"
                              style={{
                                width: `${(count / logs.length) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground/60 w-4 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security info card */}
          <Card className="bg-primary/4 border-primary/10 shrink-0">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="h-3.5 w-3.5" />
                <h4 className="text-[13px] font-semibold">Security Info</h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Audit logs are immutable and cryptographically signed. They
                provide a forensic trail of all administrative actions across
                your environment.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="text-[9px] border-primary/20 text-primary font-mono rounded-full"
                >
                  AES-256 Encrypted
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[9px] border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono rounded-full"
                >
                  GDPR Compliant
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT: ACTIVITY STREAM ── */}
        <div className="lg:col-span-8 flex flex-col min-h-0">
          {/* Search + filter bar */}
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
              <Input
                placeholder="Search events, actions, IPs…"
                className="pl-9 h-9 text-[12px] bg-muted/30 border-border/50 rounded-lg focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground"
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

          {/* Active filter chips */}
          {hasActiveFilter && (
            <div className="flex flex-wrap items-center gap-1.5 mb-3 shrink-0">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-primary/8 border border-primary/15 text-[10px] text-primary font-medium">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery("")}>
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              )}
              {activeCategories.length < ALL_CATEGORIES.length &&
                activeCategories.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 h-5 px-2 rounded-full border text-[10px] font-medium"
                    style={{
                      backgroundColor: `${CATEGORY_CHART_COLORS[c]}12`,
                      borderColor: `${CATEGORY_CHART_COLORS[c]}28`,
                      color: CATEGORY_CHART_COLORS[c],
                    }}
                  >
                    {c}
                    <button
                      onClick={() =>
                        setActiveCategories((p) => p.filter((x) => x !== c))
                      }
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              <button
                onClick={clearFilters}
                className="text-[10px] text-muted-foreground/50 hover:text-muted-foreground underline-offset-2 hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Stream card */}
          <Card className="bg-card/30 border-border/50 flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 shrink-0">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span className="text-[13px] font-semibold">
                  Activity Stream
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilter && (
                  <span className="text-[10px] text-muted-foreground/50 font-mono">
                    {filteredLogs.length} / {logs.length}
                  </span>
                )}
                <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                  {filteredLogs.length} event
                  {filteredLogs.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Scrollable log list */}
            <div className="flex-1 min-h-0 overflow-y-auto">
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
          </Card>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          DETAIL DIALOG
         ──────────────────────────────────────────────────────── */}
      <LogDetailDialog log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
};

export default AuditLogs;
