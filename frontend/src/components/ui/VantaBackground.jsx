import React from "react";

/**
 * Performance-focused minimal auth background wrapper.
 * Replaced heavy Three.js / Vanta WebGL simulation with lightweight native CSS styling.
 */
const VantaBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col justify-center items-center overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 [background-image:radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
      {children}
    </div>
  );
};

export default VantaBackground;
