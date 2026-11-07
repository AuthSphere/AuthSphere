import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";
import { useLogin } from "@/hooks/useAuthQuery";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";
import CommunityTopology from "@/components/common/CommunityTopology";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUser } = useAuthStore();
  const { mutate, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const sdk_request = searchParams.get("sdk_request");

  // Redirect if already logged in (Only for dashboard login)
  useEffect(() => {
    if (user && !sdk_request) {
      navigate("/dashboard");
    }
  }, [user, navigate, sdk_request]);

  const handleSocialLogin = (provider) => {
    const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/${provider}`;

    window.location.href = sdk_request
      ? `${baseUrl}?sdk_request=${sdk_request}`
      : baseUrl;
  };

  const handleLocalLogin = (formData) => {
    mutate(
      { ...formData, sdk_request },
      {
        onSuccess: (data) => {
          if (data.success) {
            if (data.developer) {
              setUser(data.developer);
            }
            toast.success("Login successful!");

            if (data.redirect_uri) {
              window.location.href = data.redirect_uri;
            } else {
              window.location.href = "/dashboard";
            }
          }
        },
        onError: (error) => {
          const data = error.response?.data;

          if (data?.error_code === "EMAIL_NOT_VERIFIED") {
            toast.info(data.message || "Email verification required");

            const verifyPath = `/verify?email=${encodeURIComponent(
              formData.email,
            )}${sdk_request ? `&sdk_request=${sdk_request}` : ""}`;

            navigate(verifyPath);
            return;
          }

          const message = data?.message || "Login failed";
          toast.error(message);
        },
      },
    );
  };

  return (
    <div className="bg-white dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 min-h-screen selection:bg-black selection:text-white transition-colors duration-300 relative isolate overflow-x-hidden">
      {/* Subtle Film Grain Texture Overlay */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.028] dark:opacity-[0.015] -z-10"
      >
        <filter id="filmGrainLogin">
          <feTurbulence
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
            type="fractalNoise"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0 0 0 0 0.8 0"
          />
        </filter>
        <rect filter="url(#filmGrainLogin)" height="100%" width="100%" />
      </svg>

      {/* Primary Split-Screen Layout */}
      <main className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row items-stretch">
        {/* LEFT PANEL: SIGN IN */}
        <section className="w-full lg:w-[42%] lg:max-w-140 bg-white dark:bg-[#0c0d10] flex flex-col justify-between p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#E5E5E5] dark:border-[#222329] relative z-20">
          <div className="flex flex-col gap-10">
            {/* Brand Lockup & Back Link */}
            <header className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                  <AuthSphereLogo className="w-8 h-8 object-contain" />
                </div>

                <div className="flex flex-col leading-none">
                  <span className="font-semibold text-[17px] tracking-tight text-neutral-900 dark:text-white">
                    AuthSphere
                  </span>
                </div>
              </Link>

              <Link
                to="/"
                className="group inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white font-medium transition-colors"
              >
                <span className="transition-transform duration-150 group-hover:-translate-x-0.5">
                  ←
                </span>
                <span>Back to AuthSphere</span>
              </Link>
            </header>

            {/* Intro */}
            <div className="flex flex-col gap-2 pt-2">
              <h1 className="text-3xl sm:text-[34px] font-semibold tracking-tight text-neutral-900 dark:text-white leading-tight">
                Welcome back.
              </h1>

              <p className="text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 font-normal">
                Sign in to continue to your AuthSphere account.
              </p>
            </div>

            {/* Authentication Form */}
            <form
              onSubmit={handleSubmit(handleLocalLogin)}
              className="flex flex-col gap-4 mt-1"
            >
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-medium text-neutral-900 dark:text-neutral-200 tracking-tight"
                  htmlFor="identity-email"
                >
                  Email address
                </label>

                <input
                  id="identity-email"
                  type="email"
                  {...register("email")}
                  placeholder="name@company.com"
                  className="w-full h-10 px-3 bg-white dark:bg-[#14151a] text-neutral-900 dark:text-white text-sm rounded border border-[#E5E5E5] dark:border-[#2a2b33] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />

                {errors.email && (
                  <p className="text-xs text-red-500 font-mono mt-0.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline">
                  <label
                    className="text-xs font-medium text-neutral-900 dark:text-neutral-200 tracking-tight"
                    htmlFor="identity-pass"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-mono text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer select-none"
                    id="toggle-pass-btn"
                  >
                    {showPassword ? "[Hide]" : "[Show]"}
                  </button>
                </div>

                <input
                  id="identity-pass"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  className="w-full h-10 px-3 bg-white dark:bg-[#14151a] text-neutral-900 dark:text-white font-sans text-sm rounded border border-[#E5E5E5] dark:border-[#2a2b33] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />

                {errors.password && (
                  <p className="text-xs text-red-500 font-mono mt-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#E5E5E5] dark:border-[#2a2b33] text-black dark:text-white focus:ring-0 focus:ring-offset-0 cursor-pointer accent-black dark:accent-white"
                  />

                  <span className="text-xs text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                id="auth-submit-btn"
                className="mt-2 w-full h-10 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-medium text-sm rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                <span>{isPending ? "Signing in..." : "Sign in"}</span>
                <span className="text-sm font-mono leading-none">→</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-1 flex items-center justify-center">
              <div className="w-full h-px bg-[#E5E5E5] dark:bg-[#26262b]" />

              <span className="absolute px-3 bg-white dark:bg-[#0c0d10] text-[11px] text-neutral-500 dark:text-neutral-400 tracking-normal">
                or continue with
              </span>
            </div>

            {/* Social Authentication */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="h-10 px-3 bg-white dark:bg-[#14151a] hover:bg-[#F9F9F9] dark:hover:bg-[#1a1b22] text-neutral-900 dark:text-white text-xs font-medium rounded border border-[#E5E5E5] dark:border-[#2a2b33] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleSocialLogin("github")}
                className="h-10 px-3 bg-white dark:bg-[#14151a] hover:bg-[#F9F9F9] dark:hover:bg-[#1a1b22] text-neutral-900 dark:text-white text-xs font-medium rounded border border-[#E5E5E5] dark:border-[#2a2b33] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    fillRule="evenodd"
                  />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="pt-8 text-center sm:text-left">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              New to AuthSphere?{" "}
              <Link
                to="/register"
                className="text-neutral-900 dark:text-white font-medium hover:underline underline-offset-2 ml-0.5"
              >
                Create an account.
              </Link>
            </p>
          </footer>
        </section>

        {/* RIGHT PANEL: MATHEMATICAL HARMONIC FIELD */}
        <section className="hidden lg:flex lg:w-[58%] flex-1 relative overflow-hidden bg-[#fafafa] dark:bg-[#080909]">
          <CommunityTopology />
        </section>
      </main>
    </div>
  );
};

export default Login;
