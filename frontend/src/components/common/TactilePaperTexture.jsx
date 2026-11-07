import React from "react";

export const TactilePaperTexture = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden isolate"
      id="vintage-paper-container"
      aria-hidden="true"
    >
      {/* Archival Paper Warm Wash & Vignette (Light mode) */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#EDE3CE]/30 to-[#DFCFA8]/40 mix-blend-multiply pointer-events-none dark:hidden" />

      {/* Additional Archival Fiber & Warm Parchment Tone Wash */}
      <div className="absolute inset-0 bg-[#F4EFE6] opacity-30 mix-blend-multiply pointer-events-none dark:hidden" />

      {/* Procedural Micro-Fibers & Paper Grain (feTurbulence) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30 dark:opacity-15 mix-blend-multiply dark:mix-blend-screen"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="vintagePaperTexture">
          <feTurbulence
            baseFrequency="0.035"
            numOctaves="5"
            result="noise"
            type="fractalNoise"
          />
          <feDiffuseLighting
            in="noise"
            lightingColor="#fff"
            result="light"
            surfaceScale="1.5"
          >
            <feDistantLight azimuth="55" elevation="42" />
          </feDiffuseLighting>
          <feComponentTransfer>
            <feFuncR intercept="0.05" slope="1.0" type="linear" />
            <feFuncG intercept="0.03" slope="0.96" type="linear" />
            <feFuncB intercept="0.0" slope="0.88" type="linear" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        <rect
          fill="#F6F2E7"
          filter="url(#vintagePaperTexture)"
          height="100%"
          width="100%"
        />
      </svg>

      {/* Fine Print Stipple / Pulp Specks & Fiber Grain with Enhanced Contrast */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="pulpNoise">
          <feTurbulence
            baseFrequency="0.65"
            numOctaves="4"
            stitchTiles="stitch"
            type="fractalNoise"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.18  0 0 0 0 0.13  0 0 0 0 0.08  0 0 0 0 0.8 0"
          />
        </filter>
        <rect filter="url(#pulpNoise)" height="100%" width="100%" />
      </svg>
    </div>
  );
};

export default TactilePaperTexture;
