import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Cpu, ShieldAlert } from "lucide-react";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";
import TechSeparator from "@/components/common/TechSeparator";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#fbf9f9] dark:bg-[#09090c] text-neutral-900 dark:text-neutral-100 antialiased flex flex-col justify-center items-center p-4 relative isolate selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Precision Engineering Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#fbf9f9] dark:bg-[#09090c]">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/50 dark:to-black/60" />
      </div>

      <div className="w-full max-w-lg space-y-4">
        {/* Precision Card Shell */}
        <div className="rounded-xl border border-neutral-200 dark:border-[#222329] bg-white dark:bg-[#121316] shadow-xs overflow-hidden">
          {/* Technical Header */}
          <div className="px-5 py-3 border-b border-neutral-200 dark:border-[#222329] bg-neutral-50/80 dark:bg-[#15161b] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center text-neutral-500">
              <span className="font-bold text-neutral-900 dark:text-white">
                0x404
              </span>
              <TechSeparator />
              <span className="uppercase">ROUTE RESOLUTION FAILURE</span>
            </div>
            <span className="text-[10px] text-rose-500 font-mono font-semibold">
              STATUS: 404
            </span>
          </div>

          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center mb-2">
              <AuthSphereLogo className="h-8 w-auto" />
            </div>

            <div className="space-y-2">
              <div className="text-5xl font-mono font-bold tracking-tight text-neutral-900 dark:text-white">
                404
              </div>
              <h1 className="text-base font-bold font-mono uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Resource Endpoint Undefined
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono max-w-sm mx-auto leading-relaxed">
                The requested URL path or enclave route could not be resolved by
                the AuthSphere cryptographic gateway matrix.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                asChild
                className="w-full sm:w-auto h-9 px-5 font-mono text-xs bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-sm"
              >
                <Link to="/dashboard">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                  RETURN TO DASHBOARD
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto h-9 px-5 font-mono text-xs border-neutral-200 dark:border-[#2a2b33]"
              >
                <Link to="/docs">
                  <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                  VIEW DOCUMENTATION
                </Link>
              </Button>
            </div>
          </div>

          {/* Technical Telemetry Bar */}
          <div className="px-5 py-2.5 border-t border-neutral-200 dark:border-[#222329] bg-neutral-50/80 dark:bg-[#15161b] flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>GATEWAY: ZERO-TRUST ENCLAVE</span>
            <span>SPEC: RFC-7231</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
