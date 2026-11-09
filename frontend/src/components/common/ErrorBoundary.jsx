import React from "react";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";
import TechSeparator from "@/components/common/TechSeparator";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AuthSphere ErrorBoundary captured error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === "function"
          ? this.props.fallback({
              error: this.state.error,
              reset: this.handleReset,
            })
          : this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background text-foreground antialiased flex flex-col justify-center items-center p-4 relative isolate">
          <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-background">
            <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/50 dark:to-black/60" />
          </div>

          <div className="w-full max-w-lg space-y-4">
            <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
              <div className="p-8 text-center space-y-6">
                <div className="flex justify-center mb-2">
                  <div className="h-12 w-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-lg font-bold font-mono uppercase tracking-wider text-foreground">
                    Application Interface Interrupted
                  </h1>
                  <p className="text-xs text-muted-foreground font-mono max-w-sm mx-auto leading-relaxed">
                    An unexpected runtime exception was isolated by the
                    AuthSphere safety boundary. Your session and secure keys
                    remain unaffected.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button
                    onClick={this.handleReset}
                    className="w-full sm:w-auto h-9 px-5 font-mono text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    RETRY ENCLAVE
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.location.href = "/";
                    }}
                    className="w-full sm:w-auto h-9 px-5 font-mono text-xs border-border"
                  >
                    <Home className="h-3.5 w-3.5 mr-1.5" />
                    RETURN HOME
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
