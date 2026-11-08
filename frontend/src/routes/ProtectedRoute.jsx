import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, loading, status } = useAuthStore();
  const location = useLocation();

  /* ---------------- LOADING / VERIFYING STATE ---------------- */
  if (loading || status === "unknown" || status === "checking") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 font-mono text-xs text-neutral-500 dark:text-neutral-400">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-900 dark:text-white mb-1" />
        <span>AUTHENTICATING SESSION...</span>
      </div>
    );
  }

  /* ---------------- UNAUTHENTICATED ---------------- */
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  /* ---------------- AUTHORIZED ---------------- */
  return children;
};

export default ProtectedRoute;
