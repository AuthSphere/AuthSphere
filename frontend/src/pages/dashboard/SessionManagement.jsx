import React from "react";
import { useSessions } from "@/hooks/useSessions";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  MapPin,
  LogOut,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Key,
  Activity,
  Loader2,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import TechSeparator from "@/components/common/TechSeparator";

const DeviceIcon = ({ device }) => {
  const d = device?.toLowerCase() || "";
  if (d.includes("mobile") || d.includes("phone"))
    return <Smartphone className="h-4 w-4" />;
  if (d.includes("tablet")) return <Tablet className="h-4 w-4" />;
  return <Monitor className="h-4 w-4" />;
};

const SessionCard = ({ session, onRevoke }) => (
  <div
    className={`rounded-xl border bg-white dark:bg-[#121316] overflow-hidden shadow-xs transition-all ${
      session.current
        ? "border-neutral-900 dark:border-white ring-1 ring-neutral-900/10 dark:ring-white/20"
        : "border-neutral-200 dark:border-[#222329]"
    }`}
  >
    {/* Card Header Bar */}
    <div
      className={`px-5 py-2.5 border-b text-xs font-mono flex items-center justify-between ${
        session.current
          ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
          : "bg-neutral-50/80 dark:bg-[#15161b] text-neutral-500 border-neutral-200 dark:border-[#222329]"
      }`}
    >
      <div className="flex items-center gap-2">
        <DeviceIcon device={session.deviceInfo?.device} />
        <span className="font-semibold uppercase tracking-wider">
          {session.deviceInfo?.os || "UNKNOWN OS"} //{" "}
          {session.deviceInfo?.browser || "BROWSER"}
        </span>
      </div>
      {session.current ? (
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          CURRENT ENCLAVE
        </span>
      ) : (
        <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
          ID: {session._id?.slice(-8) || "SESSION"}
        </span>
      )}
    </div>

    {/* Body Details */}
    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-neutral-400" />
            <span>
              {session.location?.city || "Unknown Location"},{" "}
              {session.location?.country || "Earth"}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-neutral-400" />
            <span className="text-neutral-900 dark:text-neutral-200 font-semibold">
              {session.ipAddress}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>
              Minted: {new Date(session.createdAt).toLocaleDateString()}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Activity className="h-3 w-3 text-emerald-500" />
            <span>
              Last activity: {formatDistanceToNow(new Date(session.lastActive))}{" "}
              ago
            </span>
          </span>
        </div>
      </div>

      {!session.current && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 font-mono text-xs border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 self-start md:self-auto cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              <span>REVOKE SESSION</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316]">
            <AlertDialogHeader>
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <AlertDialogTitle className="text-center font-bold text-base">
                Revoke Session Token?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-xs text-neutral-600 dark:text-neutral-400">
                This action will immediately terminate the cryptographic session
                enclave on this remote hardware. The client will be signed out
                instantly.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-mono text-xs">
                CANCEL
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onRevoke(session._id)}
                className="font-mono text-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                REVOKE SESSION
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  </div>
);

const SessionManagement = () => {
  const { sessions, isLoading, revokeSession, revokeOthers, revokeAll } =
    useSessions();
  const navigate = useNavigate();

  const handleRevokeAll = async () => {
    revokeAll();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
        <span className="text-neutral-500">
          QUERYING ACTIVE SESSION ENCLAVES...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f9] dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 antialiased relative isolate selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Precision Engineering Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#fbf9f9] dark:bg-[#09090c]">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/50 dark:to-black/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Engineering Eyebrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 dark:border-[#222329] pb-3 gap-2">
          <div className="flex items-center text-xs font-mono text-neutral-500 uppercase tracking-widest">
            <Link
              to="/settings"
              className="hover:text-black dark:hover:text-white inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>SETTINGS</span>
            </Link>
            <TechSeparator />
            <span>SESSION RUNTIME MATRIX</span>
          </div>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>EDGESYNC ACTIVE</span>
          </div>
        </div>

        {/* Page Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Cryptographic Session Matrix
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Active identity tokens and hardware-fingerprinted enclaves across
              all devices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 font-mono text-xs border-neutral-200 dark:border-[#2a2b33]"
                >
                  REVOKE OTHER SESSIONS
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-bold text-base text-center">
                    Revoke Other Device Sessions?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
                    This will invalidate all refresh tokens on all devices
                    except your current session.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="font-mono text-xs">
                    CANCEL
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={revokeOthers}
                    className="font-mono text-xs bg-black dark:bg-white text-white dark:text-black"
                  >
                    CONFIRM REVOKE
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="h-8 font-mono text-xs gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>REVOKE ALL</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-bold text-base text-center text-rose-600">
                    Emergency Revoke All Sessions?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
                    Warning: This will terminate ALL sessions including this
                    one. You will be redirected to sign in immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="font-mono text-xs">
                    CANCEL
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRevokeAll}
                    className="font-mono text-xs bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    TERMINATE ALL
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Telemetry Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] p-5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              01 // ACTIVE CONCURRENT SESSIONS
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
                {sessions.length}
              </span>
              <span className="text-xs font-mono text-neutral-500">
                DEVICES
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] p-5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              02 // ENCLAVE ENCRYPTION
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-neutral-900 dark:text-white">
                AES-256-GCM
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] p-5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              03 // SESSION TIMEOUT POLICY
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
                7
              </span>
              <span className="text-xs font-mono text-neutral-500">
                DAYS SLIDING
              </span>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pb-1">
            <span>REGISTERED DEVICE ENCLAVES ({sessions.length})</span>
            <span>TOKEN SPEC: RFC-7519</span>
          </div>

          <div className="space-y-3">
            {sessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                onRevoke={revokeSession}
              />
            ))}
          </div>
        </div>

        {/* Security Education Footer Panel */}
        <div className="rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-900 dark:text-white">
            <Cpu className="h-4 w-4 text-emerald-500" />
            <span>CRYPTOGRAPHIC TERMINATION SPECIFICATION</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono">
            AuthSphere maintains a low-latency distributed token revocation
            ledger. When a session is revoked, its unique JTI (JWT ID) is
            immediately blacklisted in Redis with sub-millisecond edge
            synchronization, guaranteeing that downstream API services reject
            revoked tokens on their very next request.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;
