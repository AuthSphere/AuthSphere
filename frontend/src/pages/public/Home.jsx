import React from "react";
import TactilePaperTexture from "@/components/common/TactilePaperTexture";
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
    <div className="bg-[#F6F4EE] dark:bg-[#09090c] font-sans text-neutral-900 dark:text-neutral-100 antialiased selection:bg-neutral-900 selection:text-white transition-colors duration-300 min-h-screen relative overflow-x-hidden isolate">
      {/* Procedural Vintage Paper Texture strictly in background (-z-10) */}
      <TactilePaperTexture />

      {/* Stitch Design System Header */}
      <LandingNavbar />

      {/* Main Landing Sections (elevated at z-10 with isolate so texture never affects content, text, or diagrams) */}
      <main className="w-full pt-16 relative z-10 isolate">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Architectural Blueprint */}
        <BlueprintSection />

        {/* Section 3: Capability Matrix */}
        <CapabilityMatrixSection />

        {/* Section 4: Developer Experience */}
        <DeveloperExperienceSection />

        {/* Section 5: Open Source Community */}
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
