import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { useVerifyOTP, useResendOTP } from "@/hooks/useAuthQuery";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Mail, ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import VantaBackground from "@/components/ui/VantaBackground";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const sdk_request = searchParams.get("sdk_request");

  const {
    register,
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

  const handleVerify = (data) => {
    verify(
      { email, otp: data.otp, sdk_request },
      {
        onSuccess: (data) => {
          toast.success("Identity verified successfully!");
          if (data.redirect_uri) {
            window.location.href = data.redirect_uri;
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
          toast.success("New code sent to your email");
          setTimer(60);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to resend code");
        },
        onSettled: () => setIsResending(false),
      },
    );
  };

  return (
    <VantaBackground>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>

          <Card className="bg-card border border-border shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-20 dark:opacity-50" />

            <CardHeader className="space-y-4 text-center pb-8">
              <div className="flex justify-center flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20 animate-pulse">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-black tracking-tight">
                    Verify Identity
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/70">
                    We sent a secure code to{" "}
                    <span className="text-foreground font-semibold underline decoration-primary/30">
                      {email}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(handleVerify)} className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="otp"
                    className={`text-xs font-bold uppercase tracking-widest ml-1 ${errors.otp ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    6-Digit Verification Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="0 0 0 0 0 0"
                    className={`h-14 text-center text-2xl font-mono tracking-[0.5em] bg-background/50 border-border dark:border-white/10 focus:ring-primary/20 transition-all rounded-xl ${errors.otp ? "border-destructive focus:border-destructive" : "focus:border-primary/30"}`}
                    {...register("otp")}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setValue("otp", val, { shouldValidate: !!errors.otp });
                    }}
                    disabled={isVerifying}
                  />
                  {errors.otp && (
                    <p className="text-[10px] text-destructive font-medium ml-1">
                      {errors.otp.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                  disabled={isVerifying || otpValue.length !== 6}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Confirm Verification"
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pb-8 border-t border-border dark:border-white/5 pt-6 mx-6 px-0 text-center">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Didn't receive the email? Check your spam folder or request a
                  new one.
                </p>
                <button
                  onClick={handleResend}
                  disabled={timer > 0 || isResending}
                  className={`
                                        inline-flex items-center gap-2 text-xs font-bold transition-all
                                        ${
                                          timer > 0
                                            ? "text-muted-foreground cursor-not-allowed opacity-50"
                                            : "text-primary hover:text-primary/80 active:scale-95"
                                        }
                                    `}
                >
                  {isResending ? (
                    <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                  ) : (
                    <RefreshCw
                      className={`h-3 w-3 ${timer > 0 ? "" : "text-primary"}`}
                    />
                  )}
                  {timer > 0
                    ? `Resend Code in ${timer}s`
                    : "Resend Verification Code"}
                </button>
              </div>
            </CardFooter>
          </Card>

          <div className="flex justify-center gap-6 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/30">
            <span>End-to-End Encrypted</span>
            <span>•</span>
            <span>Powered by AuthSphere</span>
          </div>
        </div>
      </div>
    </VantaBackground>
  );
};

export default VerifyOTP;
