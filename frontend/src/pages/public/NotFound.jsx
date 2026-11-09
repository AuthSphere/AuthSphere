import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";
import useAuthStore from "@/store/authStore";

export const NotFound = () => {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col justify-center items-center p-4 relative isolate selection:bg-primary selection:text-primary-foreground">
      <div className="w-full max-w-lg space-y-4">
        <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center mb-2">
              <AuthSphereLogo className="h-8 w-auto" />
            </div>

            <div className="space-y-2">
              <div className="text-5xl font-mono font-bold tracking-tight text-foreground">
                404
              </div>
              <h1 className="text-base font-bold font-mono uppercase tracking-wider text-foreground">
                Resource Endpoint Undefined
              </h1>
              <p className="text-xs text-muted-foreground font-mono max-w-sm mx-auto leading-relaxed">
                The requested URL path or enclave route could not be resolved by
                the AuthSphere cryptographic gateway matrix.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                asChild
                className="w-full sm:w-auto h-9 px-5 font-mono text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                {user ? (
                  <Link to="/dashboard">
                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                    RETURN TO DASHBOARD
                  </Link>
                ) : (
                  <Link to="/">
                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                    RETURN HOME
                  </Link>
                )}
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto h-9 px-5 font-mono text-xs border-border"
              >
                <Link to="/docs">
                  <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                  VIEW DOCUMENTATION
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
