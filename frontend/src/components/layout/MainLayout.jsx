import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { WifiOff } from "lucide-react";

const MainLayout = ({ children, showNavAndFooter = true }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative z-0 overflow-hidden bg-background font-sans">
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground py-1 text-center text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <WifiOff className="h-3 w-3" />
          Offline Mode - Using Cached Data
        </div>
      )}

      {/* High-performance static grid background (0 CPU/GPU animation overhead) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-25 dark:opacity-35 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_85%)]" />

      <div className="relative z-10 flex flex-col min-h-screen bg-transparent">
        {showNavAndFooter && <Navbar />}
        <main className="flex-1 pb-20 md:pb-0">{children || <Outlet />}</main>
        {showNavAndFooter && <Footer />}
      </div>
    </div>
  );
};

export default MainLayout;
