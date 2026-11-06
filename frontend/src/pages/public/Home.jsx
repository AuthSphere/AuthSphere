import React from "react";
import LandingNavbar from "@/components/home/LandingNavbar";
import HeroSection from "@/components/home/HeroSection";
import BlueprintSection from "@/components/home/BlueprintSection";
import CapabilityMatrixSection from "@/components/home/CapabilityMatrixSection";
import DeveloperExperienceSection from "@/components/home/DeveloperExperienceSection";
import OpenSourceSection from "@/components/home/OpenSourceSection";
import FinalCtaSection from "@/components/home/FinalCtaSection";
import LandingFooter from "@/components/home/LandingFooter";

export const Home = () => {
  return (
    <div className="bg-white dark:bg-[#09090c] font-sans text-neutral-900 dark:text-neutral-100 antialiased selection:bg-neutral-900 selection:text-white transition-colors duration-300 min-h-screen relative overflow-x-hidden isolate">
      {/* Precision Engineering Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-white dark:bg-[#09090c]">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-neutral-200/40 dark:to-black/60" />
      </div>

      {/* Stitch Design System Header */}
      <LandingNavbar />

      {/* Main Landing Sections */}
      <main className="w-full pt-16 relative z-10 isolate">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Architectural Blueprint */}
        <BlueprintSection />

        {/* Section 3: Capability Matrix */}
        <CapabilityMatrixSection />

        {/* Section 4: Developer Experience */}
        <DeveloperExperienceSection />

        {/* Section 5: Architecture & Community */}
        <OpenSourceSection />

        {/* Section 6: Final CTA */}
        <FinalCtaSection />
      </main>

      {/* Stitch Design System Footer */}
      <div className="relative z-10 isolate">
        <LandingFooter />
      </div>
    </div>
  );
};

export default Home;
