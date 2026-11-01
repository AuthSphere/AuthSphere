import React from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";
import { useLogin } from "@/hooks/useAuthQuery";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
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
import { Github, Chrome, Disc, Loader2, ArrowLeft } from "lucide-react";
import VantaBackground from "@/components/ui/VantaBackground";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { mutate, isPending } = useLogin();

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
  React.useEffect(() => {
    if (user && !sdk_request) {
      navigate("/dashboard");
    }
  }, [user, navigate, sdk_request]);

  const handleSocialLogin = (provider) => {
    // If sdk_request exists, we should probably pass it to the social login too
    const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/${provider}`;
    // eslint-disable-next-line react-hooks/immutability
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
            const verifyPath = `/verify?email=${encodeURIComponent(formData.email)}${sdk_request ? `&sdk_request=${sdk_request}` : ""}`;
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

          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="space-y-2 text-center">
              <div className="flex justify-center mb-2">
                <div className="h-12 w-12 rounded-lg border bg-background/50 flex items-center justify-center">
                  <img
                    src="/assets/AuthSphere(main).png"
                    alt="AuthSphere"
                    className="h-8 w-8 object-contain"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your AuthSphere account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Social Logins */}
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
                    onClick={() => handleSocialLogin(p.id)}
                    className="flex flex-col items-center justify-center p-2 rounded-lg border bg-card hover:bg-muted/50 transition-all gap-1 group"
                    title={`Sign in with ${p.label}`}
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

              {/* Local Login Form */}
              <form
                onSubmit={handleSubmit(handleLocalLogin)}
                className="space-y-3"
              >
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
                    disabled={isPending}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className={errors.password ? "text-destructive" : ""}
                    >
                      Password
                    </Label>
                    <Link
                      to="#"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    disabled={isPending}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Register Link */}
              <p className="text-center text-sm text-muted-foreground pt-2">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </VantaBackground>
  );
};

export default Login;
