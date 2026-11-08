import React from "react";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";
import TechSeparator from "@/components/common/TechSeparator";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * Production-grade Root and Section ErrorBoundary.
 * Catches uncaught runtime render errors, preventing application-wide whiteouts.
 * Provides a clean diagnostic fallback adhering to AuthSphere design standards.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log diagnostics in development or send to monitoring telemetry in production
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
        <div className="min-h-screen bg-[#fbf9f9] dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 antialiased flex flex-col justify-center items-center p-4 relative isolate">
          {/* Static Engineering Matrix Background */}
          <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#fbf9f9] dark:bg-[#09090c]">
            <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/50 dark:to-black/60" />
          </div>

          <div className="w-full max-w-lg space-y-4">
            <div className="rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] shadow-xs overflow-hidden">
              {/* Technical Header */}
              <div className="px-5 py-3 border-b border-neutral-200 dark:border-[#222329] bg-neutral-50/80 dark:bg-[#15161b] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center text-neutral-500">
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    ERR_RENDER_FAULT
                  </span>
                  <TechSeparator />
                  <span className="uppercase">ENCLAVE RECOVERY</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>FAULT DETECTED</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-8 text-center space-y-6">
                <div className="flex justify-center mb-2">
                  <div className="h-12 w-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-lg font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-white">
                    Application Interface Interrupted
                  </h1>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono max-w-sm mx-auto leading-relaxed">
                    An unexpected runtime exception was isolated by the
                    AuthSphere safety boundary. Your session and secure keys
                    remain unaffected.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button
                    onClick={this.handleReset}
                    className="w-full sm:w-auto h-9 px-5 font-mono text-xs bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-sm"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    RETRY ENCLAVE
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.location.href = "/";
                    }}
                    className="w-full sm:w-auto h-9 px-5 font-mono text-xs border-neutral-200 dark:border-[#2a2b33]"
                  >
                    <Home className="h-3.5 w-3.5 mr-1.5" />
                    RETURN HOME
                  </Button>
                </div>
              </div>

              {/* Telemetry Footer */}
              <div className="px-5 py-2.5 border-t border-neutral-200 dark:border-[#222329] bg-neutral-50/80 dark:bg-[#15161b] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>RECOVERY PROTOCOL: ISO-9126</span>
                <span>STATUS: ISOLATED</span>
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
