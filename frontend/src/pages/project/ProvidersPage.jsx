import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  ShieldCheck,
  Save,
  Loader2,
  Globe,
  Info,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getProject,
  updateProject,
  getConfiguredProviders,
} from "@/api/ProjectAPI";
import { allProvidersList } from "@/lib/providers";
import TechSeparator from "@/components/common/TechSeparator";

const ProviderCard = ({
  p,
  isSelected,
  isConfigured,
  backendMessage,
  onToggle,
  onViewDocs,
  isUpcoming,
  index,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (isUpcoming) return;
    if (!isConfigured && !isSelected) {
      toast.error(`${p.name} - Configuration Required`, {
        description:
          backendMessage || "Please add keys to your backend .env file.",
      });
      return;
    }
    onToggle(p.id);
  };

  return (
    <div
      role="button"
      tabIndex={isUpcoming ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      onClick={handleClick}
      className={`group relative flex flex-col items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white ${
        isSelected
          ? "border-black dark:border-white bg-white dark:bg-[#15161c] shadow-sm ring-1 ring-black/10 dark:ring-white/20"
          : isUpcoming
            ? "border-neutral-200/50 dark:border-[#1d1e24] bg-neutral-50/50 dark:bg-[#0f1013] opacity-40 cursor-not-allowed"
            : "border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs"
      }`}
    >
      {/* Port Index */}
      <div className="w-full flex items-center justify-between text-[9px] font-mono text-neutral-400 mb-2">
        <span>PORT_{String(index + 1).padStart(2, "0")}</span>
        {isSelected ? (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        ) : isConfigured ? (
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        ) : null}
      </div>

      {/* Logo Container */}
      <div className="h-10 w-10 my-1 rounded-lg bg-white dark:bg-[#181920] border border-neutral-200 dark:border-[#2a2b33] flex items-center justify-center p-2 shadow-xs shrink-0">
        {!imageError && p.logo ? (
          <img
            src={p.logo}
            alt=""
            className="h-full w-full object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-[11px] font-bold font-mono text-neutral-500">
            {p.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Name and State Tag */}
      <div className="text-center min-w-0 w-full mt-2 space-y-1">
        <p className="text-xs font-semibold font-mono text-neutral-900 dark:text-white truncate">
          {p.name}
        </p>
        <div className="flex items-center justify-center min-h-[14px]">
          {isSelected ? (
            <span className="text-[9px] font-bold font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              ACTIVE
            </span>
          ) : !isUpcoming && !isConfigured ? (
            <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 uppercase tracking-widest">
              SETUP REQ
            </span>
          ) : (
            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
              {isUpcoming ? "ROADMAP" : "AVAILABLE"}
            </span>
          )}
        </div>
      </div>

      {/* Info Icon Button */}
      {!isUpcoming && (
        <button
          className="absolute top-1.5 right-1.5 p-1 text-neutral-400 hover:text-black dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onViewDocs(p);
          }}
        >
          <Info className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

const ProvidersPage = ({ embedded = false, onBack, onUpdated }) => {
  const { projectId: routeProjectId } = useParams();
  const projectId = routeProjectId;
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProviders, setSelectedProviders] = useState({});
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [backendConfig, setBackendConfig] = useState({});

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProject(projectId);
        if (res.success) {
          setProject(res.data);
          const providerMap = {};
          res.data.providers?.forEach((p) => {
            providerMap[p] = true;
          });
          setSelectedProviders(providerMap);
        }

        const configRes = await getConfiguredProviders(projectId);
        if (configRes.success) {
          setBackendConfig(configRes.data);
        }
      } catch {
        toast.error("Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const filteredProviders = useMemo(() => {
    return allProvidersList.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const activeProviders = filteredProviders.filter(
    (p) => p.status !== "coming_soon" && backendConfig[p.id]?.isConfigured,
  );
  const setupProviders = filteredProviders.filter(
    (p) => p.status !== "coming_soon" && !backendConfig[p.id]?.isConfigured,
  );
  const upcomingProviders = filteredProviders.filter(
    (p) => p.status === "coming_soon",
  );

  const toggleProvider = (id) => {
    const provider = allProvidersList.find((p) => p.id === id);
    if (provider?.status === "coming_soon") return;
    setSelectedProviders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const activeKeys = Object.keys(selectedProviders).filter(
        (p) => selectedProviders[p],
      );

      if (activeKeys.length === 0) {
        toast.error("At least one identity provider must be active");
        return;
      }

      const res = await updateProject(projectId, {
        providers: activeKeys,
      });

      if (res?.success) {
        toast.success("Identity catalog synchronized with enclave");
        if (onUpdated) onUpdated();
      }
    } catch {
      toast.error("Failed to update providers");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
        <span className="text-neutral-500">QUERYING IDENTITY CATALOG...</span>
      </div>
    );
  }

  return (
    <div
      className={`${
        embedded
          ? "bg-transparent space-y-6"
          : "min-h-screen bg-[#fbf9f9] dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 antialiased relative isolate"
      }`}
    >
      {/* Precision Engineering Matrix Background (only when full page) */}
      {!embedded && (
        <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#fbf9f9] dark:bg-[#09090c]">
          <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/50 dark:to-black/60" />
        </div>
      )}

      {/* Top Header */}
      {!embedded && (
        <div className="border-b border-neutral-200 dark:border-[#222329] bg-white/80 dark:bg-[#0c0d11]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onBack ? onBack() : navigate(`/projects/${projectId}`)
                }
                className="h-8 w-8 rounded border-neutral-200 dark:border-[#2a2b33]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
              <div>
                <div className="flex items-center text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                  <span>{project?.name || "PROJECT"}</span>
                  <TechSeparator />
                  <span>IDENTITY RUNTIME</span>
                </div>
                <h1 className="text-base font-bold text-neutral-900 dark:text-white">
                  Federated Provider Catalog
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 sm:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                <Input
                  placeholder="Filter by provider name or protocol..."
                  className="pl-9 h-8 text-xs font-mono bg-white dark:bg-[#14151a] border-neutral-200 dark:border-[#2a2b33]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="h-8 px-4 text-xs font-mono bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 shrink-0 cursor-pointer shadow-xs"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                ) : (
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                )}
                <span>SYNC CHANGES</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Command Bar */}
      {embedded && (
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <Input
              placeholder="Search provider catalog..."
              className="pl-9 h-8 text-xs font-mono bg-white dark:bg-[#14151a] border-neutral-200 dark:border-[#2a2b33]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-8 px-4 text-xs font-mono bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 shrink-0 cursor-pointer shadow-xs"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <Save className="h-3.5 w-3.5 mr-1.5" />
            )}
            <span>SAVE ACTIVE SELECTION</span>
          </Button>
        </div>
      )}

      <div
        className={
          embedded
            ? "space-y-8"
            : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
        }
      >
        {/* Section 1: Active & Ready */}
        {activeProviders.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-[#222329] pb-2 font-mono text-xs">
              <span className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>01 // LIVE INGRESS PROVIDERS</span>
              </span>
              <span className="text-neutral-400 text-[10px]">
                {activeProviders.length} READY
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {activeProviders.map((p, idx) => (
                <ProviderCard
                  key={p.id}
                  p={p}
                  index={idx}
                  isSelected={selectedProviders[p.id]}
                  isConfigured={true}
                  backendMessage={backendConfig[p.id]?.message}
                  onToggle={toggleProvider}
                  onViewDocs={setSelectedSpec}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Setup Required */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-[#222329] pb-2 font-mono text-xs">
            <span className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              02 // AVAILABLE PROVIDER CATALOG
            </span>
            <span className="text-neutral-400 text-[10px]">
              {setupProviders.length} PROTOCOLS
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {setupProviders.map((p, idx) => (
              <ProviderCard
                key={p.id}
                p={p}
                index={idx}
                isSelected={selectedProviders[p.id]}
                isConfigured={false}
                backendMessage={backendConfig[p.id]?.message}
                onToggle={toggleProvider}
                onViewDocs={setSelectedSpec}
              />
            ))}
          </div>
        </div>

        {/* Section 3: Coming Soon */}
        {upcomingProviders.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-[#222329] pb-2 font-mono text-xs">
              <span className="font-bold text-neutral-500 uppercase tracking-wider">
                03 // PROTOCOL ROADMAP
              </span>
              <span className="text-neutral-400 text-[10px]">UPCOMING</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {upcomingProviders.map((p, idx) => (
                <ProviderCard
                  key={p.id}
                  p={p}
                  index={idx}
                  isSelected={false}
                  onToggle={toggleProvider}
                  onViewDocs={setSelectedSpec}
                  isUpcoming
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Specification Dialog */}
      <Dialog
        open={Boolean(selectedSpec)}
        onOpenChange={(open) => !open && setSelectedSpec(null)}
      >
        <DialogContent className="max-w-2xl bg-white dark:bg-[#121316] border border-neutral-200 dark:border-[#222329] p-0 overflow-hidden rounded-xl shadow-xl">
          {selectedSpec && (
            <div className="flex flex-col text-xs font-mono">
              <div className="p-6 border-b border-neutral-200 dark:border-[#222329] bg-neutral-50/80 dark:bg-[#15161b]">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-10 w-10 rounded border border-neutral-200 dark:border-[#2a2b33] bg-white dark:bg-[#181920] flex items-center justify-center p-2 shrink-0">
                    <img
                      src={selectedSpec.logo}
                      alt={selectedSpec.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <DialogTitle className="text-sm font-bold text-neutral-900 dark:text-white">
                      {selectedSpec.name}
                    </DialogTitle>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                      SPECIFICATION &amp; PROTOCOL REQUIREMENTS
                    </p>
                  </div>
                </div>
                <DialogDescription className="text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                  {selectedSpec.description}
                </DialogDescription>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                      SUPPORTED FLOWS
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedSpec.flows.map((f) => (
                        <span
                          key={f}
                          className="px-2 py-0.5 bg-neutral-100 dark:bg-[#181920] border border-neutral-200 dark:border-[#2a2b33] rounded text-[10px]"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                      REQUIRED ENV VARIABLES
                    </span>
                    <div className="p-2.5 rounded bg-neutral-100 dark:bg-[#0c0d11] border border-neutral-200 dark:border-[#262730] text-[10px] space-y-1 text-emerald-600 dark:text-emerald-400">
                      {selectedSpec.env_vars.map((v) => (
                        <div key={v}>AUTH_{v}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                      CAPABILITIES
                    </span>
                    <ul className="space-y-1 text-neutral-600 dark:text-neutral-400 font-sans text-xs">
                      {selectedSpec.capabilities.map((c) => (
                        <li key={c} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedSpec.limitations && (
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                        LIMITATIONS
                      </span>
                      <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">
                        {selectedSpec.limitations}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-neutral-200 dark:border-[#222329] bg-neutral-50/50 dark:bg-[#15161b] flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSpec(null)}
                  className="h-8 px-4 text-xs font-mono border-neutral-200 dark:border-[#2a2b33]"
                >
                  DISMISS
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProvidersPage;
