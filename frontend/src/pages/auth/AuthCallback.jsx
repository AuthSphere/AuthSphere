import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";
import TechSeparator from "@/components/common/TechSeparator";
import { Loader2, ShieldCheck, CheckCircle2, Cpu } from "lucide-react";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();
  const hasAttempted = useRef(false);
  const [stage, setStage] = useState(1);

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error(`Authentication failed: ${error}`);
      navigate("/login");
      return;
    }

    if (!token) {
      toast.error("Invalid authentication callback");
      navigate("/login");
      return;
    }

    const exchangeToken = async () => {
      if (hasAttempted.current) return;
      hasAttempted.current = true;

      try {
        setStage(2);
        const res = await api.get(`/auth/session/${token}`, {
          baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
        });

        if (res.data.success) {
          setStage(3);
          toast.success("Cryptographic handshake verified!");
          await checkAuth();
          setTimeout(() => {
            navigate("/dashboard");
          }, 600);
        } else {
          throw new Error("Session exchange failed");
        }
      } catch (err) {
        console.error("Session exchange error:", err);
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
      }
    };

    exchangeToken();
  }, [searchParams, navigate, checkAuth]);

  return (
    <div className="min-h-screen bg-[#fbf9f9] dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 antialiased flex flex-col justify-center items-center p-4 relative isolate">
      {/* Precision Engineering Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#fbf9f9] dark:bg-[#09090c]">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/50 dark:to-black/60" />
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Card Shell */}
        <div className="rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] shadow-xs overflow-hidden">
          {/* Card Technical Header Bar */}
          <div className="px-5 py-3 border-b border-neutral-200 dark:border-[#222329] bg-neutral-50/80 dark:bg-[#15161b] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center">
              <span className="font-bold text-neutral-900 dark:text-white">
                03
              </span>
              <TechSeparator />
              <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                SESSION ENCLAVE HANDSHAKE
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>MUTUAL_TLS</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center mb-2">
                <AuthSphereLogo className="h-7 w-auto" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Exchanging Identity Tokens
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Establishing zero-trust session with AuthSphere Core Engine...
              </p>
            </div>

            {/* Handshake Telemetry Progress */}
            <div className="space-y-2.5 font-mono text-xs">
              {/* Step 1 */}
              <div className="p-3 rounded-lg border border-neutral-200 dark:border-[#222329] bg-neutral-50/60 dark:bg-[#15161b] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-neutral-400">01 //</span>
                  <span className="text-neutral-800 dark:text-neutral-200">
                    INGRESS CALLBACK CAPTURE
                  </span>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              </div>

              {/* Step 2 */}
              <div
                className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                  stage >= 2
                    ? "border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#181920]"
                    : "border-neutral-200 dark:border-[#222329] opacity-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-neutral-400">02 //</span>
                  <span className="text-neutral-800 dark:text-neutral-200">
                    HMAC-SHA256 TOKEN VERIFY
                  </span>
                </div>
                {stage >= 3 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <Loader2 className="h-4 w-4 text-emerald-500 animate-spin shrink-0" />
                )}
              </div>

              {/* Step 3 */}
              <div
                className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                  stage >= 3
                    ? "border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#181920]"
                    : "border-neutral-200 dark:border-[#222329] opacity-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-neutral-400">03 //</span>
                  <span className="text-neutral-800 dark:text-neutral-200">
                    MINTING ENCLAVE SESSION
                  </span>
                </div>
                {stage >= 3 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <span className="text-[10px] text-neutral-400">PENDING</span>
                )}
              </div>
            </div>
          </div>

          {/* Technical Telemetry Bar */}
          <div className="px-5 py-2.5 border-t border-neutral-200 dark:border-[#222329] bg-neutral-50/80 dark:bg-[#15161b] flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Cpu className="h-3 w-3" />
              <span>AS-CRYPTO // ENCLAVEEV_2.6</span>
            </div>
            <span>LATENCY: &lt; 0.8ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
