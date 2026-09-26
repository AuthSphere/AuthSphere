import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";

/**
 * Handles the redirect from the backend after a successful Google (or any
 * OAuth) login.  The backend sets httpOnly cookies and then redirects here
 * with an optional bridge token:
 *
 *   GET /auth/callback?token=<bridgeToken>   (or ?error=<code>)
 *
 * We just need to call /developers/me — the cookies are already attached —
 * to populate the auth store, then navigate to the dashboard.
 */
export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const called = useRef(false); // prevent double-execution in StrictMode

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const error = searchParams.get("error");

    if (error) {
      console.error("[OAuthCallback] Error from backend:", error);
      navigate(`/login?error=${error}`, { replace: true });
      return;
    }

    // Cookies are already set by the backend redirect.
    // Just fetch the current user to populate the store.
    api
      .get("/developers/me")
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setUser(res.data.data);
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/login?error=auth_failed", { replace: true });
        }
      })
      .catch((err) => {
        console.error("[OAuthCallback] Failed to fetch user:", err.message);
        navigate("/login?error=auth_failed", { replace: true });
      });
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Completing sign-in…</p>
    </div>
  );
}
