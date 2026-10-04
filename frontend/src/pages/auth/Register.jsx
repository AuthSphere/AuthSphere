import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import api from "@/api/axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Chrome, Loader2, ArrowLeft } from "lucide-react";
import VantaBackground from "@/components/ui/VantaBackground";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

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
    },
  });

  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
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
    <VantaBackground>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <Card className="bg-card/80 dark:bg-card/20 border-black/5 dark:border-white/10 backdrop-blur-md shadow-xl dark:shadow-2xl">
            <CardHeader className="space-y-2 text-center">
              <div className="flex justify-center mb-2">
                <div className="h-12 w-12 rounded-lg border bg-background/50 flex items-center justify-center">
                  <img
                    src="/assets/logo.png"
                    alt="AuthSphere"
                    className="h-8 w-8 object-contain dark:invert"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>
                Start securing your applications today
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Social Registration */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: "google",
                    logo: "https://authjs.dev/img/providers/google.svg",
                    label: "Google",
                  },
                  {
                    id: "github",
                    logo: "https://authjs.dev/img/providers/github.svg",
                    label: "GitHub",
                  },
                  {
                    id: "discord",
                    logo: "https://authjs.dev/img/providers/discord.svg",
                    label: "Discord",
                  },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSocialLogin(p.id)}
                    className="flex flex-col items-center justify-center p-2 rounded-lg border bg-card hover:bg-muted/50 transition-all gap-1 group"
                    title={`Sign up with ${p.label}`}
                  >
                    <img
                      src={p.logo}
                      alt={p.label}
                      className="h-5 w-5 grayscale group-hover:grayscale-0 transition-grayscale"
                    />
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Registration Form */}
              <form
                onSubmit={handleSubmit(handleRegister)}
                className="space-y-3"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className={errors.username ? "text-destructive" : ""}
                  >
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    {...register("username")}
                    disabled={loading}
                    className={errors.username ? "border-destructive" : ""}
                  />
                  {errors.username && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className={errors.email ? "text-destructive" : ""}
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register("email")}
                    disabled={loading}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className={errors.password ? "text-destructive" : ""}
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      disabled={loading}
                      className={errors.password ? "border-destructive" : ""}
                    />
                    {errors.password && (
                      <p className="text-[10px] text-destructive font-medium">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className={
                        errors.confirmPassword ? "text-destructive" : ""
                      }
                    >
                      Confirm
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword")}
                      disabled={loading}
                      className={
                        errors.confirmPassword ? "border-destructive" : ""
                      }
                    />
                    {errors.confirmPassword && (
                      <p className="text-[10px] text-destructive font-medium">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <Separator />
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </VantaBackground>
  );
};

export default Register;
