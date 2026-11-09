import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import BlueprintSection from "@/components/home/BlueprintSection";
import CapabilityMatrixSection from "@/components/home/CapabilityMatrixSection";
import DeveloperExperienceSection from "@/components/home/DeveloperExperienceSection";
import OpenSourceSection from "@/components/home/OpenSourceSection";
import FinalCtaSection from "@/components/home/FinalCtaSection";
import Footer from "@/components/layout/Footer";

export const Home = () => {
  return (
    <div className="bg-background font-sans text-foreground antialiased selection:bg-primary selection:text-primary-foreground transition-colors duration-300 min-h-screen relative overflow-x-hidden isolate">
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-background">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-muted/40 dark:to-black/60" />
      </div>

      <Navbar />

      <main className="w-full pt-16 relative z-10 isolate">
        <HeroSection />

        <BlueprintSection />

        <CapabilityMatrixSection />

        <DeveloperExperienceSection />

        <OpenSourceSection />

        <FinalCtaSection />
      </main>

      <div className="relative z-10 isolate">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
