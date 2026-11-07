import React, { useEffect, useMemo, useState, useRef } from "react";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";

export default function CommunityTopology() {
  const [phase, setPhase] = useState(0);
  const animFrameRef = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Ultra-slow harmonic breathing cycle (~48 seconds per oscillation)
      // Subtle delta of 0.045 radians (~2.5°) preserves pristine curve geometry
      const p = Math.sin(elapsed * 0.00013) * 0.045;
      setPhase(p);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Center coordinate of mathematical visual (placed slightly right of center)
  const cx = 580;
  const cy = 360;
  const scale = 265;

  // 1. Primary Full-Coupled Harmonic Curve (Vivid Emerald Green):
  // x(t) = 0.72 sin(3t) + 0.24 sin(8t + π/5 + δ) + 0.11 cos(13t)
  // y(t) = 0.72 cos(4t) + 0.22 cos(7t − π/7 + δ) + 0.10 sin(11t)
  const emeraldPath = useMemo(() => {
    const N = 1200;
    const points = [];
    const phi1 = Math.PI / 5 + phase;
    const phi2 = -Math.PI / 7 + phase * 0.8;

    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const x =
        0.72 * Math.sin(3 * t) +
        0.24 * Math.sin(8 * t + phi1) +
        0.11 * Math.cos(13 * t);
      const y =
        0.72 * Math.cos(4 * t) +
        0.22 * Math.cos(7 * t + phi2) +
        0.1 * Math.sin(11 * t);

      const px = (cx + x * scale).toFixed(2);
      const py = (cy - y * scale).toFixed(2);

      if (i === 0) points.push(`M ${px} ${py}`);
      else points.push(`L ${px} ${py}`);
    }
    points.push("Z");
    return points.join(" ");
  }, [phase, cx, cy, scale]);

  // 2. Fundamental Carrier Orbit (Electric Cyan):
  // Captures the dominant (3, 4) base frequencies with secondary (8, 7) resonance
  const cyanPath = useMemo(() => {
    const N = 1000;
    const points = [];
    const p1 = Math.PI / 5 + phase * 0.9;
    const p2 = -Math.PI / 7 + phase * 0.7;

    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const x = 0.7 * Math.sin(3 * t) + 0.2 * Math.sin(8 * t + p1);
      const y = 0.7 * Math.cos(4 * t) + 0.18 * Math.cos(7 * t + p2);

      const px = (cx + x * scale).toFixed(2);
      const py = (cy - y * scale).toFixed(2);

      if (i === 0) points.push(`M ${px} ${py}`);
      else points.push(`L ${px} ${py}`);
    }
    points.push("Z");
    return points.join(" ");
  }, [phase, cx, cy, scale]);

  // 3. High-Frequency Harmonic Dispersion Curve (Electric Violet):
  // Amplifies the tertiary perturbation frequencies (13, 11) with phase offset
  const violetPath = useMemo(() => {
    const N = 900;
    const points = [];
    const p1 = Math.PI / 5 + Math.PI / 10 + phase * 0.5;
    const p2 = -Math.PI / 7 - Math.PI / 10 + phase * 0.4;

    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const x =
        0.66 * Math.sin(3 * t + 0.12) +
        0.18 * Math.sin(8 * t + p1) +
        0.13 * Math.cos(13 * t);
      const y =
        0.66 * Math.cos(4 * t - 0.12) +
        0.16 * Math.cos(7 * t + p2) +
        0.13 * Math.sin(11 * t);

      const px = (cx + x * scale).toFixed(2);
      const py = (cy - y * scale).toFixed(2);

      if (i === 0) points.push(`M ${px} ${py}`);
      else points.push(`L ${px} ${py}`);
    }
    points.push("Z");
    return points.join(" ");
  }, [phase, cx, cy, scale]);

  // 4. Harmonic Soliton Filament (Luminous Amber / Coral):
  // Intersecting counter-harmonic contour
  const amberPath = useMemo(() => {
    const N = 800;
    const points = [];
    const p1 = Math.PI / 5 - Math.PI / 8 + phase * 0.6;
    const p2 = -Math.PI / 7 + Math.PI / 8 + phase * 0.5;

    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const x =
        0.62 * Math.sin(3 * t - 0.1) +
        0.16 * Math.sin(8 * t + p1) +
        0.08 * Math.cos(13 * t);
      const y =
        0.62 * Math.cos(4 * t + 0.1) +
        0.14 * Math.cos(7 * t + p2) +
        0.08 * Math.sin(11 * t);

      const px = (cx + x * scale).toFixed(2);
      const py = (cy - y * scale).toFixed(2);

      if (i === 0) points.push(`M ${px} ${py}`);
      else points.push(`L ${px} ${py}`);
    }
    points.push("Z");
    return points.join(" ");
  }, [phase, cx, cy, scale]);

  // Radian Node Annotations (π/3, 2π/3, 7π/6)
  const annotations = useMemo(() => {
    const angles = [
      {
        rad: Math.PI / 3,
        label: "π/3",
        textAnchor: "start",
        dx: 14,
        dy: -4,
        color: "#00E5FF",
      },
      {
        rad: (2 * Math.PI) / 3,
        label: "2π/3",
        textAnchor: "end",
        dx: -14,
        dy: -4,
        color: "#10B981",
      },
      {
        rad: (7 * Math.PI) / 6,
        label: "7π/6",
        textAnchor: "end",
        dx: -14,
        dy: 14,
        color: "#A78BFA",
      },
    ];

    return angles.map(({ rad, label, textAnchor, dx, dy, color }) => {
      const x = cx + Math.cos(rad) * scale;
      const y = cy - Math.sin(rad) * scale;
      return {
        x,
        y,
        label,
        textAnchor,
        lx: x + dx,
        ly: y + dy,
        color,
      };
    });
  }, [cx, cy, scale]);

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#080909] text-neutral-900 dark:text-white select-none isolate transition-colors duration-300">
      <style>{`
        @keyframes draw-curve-sweep {
          from {
            stroke-dashoffset: 4200;
            opacity: 0.1;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        .curve-anim-emerald {
          stroke-dasharray: 4200;
          stroke-dashoffset: 0;
          animation: draw-curve-sweep 2.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .curve-anim-cyan {
          stroke-dasharray: 3800;
          stroke-dashoffset: 0;
          animation: draw-curve-sweep 2.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }

        .curve-anim-violet {
          stroke-dasharray: 3400;
          stroke-dashoffset: 0;
          animation: draw-curve-sweep 3.0s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
        }

        .curve-anim-amber {
          stroke-dasharray: 3000;
          stroke-dashoffset: 0;
          animation: draw-curve-sweep 3.2s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .curve-anim-emerald, .curve-anim-cyan, .curve-anim-violet, .curve-anim-amber {
            animation: none;
            stroke-dasharray: none;
          }
        }
      `}</style>

      {/* ================= AUTHENTIC AUTHPHERE BRAND HEADER ================= */}
      <div className="absolute top-8 left-8 sm:top-12 sm:left-14 flex items-center gap-3 select-none z-20">
        <AuthSphereLogo className="w-8 h-8 object-contain" />
        <span className="font-semibold text-[17px] tracking-tight text-neutral-900 dark:text-white font-sans">
          AuthSphere
        </span>
      </div>

      <svg
        viewBox="0 0 960 720"
        className="w-full h-full object-contain overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Multicolor harmonic parametric curve visualization"
      >
        <defs>
          {/* Theme-Adaptive Subtle Cartesian Background Grid */}
          <pattern
            id="adaptiveMathGrid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="currentColor"
              className="text-neutral-900/4 dark:text-white/2"
              strokeWidth="0.75"
            />
          </pattern>
        </defs>

        {/* Ambient Grid Layer */}
        <rect width="100%" height="100%" fill="url(#adaptiveMathGrid)" />

        {/* ================= 1. PURPOSEFUL EDITORIAL TYPOGRAPHY ================= */}
        {/* Title & Harmonic Field Subtitle */}
        <g transform="translate(68, 185)">
          <text
            x="0"
            y="0"
            className="fill-emerald-600 dark:fill-[#00E68A] font-mono text-[10px] font-semibold"
            letterSpacing="0.2em"
          >
            COMPLEX HARMONIC FIELD
          </text>
          <text
            x="0"
            y="26"
            className="fill-neutral-900 dark:fill-white font-sans text-[19px] font-semibold"
            letterSpacing="0.04em"
          >
            PARAMETRIC EQUATION
          </text>
        </g>

        {/* Mathematical Formulas (Accurate, Tabular, Beautifully Typeset) */}
        <g transform="translate(68, 285)">
          {/* x(t) Equation */}
          <text
            x="0"
            y="0"
            className="fill-neutral-800 dark:fill-neutral-100 font-mono text-[11px]"
            letterSpacing="0.04em"
          >
            x(t) = 0.72 sin(3t) + 0.24 sin(8t + π/5) + 0.11 cos(13t)
          </text>

          {/* y(t) Equation */}
          <text
            x="0"
            y="24"
            className="fill-neutral-800 dark:fill-neutral-100 font-mono text-[11px]"
            letterSpacing="0.04em"
          >
            y(t) = 0.72 cos(4t) + 0.22 cos(7t − π/7) + 0.10 sin(11t)
          </text>

          {/* Domain Interval */}
          <text
            x="0"
            y="54"
            className="fill-neutral-500 dark:fill-neutral-400 font-mono text-[10px]"
            letterSpacing="0.08em"
          >
            where t ∈ [0, 2π]
          </text>
        </g>

        {/* Harmonic Multi-Frequency Spectrum Key */}
        <g transform="translate(68, 410)">
          <line
            x1="0"
            y1="0"
            x2="250"
            y2="0"
            className="stroke-neutral-200 dark:stroke-neutral-800"
            strokeWidth="0.75"
          />

          <g className="font-mono text-[9px]" letterSpacing="0.05em">
            <text
              x="0"
              y="24"
              className="fill-neutral-400 dark:fill-neutral-500 text-[8px] uppercase tracking-wider"
            >
              SPECTRAL DECOMPOSITION
            </text>

            {/* Emerald Channel */}
            <circle
              cx="4"
              cy="46"
              r="3"
              className="fill-emerald-500 dark:fill-[#00E68A]"
            />
            <text
              x="14"
              y="49"
              className="fill-neutral-800 dark:fill-neutral-200"
            >
              Full Coupled Harmonic
            </text>
            <text x="180" y="49" className="fill-neutral-500 font-medium">
              ω = (3, 4, 8, 7, 13, 11)
            </text>

            {/* Cyan Channel */}
            <circle
              cx="4"
              cy="68"
              r="3"
              className="fill-cyan-600 dark:fill-[#00E5FF]"
            />
            <text
              x="14"
              y="71"
              className="fill-neutral-800 dark:fill-neutral-200"
            >
              Carrier Base Orbit
            </text>
            <text x="180" y="71" className="fill-neutral-500 font-medium">
              ω₁ = (3, 4), A₁ = 0.72
            </text>

            {/* Violet Channel */}
            <circle
              cx="4"
              cy="90"
              r="3"
              className="fill-violet-600 dark:fill-[#A78BFA]"
            />
            <text
              x="14"
              y="93"
              className="fill-neutral-800 dark:fill-neutral-200"
            >
              Perturbation Modes
            </text>
            <text x="180" y="93" className="fill-neutral-500 font-medium">
              ω₃ = (13, 11), A₃ = 0.11
            </text>

            {/* Amber Channel */}
            <circle
              cx="4"
              cy="112"
              r="3"
              className="fill-amber-600 dark:fill-[#F59E0B]"
            />
            <text
              x="14"
              y="115"
              className="fill-neutral-800 dark:fill-neutral-200"
            >
              Resonant Phase Shift
            </text>
            <text x="180" y="115" className="fill-neutral-500 font-medium">
              φ = (π/5, −π/7)
            </text>
          </g>

          <line
            x1="0"
            y1="130"
            x2="250"
            y2="130"
            className="stroke-neutral-200 dark:stroke-neutral-800"
            strokeWidth="0.75"
          />
        </g>

        {/* ================= 2. COORDINATE FRAME & REFERENCE GEOMETRY ================= */}
        {/* Outer Unit Reference Circle (r = 1.0 -> 265px) */}
        <circle
          cx={cx}
          cy={cy}
          r={scale}
          fill="none"
          className="stroke-neutral-300 dark:stroke-white/8"
          strokeDasharray="2 4"
          strokeWidth="0.75"
        />

        {/* Intermediate Carrier Reference Circle (r = 0.72 -> 191px) */}
        <circle
          cx={cx}
          cy={cy}
          r={scale * 0.72}
          fill="none"
          className="stroke-cyan-500/25 dark:stroke-cyan-400/15"
          strokeDasharray="3 5"
          strokeWidth="0.75"
        />

        {/* Fine Cartesian Coordinate Axes */}
        <g
          className="stroke-neutral-300 dark:stroke-white/12"
          strokeWidth="0.75"
        >
          {/* Horizontal X Axis */}
          <line x1={cx - scale - 30} y1={cy} x2={cx + scale + 30} y2={cy} />
          {/* Vertical Y Axis */}
          <line x1={cx} y1={cy - scale - 30} x2={cx} y2={cy + scale + 30} />
        </g>

        {/* Coordinate Axis Ticks & Numerical Notations */}
        <g
          className="fill-neutral-400 dark:fill-neutral-500 font-mono text-[7.5px]"
          stroke="none"
        >
          {/* Horizontal Ticks */}
          <line
            x1={cx - scale}
            y1={cy - 4}
            x2={cx - scale}
            y2={cy + 4}
            className="stroke-neutral-300 dark:stroke-white/20"
            strokeWidth="0.75"
          />
          <text x={cx - scale} y={cy + 16} textAnchor="middle">
            −1.0
          </text>

          <line
            x1={cx + scale}
            y1={cy - 4}
            x2={cx + scale}
            y2={cy + 4}
            className="stroke-neutral-300 dark:stroke-white/20"
            strokeWidth="0.75"
          />
          <text x={cx + scale} y={cy + 16} textAnchor="middle">
            +1.0
          </text>

          {/* Vertical Ticks */}
          <line
            x1={cx - 4}
            y1={cy - scale}
            x2={cx + 4}
            y2={cy - scale}
            className="stroke-neutral-300 dark:stroke-white/20"
            strokeWidth="0.75"
          />
          <text x={cx - 10} y={cy - scale + 3} textAnchor="end">
            +1.0
          </text>

          <line
            x1={cx - 4}
            y1={cy + scale}
            x2={cx + 4}
            y2={cy + scale}
            className="stroke-neutral-300 dark:stroke-white/20"
            strokeWidth="0.75"
          />
          <text x={cx - 10} y={cy + scale + 3} textAnchor="end">
            −1.0
          </text>

          <text x={cx - 8} y={cy + 12} textAnchor="end">
            0.0
          </text>
        </g>

        {/* Radian Reference Rays & Intersection Nodes (π/3, 2π/3, 7π/6) */}
        {annotations.map((ann, idx) => (
          <g key={idx}>
            {/* Dashed Ray from Center to Circle Boundary */}
            <line
              x1={cx}
              y1={cy}
              x2={ann.x}
              y2={ann.y}
              className="stroke-neutral-400/40 dark:stroke-neutral-500/30"
              strokeDasharray="2 4"
              strokeWidth="0.75"
            />
            {/* Reticle Node at Intersection */}
            <circle
              cx={ann.x}
              cy={ann.y}
              r="3.5"
              fill="none"
              stroke={ann.color}
              strokeOpacity="0.8"
              strokeWidth="0.85"
            />
            <circle cx={ann.x} cy={ann.y} r="1.2" fill={ann.color} />

            {/* Radian Notation Label */}
            <text
              x={ann.lx}
              y={ann.ly}
              textAnchor={ann.textAnchor}
              className="fill-neutral-600 dark:fill-neutral-300 font-mono text-[9px] font-semibold"
              letterSpacing="0.04em"
            >
              {ann.label}
            </text>
          </g>
        ))}

        {/* Center Coordinate Origin Pivot */}
        <circle
          cx={cx}
          cy={cy}
          r="2.5"
          fill="none"
          className="stroke-neutral-400 dark:stroke-white/40"
          strokeWidth="0.75"
        />
        <circle
          cx={cx}
          cy={cy}
          r="1"
          className="fill-neutral-900 dark:fill-white"
        />

        {/* ================= 3. MULTI-COLOR HARMONIC PARAMETRIC GRAPH ================= */}
        {/* Layer 4: Luminous Amber Resonance Orbit */}
        <path
          d={amberPath}
          fill="none"
          className="stroke-amber-500/70 dark:stroke-[#F59E0B]/75 curve-anim-amber"
          strokeWidth="0.9"
        />

        {/* Layer 3: Electric Violet Perturbation Modes */}
        <path
          d={violetPath}
          fill="none"
          className="stroke-violet-600/75 dark:stroke-[#A78BFA]/80 curve-anim-violet"
          strokeWidth="1.0"
        />

        {/* Layer 2: Electric Cyan Carrier Base Orbit */}
        <path
          d={cyanPath}
          fill="none"
          className="stroke-cyan-600 dark:stroke-[#00E5FF] curve-anim-cyan"
          strokeWidth="1.2"
        />

        {/* Layer 1: Main Full-Coupled Harmonic Curve (Vivid Emerald Green) */}
        <path
          d={emeraldPath}
          fill="none"
          className="stroke-emerald-600 dark:stroke-[#00E68A] curve-anim-emerald"
          strokeWidth="1.35"
        />
      </svg>
    </div>
  );
}
