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
          toast.success("Authentication successful!");
          await checkAuth(true);
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
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col justify-center items-center p-4 relative isolate">
      {/* Precision Engineering Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-background">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/50 dark:to-black/60" />
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center">
              <span className="font-bold text-foreground">03</span>
              <TechSeparator />
              <span className="text-muted-foreground uppercase tracking-wider">
                AUTHENTICATION VERIFICATION
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>SECURE_SESSION</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center mb-2">
                <AuthSphereLogo className="h-7 w-auto" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Completing Authentication
              </h1>
              <p className="text-xs text-muted-foreground">
                Verifying your session credentials...
              </p>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {/* Step 1 */}
              <div className="p-3 rounded-lg border border-border bg-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-muted-foreground">01 //</span>
                  <span className="text-foreground">
                    RECEIVING AUTHENTICATION RESPONSE
                  </span>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              </div>

              {/* Step 2 */}
              <div
                className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                  stage >= 2
                    ? "border-border bg-muted text-foreground"
                    : "border-border/60 bg-muted/20 opacity-50 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-muted-foreground">02 //</span>
                  <span className="text-foreground">
                    VALIDATING SECURITY TOKENS
                  </span>
                </div>
                {stage >= 3 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <Loader2 className="h-4 w-4 text-emerald-500 animate-spin shrink-0" />
                )}
              </div>

              <div
                className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                  stage >= 3
                    ? "border-border bg-muted text-foreground"
                    : "border-border/60 bg-muted/20 opacity-50 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-muted-foreground">03 //</span>
                  <span className="text-foreground">
                    ESTABLISHING USER SESSION
                  </span>
                </div>
                {stage >= 3 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <span className="text-[10px] text-muted-foreground">
                    PENDING
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="px-5 py-2.5 border-t border-border bg-muted/50 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Cpu className="h-3 w-3" />
              <span>AuthSphere Session Exchange</span>
            </div>
            <span>Status: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
