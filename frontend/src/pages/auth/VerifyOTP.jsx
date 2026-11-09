import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { useVerifyOTP, useResendOTP } from "@/hooks/useAuthQuery";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";
import TechSeparator from "@/components/common/TechSeparator";
import { ArrowLeft, RefreshCw, KeyRound, CheckCircle2 } from "lucide-react";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const sdk_request = searchParams.get("sdk_request");

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });
  const otpValue = useWatch({ control, name: "otp" }) || "";

  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputRef = useRef(null);

  const { mutate: verify, isPending: isVerifying } = useVerifyOTP();
  const { mutate: resend } = useResendOTP();

  useEffect(() => {
    if (!email) {
      toast.error("Missing verification context");
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Focus input automatically on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleVerify = (data) => {
    verify(
      { email, otp: data.otp, sdk_request },
      {
        onSuccess: (res) => {
          toast.success("Identity verified successfully!");
          if (res?.redirect_uri) {
            window.location.href = res.redirect_uri;
          } else {
            navigate("/login");
          }
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Verification failed");
        },
      },
    );
  };

  const handleResend = () => {
    if (timer > 0) return;

    setIsResending(true);
    resend(
      { email, sdk_request },
      {
        onSuccess: () => {
          toast.success("New 6-digit challenge code dispatched");
          setTimer(60);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to resend code");
        },
        onSettled: () => setIsResending(false),
      },
    );
  };

  const digits = Array.from({ length: 6 }, (_, i) => otpValue[i] || "");

  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col justify-center items-center p-4 relative isolate selection:bg-primary selection:text-primary-foreground">
      {/* Precision Engineering Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-background">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/50 dark:to-black/60" />
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>RETURN TO SIGN IN</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>CHALLENGE DISPATCHED</span>
          </div>
        </div>

        {/* Precision Card Shell */}
        <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
          {/* Card Technical Header Bar */}
          <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center">
              <span className="font-bold text-foreground">02</span>
              <TechSeparator />
              <span className="text-muted-foreground uppercase tracking-wider">
                CRYPTOGRAPHIC CHALLENGE
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground/80 font-mono">
              SPEC: RFC-6238
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Brand Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-3">
                <AuthSphereLogo className="h-7 w-auto" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Verify Identity Enclave
              </h1>
              <p className="text-xs text-muted-foreground">
                A 6-digit one-time cryptographic code has been transmitted to:
              </p>
              <div className="inline-block px-2.5 py-1 rounded bg-muted border border-border font-mono text-xs text-foreground font-medium">
                {email || "developer@domain.com"}
              </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit(handleVerify)} className="space-y-6">
              {/* Interactive Digit Cell Display */}
              <div className="space-y-2">
                <div
                  className="grid grid-cols-6 gap-2 sm:gap-2.5 cursor-text"
                  onClick={() => inputRef.current?.focus()}
                >
                  {digits.map((digit, idx) => {
                    const isCurrent = idx === otpValue.length;
                    const isFilled = Boolean(digit);
                    return (
                      <div
                        key={idx}
                        className={`h-13 sm:h-14 rounded-lg border text-xl font-mono font-bold flex items-center justify-center transition-all ${
                          isCurrent
                            ? "border-ring ring-1 ring-ring/30 bg-muted text-foreground"
                            : isFilled
                              ? "border-border bg-background text-foreground"
                              : "border-border/60 bg-muted/30 text-muted-foreground/60"
                        }`}
                      >
                        {digit ? (
                          <span>{digit}</span>
                        ) : isCurrent ? (
                          <span className="w-2 h-4 bg-emerald-500 animate-pulse rounded-xs" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* Hidden actual input */}
                <input
                  ref={inputRef}
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setValue("otp", val, { shouldValidate: !!errors.otp });
                  }}
                  disabled={isVerifying}
                  className="sr-only"
                />

                {errors.otp && (
                  <p className="font-mono text-xs text-destructive text-center mt-1">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isVerifying || otpValue.length !== 6}
                className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-mono font-semibold rounded-md flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                {isVerifying ? (
                  <span>AUTHENTICATING CIPHER...</span>
                ) : (
                  <span>CONFIRM VERIFICATION →</span>
                )}
              </button>
            </form>

            {/* Resend Controls */}
            <div className="pt-2 border-t border-border text-center space-y-2">
              <p className="text-[11px] text-muted-foreground">
                Code didn't arrive? Inspect spam filter or request a new
                handshake:
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0 || isResending}
                className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium transition-colors cursor-pointer ${
                  timer > 0
                    ? "text-muted-foreground cursor-not-allowed"
                    : "text-foreground hover:underline"
                }`}
              >
                <RefreshCw
                  className={`h-3 w-3 ${isResending ? "animate-spin" : ""}`}
                />
                <span>
                  {timer > 0
                    ? `DISPATCH NEW CODE IN ${timer}s`
                    : "DISPATCH NEW CODE"}
                </span>
              </button>
            </div>
          </div>

          {/* Technical Telemetry Bar */}
          <div className="px-5 py-2.5 border-t border-border bg-muted/50 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <KeyRound className="h-3 w-3" />
              <span>SHA-256 HMAC SECURED</span>
            </div>
            <span>TLS 1.3 ENCRYPTED</span>
          </div>
        </div>

        {/* Sub-footer metadata */}
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/80 px-2">
          <span>ZONE_01 // INGRESS GATEWAY</span>
          <span>AUTHTOKEN ROTATION: 300s</span>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
