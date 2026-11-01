import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();
  const hasAttempted = useRef(false);

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
        const res = await api.get(`/auth/session/${token}`, {
          baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
        });
        if (res.data.success) {
          toast.success("Successfully logged in!");
          await checkAuth();
          navigate("/dashboard");
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
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
