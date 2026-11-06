import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import api from "@/api/axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((val) => val === true, {
      message: "Please accept the terms to proceed",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSocialLogin = (provider) => {
    window.location.assign(
      `${import.meta.env.VITE_BACKEND_URL}/auth/${provider}`,
    );
  };

  const handleRegister = async (formData) => {
    const { email, username, password } = formData;

    try {
      setLoading(true);
      const { data } = await api.post("/developers/register", {
        email,
        username,
        password,
      });

      if (data.success) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fbf9f9] dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 antialiased min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden selection:bg-black selection:text-white transition-colors duration-300 relative isolate overflow-x-hidden">
      {/* Precision Engineering Architectural Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#fbf9f9] dark:bg-[#09090c]">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/50 dark:to-black/60" />
      </div>

      {/* Main Split-Screen Container */}
      <main className="w-full min-h-screen lg:h-screen lg:max-h-screen grid grid-cols-1 lg:grid-cols-12 text-neutral-900 dark:text-neutral-100 antialiased relative z-10 lg:overflow-hidden">
        {/* ======================================================== */}
        {/* LEFT PANEL: REGISTRATION (lg: 6 cols, xl: 5 cols)         */}
        {/* ======================================================== */}
        <section
          aria-label="Registration Form Section"
          className="lg:col-span-6 xl:col-span-5 h-full flex flex-col justify-between p-5 sm:p-8 lg:px-8 lg:py-6 xl:px-10 xl:py-7 bg-white/95 dark:bg-[#0c0d10]/95 backdrop-blur-sm border-r border-[#E5E5E5] dark:border-[#26262b] shadow-sm relative z-10 overflow-y-auto"
        >
          {/* Top Bar */}
          <header className="flex items-center justify-between w-full">
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none"
              aria-label="AuthSphere Home"
            >
              <div className="w-7 h-7 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                <AuthSphereLogo className="w-7 h-7 object-contain" />
              </div>
              <span className="font-semibold text-[17px] tracking-tight text-neutral-900 dark:text-white">
                AuthSphere
              </span>
            </Link>

            <Link
              to="/"
              className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none rounded"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-sm"
              >
                arrow_back
              </span>
              <span>Back to AuthSphere</span>
            </Link>
          </header>

          {/* Registration Form Area */}
          <div className="w-full max-w-md mx-auto my-auto py-2 sm:py-3">
            <div className="mb-3.5">
              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full" />
                <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                  GET STARTED
                </span>
              </div>
              <h1 className="text-2xl sm:text-[26px] font-semibold text-neutral-900 dark:text-white tracking-tight leading-snug">
                Create your identity.
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                Set up your AuthSphere account and start building with connected
                authentication.
              </p>
            </div>

            {/* Social Auth Buttons */}
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2 h-9 px-3 bg-[#f5f3f3] dark:bg-[#14151a] hover:bg-[#efeded] dark:hover:bg-[#1f2028] text-neutral-900 dark:text-white rounded text-xs font-medium transition-colors border border-transparent dark:border-[#2a2b33] cursor-pointer"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                >
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

              <button
                type="button"
                onClick={() => handleSocialLogin("github")}
                className="flex items-center justify-center gap-2 h-9 px-3 bg-[#f5f3f3] dark:bg-[#14151a] hover:bg-[#efeded] dark:hover:bg-[#1f2028] text-neutral-900 dark:text-white rounded text-xs font-medium transition-colors border border-transparent dark:border-[#2a2b33] cursor-pointer"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 fill-current shrink-0"
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

            {/* Divider */}
            <div
              aria-hidden="true"
              className="relative flex items-center justify-center my-3"
            >
              <div className="w-full h-px bg-[#E5E5E5] dark:bg-[#26262b]" />
              <span className="absolute bg-white dark:bg-[#0c0d10] px-3 font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                or register with email
              </span>
            </div>

            {/* Registration Form */}
            <form
              onSubmit={handleSubmit(handleRegister)}
              className="space-y-2.5"
              noValidate
            >
              {/* Full Name / Username */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    className="text-xs font-medium text-neutral-900 dark:text-neutral-200 cursor-pointer"
                    htmlFor="fullName"
                  >
                    Username / Full name
                  </label>
                  {errors.username && (
                    <span className="font-mono text-xs text-red-500">
                      {errors.username.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="fullName"
                    type="text"
                    {...register("username")}
                    placeholder="Your developer handle"
                    className="w-full h-9 px-3 bg-white dark:bg-[#14151a] text-neutral-900 dark:text-white text-xs sm:text-sm rounded border border-[#E5E5E5] dark:border-[#2a2b33] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    className="text-xs font-medium text-neutral-900 dark:text-neutral-200 cursor-pointer"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  {errors.email && (
                    <span className="font-mono text-xs text-red-500">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className="w-full h-9 px-3 bg-white dark:bg-[#14151a] text-neutral-900 dark:text-white text-xs sm:text-sm rounded border border-[#E5E5E5] dark:border-[#2a2b33] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    className="text-xs font-medium text-neutral-900 dark:text-neutral-200 cursor-pointer"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  {errors.password && (
                    <span className="font-mono text-xs text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Create a password (min 6 chars)"
                    className="w-full h-9 pl-3 pr-16 bg-white dark:bg-[#14151a] text-neutral-900 dark:text-white text-xs sm:text-sm rounded border border-[#E5E5E5] dark:border-[#2a2b33] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 px-2 py-1 font-mono text-[11px] text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer select-none uppercase tracking-wider"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    className="text-xs font-medium text-neutral-900 dark:text-neutral-200 cursor-pointer"
                    htmlFor="confirmPassword"
                  >
                    Confirm password
                  </label>
                  {errors.confirmPassword && (
                    <span className="font-mono text-xs text-red-500">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="Confirm your password"
                    className="w-full h-9 pl-3 pr-16 bg-white dark:bg-[#14151a] text-neutral-900 dark:text-white text-xs sm:text-sm rounded border border-[#E5E5E5] dark:border-[#2a2b33] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 px-2 py-1 font-mono text-[11px] text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer select-none uppercase tracking-wider"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label
                  className="flex items-start gap-2.5 cursor-pointer group"
                  htmlFor="termsAgree"
                >
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      id="termsAgree"
                      type="checkbox"
                      {...register("terms")}
                      className="w-3.5 h-3.5 rounded border-[#E5E5E5] dark:border-[#2a2b33] text-black dark:text-white focus:ring-0 focus:ring-offset-0 transition cursor-pointer accent-black dark:accent-white"
                    />
                  </div>
                  <span className="text-[11px] text-neutral-600 dark:text-neutral-400 select-none leading-tight">
                    I agree to the{" "}
                    <a
                      href="#terms"
                      className="text-neutral-900 dark:text-white underline hover:opacity-80"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#privacy"
                      className="text-neutral-900 dark:text-white underline hover:opacity-80"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
                {errors.terms && (
                  <p className="font-mono text-xs text-red-500 mt-1">
                    {errors.terms.message}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-9 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black text-xs font-semibold rounded flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span>
                    {loading ? "Creating account..." : "Create account →"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <footer className="w-full text-center pt-2 sm:pt-3">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-neutral-900 dark:text-white font-medium underline hover:opacity-80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </footer>
        </section>

        {/* ======================================================== */}
        {/* RIGHT PANEL: IDENTITY OVERVIEW & ARCHITECTURE             */}
        {/* ======================================================== */}
        <section
          aria-label="Identity Connection Architecture"
          className="lg:col-span-6 xl:col-span-7 hidden lg:flex flex-col justify-between p-6 lg:p-8 xl:p-10 h-full relative z-10 overflow-hidden bg-neutral-50/50 dark:bg-[#07080a]/50"
        >
          <div className="w-full max-w-170 mx-auto h-full flex flex-col justify-between py-1">
            {/* Right Header */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="w-2 h-0.5 bg-black dark:bg-white" />
                <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                  ARCHITECTURE BRIEF
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                One identity. Many possibilities.
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                Connect identity providers and bring authentication into your
                applications.
              </p>
            </div>

            {/* Ecosystem Architecture Diagram Card */}
            <div className="relative z-10 w-full my-auto py-1">
              <div className="w-full bg-white dark:bg-[#0f1015] rounded-xl shadow-sm border border-[#E5E5E5] dark:border-[#26262b] overflow-hidden relative">
                {/* Card Top Technical Metadata Bar */}
                <div className="px-5 py-2.5 border-b border-[#E5E5E5] dark:border-[#26262b] flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-50/80 dark:bg-neutral-900/60">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    FIG. 02 // IDENTITY RUNTIME TOPOLOGY
                  </span>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>LIVE VERIFIED</span>
                  </div>
                </div>

                {/* High-Intensity Architectural SVG Diagram */}
                <div className="p-3 sm:p-4">
                  <svg
                    aria-label="Conceptual architecture diagram showing Google and GitHub providers routing through AuthSphere Core to connected applications"
                    className="w-full h-auto max-h-75"
                    fill="none"
                    role="img"
                    viewBox="0 0 680 300"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      {/* Diagram Matrix Pattern */}
                      <pattern
                        height="20"
                        id="archGridMatrix"
                        patternUnits="userSpaceOnUse"
                        width="20"
                      >
                        <path
                          className="stroke-neutral-200/60 dark:stroke-neutral-800/80"
                          d="M 20 0 L 0 0 0 20"
                          fill="none"
                          strokeWidth="0.75"
                        />
                      </pattern>

                      {/* Vibrant Cyan Halo for Core Hub */}
                      <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                        <stop
                          offset="0%"
                          stopColor="#00E5FF"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="50%"
                          stopColor="#00E5FF"
                          stopOpacity="0.08"
                        />
                        <stop
                          offset="100%"
                          stopColor="#00E5FF"
                          stopOpacity="0"
                        />
                      </radialGradient>
                    </defs>

                    <rect
                      fill="url(#archGridMatrix)"
                      height="300"
                      rx="4"
                      width="680"
                    />

                    {/* ─── COLUMN HEADERS (Centered above respective nodes) ─── */}
                    {/* Column 1: Provider center = 86 */}
                    <text
                      x="86"
                      y="22"
                      textAnchor="middle"
                      className="font-mono text-[10.5px] font-semibold tracking-wider fill-neutral-500 dark:fill-neutral-400 uppercase"
                    >
                      Identity Providers
                    </text>
                    {/* Column 2: Core center = 340 */}
                    <text
                      x="340"
                      y="22"
                      textAnchor="middle"
                      className="font-mono text-[10.5px] font-semibold tracking-wider fill-neutral-900 dark:fill-white uppercase"
                    >
                      AuthSphere Core
                    </text>
                    {/* Column 3: Applications center = 592 */}
                    <text
                      x="592"
                      y="22"
                      textAnchor="middle"
                      className="font-mono text-[10.5px] font-semibold tracking-wider fill-neutral-500 dark:fill-neutral-400 uppercase"
                    >
                      Connected Applications
                    </text>

                    {/* Hairline Rule under column headers */}
                    <line
                      x1="16"
                      y1="32"
                      x2="664"
                      y2="32"
                      className="stroke-neutral-200 dark:stroke-neutral-800"
                      strokeWidth="1"
                    />

                    {/* ─── HIGH-INTENSITY WIRES & ANIMATED DATA FLOW ─── */}
                    {/* Google -> Core Wire */}
                    <path
                      d="M 148 94 C 220 94, 230 158, 290 158"
                      className="stroke-neutral-300 dark:stroke-neutral-700"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 148 94 C 220 94, 230 158, 290 158"
                      className="flow-stream-in stroke-neutral-900 dark:stroke-white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* GitHub -> Core Wire */}
                    <path
                      d="M 148 222 C 220 222, 230 158, 290 158"
                      className="stroke-neutral-300 dark:stroke-neutral-700"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 148 222 C 220 222, 230 158, 290 158"
                      className="flow-stream-in stroke-neutral-900 dark:stroke-white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Core -> Web Client Wire */}
                    <path
                      d="M 390 158 C 450 158, 460 84, 528 84"
                      className="stroke-neutral-300 dark:stroke-neutral-700"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 390 158 C 450 158, 460 84, 528 84"
                      className="flow-stream-out stroke-neutral-900 dark:stroke-white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Core -> Mobile App Wire */}
                    <path
                      d="M 390 158 L 528 158"
                      className="stroke-neutral-300 dark:stroke-neutral-700"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 390 158 L 528 158"
                      className="flow-stream-out stroke-neutral-900 dark:stroke-white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Core -> Internal API Wire */}
                    <path
                      d="M 390 158 C 450 158, 460 232, 528 232"
                      className="stroke-neutral-300 dark:stroke-neutral-700"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 390 158 C 450 158, 460 232, 528 232"
                      className="flow-stream-out stroke-neutral-900 dark:stroke-white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Wire Termination Ports */}
                    <circle
                      cx="148"
                      cy="94"
                      r="3.5"
                      className="fill-neutral-900 dark:fill-white"
                    />
                    <circle
                      cx="148"
                      cy="222"
                      r="3.5"
                      className="fill-neutral-900 dark:fill-white"
                    />
                    <circle
                      cx="290"
                      cy="158"
                      r="3.5"
                      className="fill-neutral-900 dark:fill-white"
                    />
                    <circle
                      cx="390"
                      cy="158"
                      r="3.5"
                      className="fill-neutral-900 dark:fill-white"
                    />
                    <circle
                      cx="528"
                      cy="84"
                      r="3.5"
                      className="fill-neutral-900 dark:fill-white"
                    />
                    <circle
                      cx="528"
                      cy="158"
                      r="3.5"
                      className="fill-neutral-900 dark:fill-white"
                    />
                    <circle
                      cx="528"
                      cy="232"
                      r="3.5"
                      className="fill-neutral-900 dark:fill-white"
                    />

                    {/* ─── AUTHSPHERE CORE NODE (CENTER: 340, 158) ─── */}
                    <g>
                      {/* Ambient Cyan Core Glow */}
                      <circle cx="340" cy="158" r="62" fill="url(#coreGlow)" />

                      {/* Concentric Calibrated Radar Ring */}
                      <circle
                        cx="340"
                        cy="158"
                        r="50"
                        className="animate-ring stroke-neutral-400 dark:stroke-neutral-500"
                        strokeDasharray="4 4"
                        strokeWidth="1.25"
                      />

                      {/* Middle Orbital Shield */}
                      <circle
                        cx="340"
                        cy="158"
                        r="40"
                        className="stroke-neutral-300 dark:stroke-neutral-700 fill-neutral-100 dark:fill-neutral-900"
                        strokeWidth="1.5"
                      />

                      {/* High-Contrast Obsidian Hub */}
                      <circle
                        cx="340"
                        cy="158"
                        r="28"
                        className="fill-[#09090c] dark:fill-white shadow-md"
                      />

                      {/* AuthSphere Four-Point Core Emblem */}
                      <path
                        d="M 340 144 L 344 154 L 354 158 L 344 162 L 340 172 L 336 162 L 326 158 L 336 154 Z"
                        className="fill-white dark:fill-[#09090c]"
                      />
                      <polygon
                        points="340,152 342,156 346,158 342,160 340,164 338,160 334,158 338,156"
                        fill="#00E5FF"
                      />

                      {/* Sub-node telemetry badge */}
                      <rect
                        x="265"
                        y="226"
                        width="150"
                        height="22"
                        rx="4"
                        className="fill-white dark:fill-[#121318] stroke-neutral-200 dark:stroke-neutral-800 shadow-xs"
                      />
                      <circle
                        cx="279"
                        cy="237"
                        r="2.5"
                        className="fill-emerald-500 animate-pulse"
                      />
                      <text
                        x="344"
                        y="241"
                        textAnchor="middle"
                        className="font-mono text-[9.5px] font-semibold fill-neutral-800 dark:fill-neutral-200"
                      >
                        0.8ms Token Verifier
                      </text>
                    </g>

                    {/* ─── PROVIDER NODES (LEFT: x=24..148, center=86) ─── */}
                    {/* Google Node (center y=94) */}
                    <g transform="translate(24, 70)">
                      <rect
                        className="fill-white dark:fill-[#14151a] stroke-neutral-300 dark:stroke-neutral-700 shadow-xs"
                        height="48"
                        rx="4"
                        width="124"
                      />
                      <rect fill="#4285F4" height="48" rx="1" width="3.5" />
                      {/* Google G Logo SVG */}
                      <g transform="translate(14, 15)">
                        <path
                          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.71-1.57 2.68-3.88 2.68-6.61z"
                          fill="#4285F4"
                        />
                        <path
                          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"
                          fill="#34A853"
                        />
                        <path
                          d="M3.97 10.71A5.41 5.41 0 0 1 3.69 9c0-.6.1-1.18.28-1.71V4.96H.96A9.01 9.01 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.59C13.46.86 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3.01 2.33c.71-2.13 2.69-3.71 5.03-3.71z"
                          fill="#EA4335"
                        />
                      </g>
                      <text
                        className="fill-neutral-900 dark:fill-white font-sans text-[12px] font-semibold"
                        x="40"
                        y="23"
                      >
                        Google
                      </text>
                      <text
                        className="fill-neutral-500 dark:fill-neutral-400 font-mono text-[9px] font-medium"
                        x="40"
                        y="37"
                      >
                        OIDC / OAuth
                      </text>
                      <circle
                        cx="110"
                        cy="24"
                        r="2.5"
                        className="fill-emerald-500 animate-pulse"
                      />
                    </g>

                    {/* GitHub Node (center y=222) */}
                    <g transform="translate(24, 198)">
                      <rect
                        className="fill-white dark:fill-[#14151a] stroke-neutral-300 dark:stroke-neutral-700 shadow-xs"
                        height="48"
                        rx="4"
                        width="124"
                      />
                      <rect
                        className="fill-neutral-900 dark:fill-white"
                        height="48"
                        rx="1"
                        width="3.5"
                      />
                      {/* GitHub Mark SVG */}
                      <g transform="translate(14, 15)">
                        <path
                          className="fill-neutral-900 dark:fill-white"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9 0C4.03 0 0 4.03 0 9c0 3.98 2.58 7.35 6.16 8.54.45.08.62-.2.62-.43v-1.68c-2.51.55-3.04-1.07-3.04-1.07-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.62.75.08-.58.32-.98.57-1.2-2-.23-4.1-1-4.1-4.45 0-.98.35-1.79.92-2.42-.09-.23-.4-1.14.09-2.39 0 0 .76-.24 2.48.92.72-.2 1.49-.3 2.25-.3.76 0 1.53.1 2.25.3 1.72-1.16 2.48-.92 2.48-.92.49 1.25.18 2.16.09 2.39.58.63.92 1.44.92 2.42 0 3.46-2.11 4.22-4.12 4.44.33.28.62.84.62 1.69v2.51c0 .24.16.52.62.43A9.01 9.01 0 0 0 18 9c0-4.97-4.03-9-9-9z"
                        />
                      </g>
                      <text
                        className="fill-neutral-900 dark:fill-white font-sans text-[12px] font-semibold"
                        x="40"
                        y="23"
                      >
                        GitHub
                      </text>
                      <text
                        className="fill-neutral-500 dark:fill-neutral-400 font-mono text-[9px] font-medium"
                        x="40"
                        y="37"
                      >
                        OAuth 2.0
                      </text>
                      <circle
                        cx="110"
                        cy="24"
                        r="2.5"
                        className="fill-emerald-500 animate-pulse"
                      />
                    </g>

                    {/* ─── TARGET APPLICATION NODES (RIGHT: x=528..656, center=592) ─── */}
                    {/* Target 1: Web Client (center y=84) */}
                    <g transform="translate(528, 62)">
                      <rect
                        className="fill-white dark:fill-[#14151a] stroke-neutral-300 dark:stroke-neutral-700 shadow-xs"
                        height="44"
                        rx="4"
                        width="128"
                      />
                      {/* Browser Icon */}
                      <g
                        transform="translate(12, 14)"
                        className="stroke-neutral-700 dark:stroke-neutral-300"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="16"
                          height="14"
                          rx="2"
                          strokeWidth="1.2"
                          fill="none"
                        />
                        <line x1="0" y1="4" x2="16" y2="4" strokeWidth="1" />
                        <circle cx="3" cy="2" r="0.75" fill="currentColor" />
                        <circle cx="6" cy="2" r="0.75" fill="currentColor" />
                      </g>
                      <text
                        className="fill-neutral-900 dark:fill-white font-sans text-[11.5px] font-semibold"
                        x="36"
                        y="20"
                      >
                        Web Client
                      </text>
                      <text
                        className="fill-neutral-500 dark:fill-neutral-400 font-mono text-[9px] font-medium"
                        x="36"
                        y="33"
                      >
                        JWT / RS256
                      </text>
                      <circle
                        cx="116"
                        cy="22"
                        r="2"
                        className="fill-emerald-500"
                      />
                    </g>

                    {/* Target 2: Mobile App (center y=158) */}
                    <g transform="translate(528, 136)">
                      <rect
                        className="fill-white dark:fill-[#14151a] stroke-neutral-300 dark:stroke-neutral-700 shadow-xs"
                        height="44"
                        rx="4"
                        width="128"
                      />
                      {/* Smartphone Icon */}
                      <g
                        transform="translate(14, 13)"
                        className="stroke-neutral-700 dark:stroke-neutral-300"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="11"
                          height="17"
                          rx="2"
                          strokeWidth="1.2"
                          fill="none"
                        />
                        <circle cx="5.5" cy="14" r="0.75" fill="currentColor" />
                      </g>
                      <text
                        className="fill-neutral-900 dark:fill-white font-sans text-[11.5px] font-semibold"
                        x="36"
                        y="20"
                      >
                        Mobile App
                      </text>
                      <text
                        className="fill-neutral-500 dark:fill-neutral-400 font-mono text-[9px] font-medium"
                        x="36"
                        y="33"
                      >
                        PKCE / RFC-7636
                      </text>
                      <circle
                        cx="116"
                        cy="22"
                        r="2"
                        className="fill-emerald-500"
                      />
                    </g>

                    {/* Target 3: Internal API (center y=232) */}
                    <g transform="translate(528, 210)">
                      <rect
                        className="fill-white dark:fill-[#14151a] stroke-neutral-300 dark:stroke-neutral-700 shadow-xs"
                        height="44"
                        rx="4"
                        width="128"
                      />
                      {/* Terminal / API Server Icon */}
                      <g
                        transform="translate(12, 14)"
                        className="stroke-neutral-700 dark:stroke-neutral-300"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="16"
                          height="14"
                          rx="2"
                          strokeWidth="1.2"
                          fill="none"
                        />
                        <path
                          d="M 3 5 L 6 7.5 L 3 10"
                          strokeWidth="1.1"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <line
                          x1="8"
                          y1="10"
                          x2="12"
                          y2="10"
                          strokeWidth="1.2"
                        />
                      </g>
                      <text
                        className="fill-neutral-900 dark:fill-white font-sans text-[11.5px] font-semibold"
                        x="36"
                        y="20"
                      >
                        Internal API
                      </text>
                      <text
                        className="fill-neutral-500 dark:fill-neutral-400 font-mono text-[9px] font-medium"
                        x="36"
                        y="33"
                      >
                        Bearer Tokens
                      </text>
                      <circle
                        cx="116"
                        cy="22"
                        r="2"
                        className="fill-emerald-500"
                      />
                    </g>
                  </svg>
                </div>

                {/* Card Bottom Technical Telemetry Bar */}
                <div className="px-5 py-2.5 border-t border-[#E5E5E5] dark:border-[#26262b] flex items-center justify-between text-[11px] font-mono bg-neutral-50/80 dark:bg-neutral-900/60">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      INGRESS ACTIVE (5/5 NODES)
                    </span>
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400 font-medium">
                    <span>SPEC: RFC-7519 / RFC-7636</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Editorial Footer */}
            <footer className="relative z-10 flex items-center justify-between text-neutral-500 dark:text-neutral-400 font-mono text-xs">
              <div>AUTHSPHERE IDENTITY</div>
              <div>DEVELOPER PLATFORM</div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;
