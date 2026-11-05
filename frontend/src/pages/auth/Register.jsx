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
    <div className="bg-[#fbf9f9] dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 antialiased min-h-screen selection:bg-black selection:text-white transition-colors duration-300 relative isolate overflow-x-hidden">
      {/* Abstract Mathematical Flowing Geometric Line-Art Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#fbf9f9] dark:bg-[#09090c]">
        <svg
          className="w-full h-full object-cover opacity-60 dark:opacity-20"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1920 1080"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Flowing Geometric & Mathematical Paths */}
          <path
            d="M-80,280 C320,290 620,160 980,180 C1340,200 1620,380 2040,320"
            fill="none"
            stroke="currentColor"
            className="text-neutral-300 dark:text-neutral-700"
            strokeWidth="0.85"
          />
          <path
            d="M-60,340 C380,360 680,210 1020,240 C1360,270 1680,480 2060,410"
            fill="none"
            stroke="currentColor"
            className="text-neutral-300 dark:text-neutral-700"
            strokeWidth="0.75"
          />

          {/* Cross-cutting Mathematical Intersections extending beyond bounds */}
          <path
            d="M680,-80 C740,220 860,490 1180,680 C1500,870 1780,940 2080,980"
            fill="none"
            stroke="currentColor"
            className="text-neutral-400 dark:text-neutral-600"
            strokeWidth="0.9"
          />
          <path
            d="M720,-60 C780,240 920,440 1260,620 C1560,780 1860,820 2080,840"
            fill="none"
            stroke="currentColor"
            className="text-neutral-300 dark:text-neutral-700"
            strokeWidth="0.75"
          />

          {/* Deeper organic Bezier paths concentrated on center-right */}
          <path
            d="M980,180 C1120,340 1240,490 1480,560 C1720,630 1940,580 2060,540"
            fill="none"
            stroke="currentColor"
            className="text-neutral-400 dark:text-neutral-500"
            strokeWidth="0.95"
          />
          <path
            d="M1020,240 C1160,400 1280,540 1520,620 C1760,700 1920,720 2060,730"
            fill="none"
            stroke="currentColor"
            className="text-neutral-300 dark:text-neutral-700"
            strokeWidth="0.7"
          />
          <path
            d="M520,1140 C680,880 940,740 1280,590 C1620,440 1840,240 2060,140"
            fill="none"
            stroke="currentColor"
            className="text-neutral-400 dark:text-neutral-600"
            strokeWidth="0.85"
          />
          <path
            d="M560,1140 C720,910 980,780 1320,630 C1660,480 1880,300 2080,220"
            fill="none"
            stroke="currentColor"
            className="text-neutral-300 dark:text-neutral-700"
            strokeWidth="0.7"
          />

          {/* Counter-flow branch across the canvas */}
          <path
            d="M-100,720 C240,680 620,640 1020,760 C1420,880 1740,760 2060,690"
            fill="none"
            stroke="currentColor"
            className="text-neutral-300 dark:text-neutral-700"
            strokeWidth="0.75"
          />
          <path
            d="M1180,680 C1380,620 1520,620 1740,510 C1920,420 2020,320 2080,290"
            fill="none"
            stroke="currentColor"
            className="text-neutral-400 dark:text-neutral-500"
            strokeWidth="0.8"
          />

          {/* Delicate Intersection Nodes */}
          <circle
            cx="980"
            cy="180"
            className="fill-white dark:fill-black stroke-neutral-400"
            r="3"
            strokeWidth="0.8"
          />
          <circle
            cx="1180"
            cy="680"
            className="fill-white dark:fill-black stroke-neutral-500"
            r="3"
            strokeWidth="0.8"
          />
          <circle
            cx="1280"
            cy="590"
            className="fill-white dark:fill-black stroke-neutral-400"
            r="2.5"
            strokeWidth="0.8"
          />
          <circle
            cx="1480"
            cy="560"
            className="fill-white dark:fill-black stroke-neutral-500"
            r="3"
            strokeWidth="0.8"
          />
          <circle
            cx="1520"
            cy="620"
            className="fill-white dark:fill-black stroke-neutral-400"
            r="2.5"
            strokeWidth="0.8"
          />
          <circle
            cx="1020"
            cy="760"
            className="fill-white dark:fill-black stroke-neutral-400"
            r="3"
            strokeWidth="0.8"
          />
          <circle
            cx="1740"
            cy="510"
            className="fill-white dark:fill-black stroke-neutral-400"
            r="2.5"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      {/* Main Split-Screen Container */}
      <main className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12 text-neutral-900 dark:text-neutral-100 antialiased relative z-10">
        {/* ======================================================== */}
        {/* LEFT PANEL: REGISTRATION (lg: 6 cols, xl: 5 cols)         */}
        {/* ======================================================== */}
        <section
          aria-label="Registration Form Section"
          className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 bg-white/95 dark:bg-[#0c0d10]/95 backdrop-blur-sm border-r border-[#E5E5E5] dark:border-[#26262b] shadow-sm relative z-10"
        >
          {/* Top Bar */}
          <header className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center space-x-3 group">
              <div
                aria-hidden="true"
                className="w-7 h-7 flex items-center justify-center bg-black dark:bg-white rounded text-white dark:text-black shrink-0 transition-transform group-hover:scale-105"
              >
                <AuthSphereLogo className="w-4 h-4 object-contain" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-white">
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
          <div className="w-full max-w-md mx-auto my-auto py-8 sm:py-10">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full" />
                <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                  GET STARTED
                </span>
              </div>
              <h1 className="text-3xl sm:text-[32px] font-semibold text-neutral-900 dark:text-white tracking-tight leading-tight">
                Create your identity.
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Set up your AuthSphere account and start building with connected
                authentication.
              </p>
            </div>

            {/* Social Auth Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2 h-10 px-4 bg-[#f5f3f3] dark:bg-[#14151a] hover:bg-[#efeded] dark:hover:bg-[#1f2028] text-neutral-900 dark:text-white rounded text-xs font-medium transition-colors border border-transparent dark:border-[#2a2b33] cursor-pointer"
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
                className="flex items-center justify-center gap-2 h-10 px-4 bg-[#f5f3f3] dark:bg-[#14151a] hover:bg-[#efeded] dark:hover:bg-[#1f2028] text-neutral-900 dark:text-white rounded text-xs font-medium transition-colors border border-transparent dark:border-[#2a2b33] cursor-pointer"
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
              className="relative flex items-center justify-center my-6"
            >
              <div className="w-full h-px bg-[#E5E5E5] dark:bg-[#26262b]" />
              <span className="absolute bg-white dark:bg-[#0c0d10] px-3 font-mono text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                or register with email
              </span>
            </div>

            {/* Registration Form */}
            <form
              onSubmit={handleSubmit(handleRegister)}
              className="space-y-4"
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
                    className="w-full h-10 px-3 bg-white dark:bg-[#14151a] text-neutral-900 dark:text-white text-sm rounded border border-[#E5E5E5] dark:border-[#2a2b33] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
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
                    className="w-full h-10 px-3 bg-white dark:bg-[#14151a] text-neutral-900 dark:text-white text-sm rounded border border-[#E5E5E5] dark:border-[#2a2b33] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
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
                    className="w-full h-10 pl-3 pr-16 bg-white dark:bg-[#14151a] text-neutral-900 dark:text-white text-sm rounded border border-[#E5E5E5] dark:border-[#2a2b33] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 px-2 py-1 font-mono text-xs text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer select-none uppercase tracking-wider"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
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
                    className="w-full h-10 pl-3 pr-16 bg-white dark:bg-[#14151a] text-neutral-900 dark:text-white text-sm rounded border border-[#E5E5E5] dark:border-[#2a2b33] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 px-2 py-1 font-mono text-xs text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer select-none uppercase tracking-wider"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label
                  className="flex items-start gap-3 cursor-pointer group"
                  htmlFor="termsAgree"
                >
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      id="termsAgree"
                      type="checkbox"
                      {...register("terms")}
                      className="w-4 h-4 rounded border-[#E5E5E5] dark:border-[#2a2b33] text-black dark:text-white focus:ring-0 focus:ring-offset-0 transition cursor-pointer accent-black dark:accent-white"
                    />
                  </div>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 select-none leading-tight">
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
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black text-xs font-semibold rounded flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span>
                    {loading ? "Creating account..." : "Create account →"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <footer className="w-full text-center pt-4">
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
          className="lg:col-span-6 xl:col-span-7 hidden lg:flex flex-col justify-between p-8 sm:p-10 lg:p-12 xl:p-14 relative z-10"
        >
          {/* Right Header */}
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-0.5 bg-black dark:bg-white" />
              <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                ARCHITECTURE BRIEF
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white tracking-tight">
              One identity. Many possibilities.
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Connect identity providers and bring authentication into your
              applications.
            </p>
          </div>

          {/* Ecosystem Architecture Diagram */}
          <div className="relative z-10 w-full max-w-2xl my-auto py-8">
            <div className="w-full bg-white/90 dark:bg-[#121316]/90 backdrop-blur-sm rounded-xl p-8 xl:p-10 shadow-sm border border-[#E5E5E5] dark:border-[#26262b] relative">
              {/* Column Metadata Headers */}
              <div className="grid grid-cols-3 mb-8 text-center">
                <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Identity Providers
                </div>
                <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  AuthSphere Core
                </div>
                <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Connected Applications
                </div>
              </div>

              {/* Conceptual Architecture Diagram */}
              <div className="relative w-full h-80">
                <svg
                  aria-label="Conceptual architecture diagram showing Google and GitHub providers routing through AuthSphere Core to connected applications"
                  className="w-full h-full"
                  fill="none"
                  role="img"
                  viewBox="0 0 700 320"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Subtle Grid Background */}
                  <defs>
                    <pattern
                      height="24"
                      id="gridArchitecture"
                      patternUnits="userSpaceOnUse"
                      width="24"
                    >
                      <path
                        className="stroke-neutral-100 dark:stroke-neutral-800"
                        d="M 24 0 L 0 0 0 24"
                        fill="none"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect
                    fill="url(#gridArchitecture)"
                    height="320"
                    rx="6"
                    width="700"
                  />

                  {/* Connection Lines from Providers to Core */}
                  {/* Google to Core */}
                  <path
                    d="M 120 100 C 220 100, 240 160, 318 160"
                    stroke="currentColor"
                    className="text-neutral-400 dark:text-neutral-600"
                    strokeDasharray="3 3"
                    strokeWidth="1.25"
                  />
                  {/* GitHub to Core */}
                  <path
                    d="M 120 220 C 220 220, 240 160, 318 160"
                    stroke="currentColor"
                    className="text-neutral-400 dark:text-neutral-600"
                    strokeDasharray="3 3"
                    strokeWidth="1.25"
                  />

                  {/* Anchor Dots on Left */}
                  <circle
                    cx="120"
                    cy="100"
                    className="fill-neutral-900 dark:fill-white"
                    r="3"
                  />
                  <circle
                    cx="120"
                    cy="220"
                    className="fill-neutral-900 dark:fill-white"
                    r="3"
                  />

                  {/* Connection Lines from Core to Target Apps */}
                  {/* Core to Web App */}
                  <path
                    d="M 382 160 C 440 160, 480 80, 560 80"
                    stroke="currentColor"
                    className="text-neutral-900 dark:text-white"
                    strokeWidth="1.25"
                  />
                  <circle
                    cx="560"
                    cy="80"
                    className="fill-neutral-900 dark:fill-white"
                    r="3"
                  />

                  {/* Core to Mobile Client */}
                  <path
                    d="M 382 160 C 440 160, 480 160, 560 160"
                    stroke="currentColor"
                    className="text-neutral-900 dark:text-white"
                    strokeWidth="1.25"
                  />
                  <circle
                    cx="560"
                    cy="160"
                    className="fill-neutral-900 dark:fill-white"
                    r="3"
                  />

                  {/* Core to Internal API */}
                  <path
                    d="M 382 160 C 440 160, 480 240, 560 240"
                    stroke="currentColor"
                    className="text-neutral-900 dark:text-white"
                    strokeWidth="1.25"
                  />
                  <circle
                    cx="560"
                    cy="240"
                    className="fill-neutral-900 dark:fill-white"
                    r="3"
                  />

                  {/* Concentric Rings around Core */}
                  <circle
                    cx="350"
                    cy="160"
                    r="48"
                    className="stroke-neutral-300 dark:stroke-neutral-700"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <circle
                    cx="350"
                    cy="160"
                    className="fill-neutral-100 dark:fill-neutral-900"
                    r="40"
                  />
                  <circle
                    cx="350"
                    cy="160"
                    className="fill-black dark:fill-white"
                    r="30"
                  />

                  {/* Core Center Emblem (Four-Point Star) */}
                  <path
                    d="M 350 146 L 353.5 156.5 L 364 160 L 353.5 163.5 L 350 174 L 346.5 163.5 L 336 160 L 346.5 156.5 Z"
                    className="fill-white dark:fill-black"
                  />

                  {/* PROVIDER NODES (LEFT) */}
                  {/* Provider: Google */}
                  <g transform="translate(40, 80)">
                    <rect
                      className="fill-white dark:fill-[#14151a] shadow-xs"
                      height="40"
                      rx="4"
                      width="80"
                    />
                    <rect
                      className="stroke-neutral-300 dark:stroke-neutral-700"
                      height="39"
                      rx="3.5"
                      width="79"
                      x="0.5"
                      y="0.5"
                    />
                    <text
                      className="fill-neutral-900 dark:fill-white font-sans text-[11px] font-semibold"
                      letterSpacing="-0.01em"
                      textAnchor="middle"
                      x="40"
                      y="24"
                    >
                      GOOGLE
                    </text>
                  </g>

                  {/* Provider: GitHub */}
                  <g transform="translate(40, 200)">
                    <rect
                      className="fill-white dark:fill-[#14151a] shadow-xs"
                      height="40"
                      rx="4"
                      width="80"
                    />
                    <rect
                      className="stroke-neutral-300 dark:stroke-neutral-700"
                      height="39"
                      rx="3.5"
                      width="79"
                      x="0.5"
                      y="0.5"
                    />
                    <text
                      className="fill-neutral-900 dark:fill-white font-sans text-[11px] font-semibold"
                      letterSpacing="-0.01em"
                      textAnchor="middle"
                      x="40"
                      y="24"
                    >
                      GITHUB
                    </text>
                  </g>

                  {/* TARGET NODES (RIGHT) */}
                  {/* Target 1: Web App */}
                  <g transform="translate(560, 62)">
                    <rect
                      className="fill-white dark:fill-[#14151a] shadow-xs"
                      height="36"
                      rx="4"
                      width="100"
                    />
                    <rect
                      className="stroke-neutral-300 dark:stroke-neutral-700"
                      height="35"
                      rx="3.5"
                      width="99"
                      x="0.5"
                      y="0.5"
                    />
                    <text
                      className="fill-neutral-900 dark:fill-white font-sans text-[11px] font-medium"
                      textAnchor="middle"
                      x="50"
                      y="22"
                    >
                      Web App
                    </text>
                  </g>

                  {/* Target 2: Mobile Client */}
                  <g transform="translate(560, 142)">
                    <rect
                      className="fill-white dark:fill-[#14151a] shadow-xs"
                      height="36"
                      rx="4"
                      width="100"
                    />
                    <rect
                      className="stroke-neutral-300 dark:stroke-neutral-700"
                      height="35"
                      rx="3.5"
                      width="99"
                      x="0.5"
                      y="0.5"
                    />
                    <text
                      className="fill-neutral-900 dark:fill-white font-sans text-[11px] font-medium"
                      textAnchor="middle"
                      x="50"
                      y="22"
                    >
                      Mobile Client
                    </text>
                  </g>

                  {/* Target 3: Internal API */}
                  <g transform="translate(560, 222)">
                    <rect
                      className="fill-white dark:fill-[#14151a] shadow-xs"
                      height="36"
                      rx="4"
                      width="100"
                    />
                    <rect
                      className="stroke-neutral-300 dark:stroke-neutral-700"
                      height="35"
                      rx="3.5"
                      width="99"
                      x="0.5"
                      y="0.5"
                    />
                    <text
                      className="fill-neutral-900 dark:fill-white font-sans text-[11px] font-medium"
                      textAnchor="middle"
                      x="50"
                      y="22"
                    >
                      Internal API
                    </text>
                  </g>
                </svg>
              </div>

              {/* Bottom Information Detail */}
              <div className="mt-6 pt-4 border-t border-[#E5E5E5] dark:border-[#26262b] flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white inline-block" />
                  <span className="font-mono text-xs text-neutral-900 dark:text-white">
                    CONNECTED WORKSPACE
                  </span>
                </div>
                <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  <span>IDENTITY ORCHESTRATION</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Editorial Footer */}
          <footer className="relative z-10 flex items-center justify-between text-neutral-500 dark:text-neutral-400 font-mono text-xs">
            <div>AUTHSPHERE IDENTITY</div>
            <div>DEVELOPER PLATFORM</div>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default Register;
