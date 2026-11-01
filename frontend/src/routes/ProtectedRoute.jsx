import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  /* ---------------- LOADING STATE ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
