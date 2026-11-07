import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import api from "@/api/axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";
import ArchitectureSpecification from "@/components/common/ArchitectureSpecification";

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
        {/* RIGHT PANEL: ASTRODYNAMICS & CELESTIAL MECHANICS          */}
        {/* ======================================================== */}
        <section
          aria-label="Celestial Mechanics & Astrodynamics"
          className="lg:col-span-6 xl:col-span-7 hidden lg:flex flex-1 relative overflow-hidden bg-[#fafafa] dark:bg-[#080909]"
        >
          <ArchitectureSpecification />
        </section>
      </main>
    </div>
  );
};

export default Register;
