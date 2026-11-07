import React, { useEffect, useMemo, useState, useRef } from "react";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";

export const ArchitectureSpecification = ({ className = "" }) => {
  const [phase, setPhase] = useState(0);
  const [probeTime, setProbeTime] = useState(0);
  const animFrameRef = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Ultra-slow harmonic breathing cycle (~44 seconds per cycle)
      const p = Math.sin(elapsed * 0.00014) * 0.045;
      setPhase(p);

      // Orbital flight parameter advancing along the manifold
      setProbeTime(elapsed * 0.0004);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Center coordinate of astrodynamics coordinate frame
  const cx = 590;
  const cy = 360;
  const scale = 255;

  // 1. Primary Resonant Three-Body Transfer Manifold (Vivid Emerald Green)
  // x(t) = 0.58 cos(t) + 0.28 cos(4t + φ₁) - 0.12 cos(7t)
  // y(t) = 0.58 sin(t) - 0.28 sin(4t + φ₂) + 0.12 sin(7t)
  const emeraldPath = useMemo(() => {
    const N = 1200;
    const points = [];
    const phi1 = Math.PI / 6 + phase;
    const phi2 = -Math.PI / 4 + phase * 0.85;

    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const x =
        0.58 * Math.cos(t) +
        0.28 * Math.cos(4 * t + phi1) -
        0.12 * Math.cos(7 * t);
      const y =
        0.58 * Math.sin(t) -
        0.28 * Math.sin(4 * t + phi2) +
        0.12 * Math.sin(7 * t);

      const px = (cx + x * scale).toFixed(2);
      const py = (cy - y * scale).toFixed(2);

      if (i === 0) points.push(`M ${px} ${py}`);
      else points.push(`L ${px} ${py}`);
    }
    points.push("Z");
    return points.join(" ");
  }, [phase, cx, cy, scale]);

  // 2. Collinear L1/L2 Halo Quasi-Periodic Libration Orbit (Electric Cyan)
  // x(t) = 0.65 cos(2t) + 0.18 cos(5t + φ₁)
  // y(t) = 0.44 sin(2t) + 0.15 sin(5t + φ₂)
  const cyanPath = useMemo(() => {
    const N = 1000;
    const points = [];
    const p1 = Math.PI / 6 + phase * 0.9;
    const p2 = -Math.PI / 4 + phase * 0.7;

    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const x = 0.65 * Math.cos(2 * t) + 0.18 * Math.cos(5 * t + p1);
      const y = 0.44 * Math.sin(2 * t) + 0.15 * Math.sin(5 * t + p2);

      const px = (cx + x * scale).toFixed(2);
      const py = (cy - y * scale).toFixed(2);

      if (i === 0) points.push(`M ${px} ${py}`);
      else points.push(`L ${px} ${py}`);
    }
    points.push("Z");
    return points.join(" ");
  }, [phase, cx, cy, scale]);

  // 3. Jacobi Zero-Velocity Equipotential Boundary Contour (Electric Violet)
  // Non-linear Hill energy manifold surface
  const violetPath = useMemo(() => {
    const N = 900;
    const points = [];
    const p1 = Math.PI / 4 + phase * 0.5;
    const p2 = -Math.PI / 5 + phase * 0.4;

    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const x =
        0.75 * Math.cos(t) +
        0.16 * Math.cos(3 * t + p1) +
        0.08 * Math.cos(9 * t);
      const y =
        0.72 * Math.sin(t) +
        0.15 * Math.sin(3 * t + p2) -
        0.08 * Math.sin(9 * t);

      const px = (cx + x * scale).toFixed(2);
      const py = (cy - y * scale).toFixed(2);

      if (i === 0) points.push(`M ${px} ${py}`);
      else points.push(`L ${px} ${py}`);
    }
    points.push("Z");
    return points.join(" ");
  }, [phase, cx, cy, scale]);

  // 4. Hyperbolic Escape & Gravity Assist Asymptote Filament (Luminous Amber)
  const amberPath = useMemo(() => {
    const N = 800;
    const points = [];
    const p1 = Math.PI / 5 + phase * 0.6;
    const p2 = -Math.PI / 6 + phase * 0.5;

    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const x =
        0.52 * Math.cos(3 * t - 0.12) +
        0.22 * Math.cos(6 * t + p1) +
        0.08 * Math.sin(11 * t);
      const y =
        0.5 * Math.sin(3 * t + 0.12) -
        0.2 * Math.sin(6 * t + p2) +
        0.08 * Math.cos(11 * t);

      const px = (cx + x * scale).toFixed(2);
      const py = (cy - y * scale).toFixed(2);

      if (i === 0) points.push(`M ${px} ${py}`);
      else points.push(`L ${px} ${py}`);
    }
    points.push("Z");
    return points.join(" ");
  }, [phase, cx, cy, scale]);

  // Real-time Flight Probe Position & Velocity Vector
  const { probePx, probePy, arrowEndX, arrowEndY, liveVelocity } =
    useMemo(() => {
      const p1 = Math.PI / 6 + phase;
      const p2 = -Math.PI / 4 + phase * 0.85;
      const u = probeTime % (2 * Math.PI);
      const x =
        0.58 * Math.cos(u) +
        0.28 * Math.cos(4 * u + p1) -
        0.12 * Math.cos(7 * u);
      const y =
        0.58 * Math.sin(u) -
        0.28 * Math.sin(4 * u + p2) +
        0.12 * Math.sin(7 * u);

      const px = cx + x * scale;
      const py = cy - y * scale;

      // Instantaneous numerical derivative for velocity tangent
      const du = 0.01;
      const u1 = u + du;
      const u0 = u - du;
      const dx =
        (0.58 * Math.cos(u1) +
          0.28 * Math.cos(4 * u1 + p1) -
          0.12 * Math.cos(7 * u1) -
          (0.58 * Math.cos(u0) +
            0.28 * Math.cos(4 * u0 + p1) -
            0.12 * Math.cos(7 * u0))) /
        (2 * du);
      const dy =
        (0.58 * Math.sin(u1) -
          0.28 * Math.sin(4 * u1 + p2) +
          0.12 * Math.sin(7 * u1) -
          (0.58 * Math.sin(u0) -
            0.28 * Math.sin(4 * u0 + p2) +
            0.12 * Math.sin(7 * u0))) /
        (2 * du);

      const speed = Math.sqrt(dx * dx + dy * dy);
      const normDx = speed > 0 ? dx / speed : 1;
      const normDy = speed > 0 ? dy / speed : 0;
      const arrowLen = 30;

      return {
        probePx: px,
        probePy: py,
        arrowEndX: px + normDx * arrowLen,
        arrowEndY: py - normDy * arrowLen,
        liveVelocity: (7.84 + speed * 2.85).toFixed(2),
      };
    }, [probeTime, phase, cx, cy, scale]);

  // Primary & Secondary Gravitational Centers
  const primaryMassX = cx - 0.16 * scale;
  const primaryMassY = cy;
  const secondaryMassX = cx + 0.78 * scale;
  const secondaryMassY = cy;

  // Lagrange Libration Points in Synodic Frame
  const lagrangePoints = [
    {
      id: "L1",
      name: "L₁",
      x: cx + 0.62 * scale,
      y: cy,
      labelDx: 0,
      labelDy: -12,
    },
    {
      id: "L2",
      name: "L₂",
      x: cx + 0.94 * scale,
      y: cy,
      labelDx: 12,
      labelDy: 3,
    },
    {
      id: "L3",
      name: "L₃",
      x: cx - 0.94 * scale,
      y: cy,
      labelDx: -14,
      labelDy: 3,
    },
    {
      id: "L4",
      name: "L₄",
      x: cx + Math.cos(Math.PI / 3) * 0.78 * scale,
      y: cy - Math.sin(Math.PI / 3) * 0.78 * scale,
      labelDx: 8,
      labelDy: -8,
    },
    {
      id: "L5",
      name: "L₅",
      x: cx + Math.cos(-Math.PI / 3) * 0.78 * scale,
      y: cy - Math.sin(-Math.PI / 3) * 0.78 * scale,
      labelDx: 8,
      labelDy: 14,
    },
  ];

  return (
    <div
      className={`absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#080909] text-neutral-900 dark:text-white select-none isolate transition-colors duration-300 ${className}`}
    >
      <style>{`
        @keyframes draw-orbit-sweep {
          from {
            stroke-dashoffset: 4200;
            opacity: 0.1;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        .orbit-anim-emerald {
          stroke-dasharray: 4200;
          stroke-dashoffset: 0;
          animation: draw-orbit-sweep 2.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .orbit-anim-cyan {
          stroke-dasharray: 3800;
          stroke-dashoffset: 0;
          animation: draw-orbit-sweep 2.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }

        .orbit-anim-violet {
          stroke-dasharray: 3400;
          stroke-dashoffset: 0;
          animation: draw-orbit-sweep 3.0s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
        }

        .orbit-anim-amber {
          stroke-dasharray: 3000;
          stroke-dashoffset: 0;
          animation: draw-orbit-sweep 3.2s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .orbit-anim-emerald, .orbit-anim-cyan, .orbit-anim-violet, .orbit-anim-amber {
            animation: none;
            stroke-dasharray: none;
          }
        }
      `}</style>

      {/* Brand Header */}
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
        aria-label="Celestial Mechanics and Astrodynamic Manifold Visualization"
      >
        <defs>
          {/* Subtle Cartesian Grid */}
          <pattern
            id="astroGrid"
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

          {/* Velocity Vector Arrowhead */}
          <marker
            id="velocityArrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M 0 1 L 7 4 L 0 7 Z" fill="#00E68A" />
          </marker>
        </defs>

        {/* Ambient Grid Layer */}
        <rect width="100%" height="100%" fill="url(#astroGrid)" />

        {/* ================= 1. ASTRODYNAMICS & ROCKET SCIENCE TYPOGRAPHY ================= */}
        <g transform="translate(68, 155)">
          <text
            x="0"
            y="0"
            className="fill-emerald-600 dark:fill-[#00E68A] font-mono text-[10px] font-semibold"
            letterSpacing="0.2em"
          >
            ASTRODYNAMICS // CELESTIAL MECHANICS
          </text>
          <text
            x="0"
            y="26"
            className="fill-neutral-900 dark:fill-white font-sans text-[19px] font-semibold"
            letterSpacing="0.04em"
          >
            CIRCULAR RESTRICTED 3-BODY
          </text>
        </g>

        {/* Rocket Science Equations */}
        <g transform="translate(68, 235)">
          {/* Tsiolkovsky & Vis-Viva */}
          <text
            x="0"
            y="0"
            className="fill-neutral-800 dark:fill-neutral-100 font-mono text-[11px]"
            letterSpacing="0.04em"
          >
            Δv = Isp · g₀ · ln(m₀/mf) | v² = μ(2/r − 1/a)
          </text>

          {/* Jacobi Constant */}
          <text
            x="0"
            y="24"
            className="fill-neutral-800 dark:fill-neutral-100 font-mono text-[11px]"
            letterSpacing="0.04em"
          >
            CJ = 2Ω(x, y) − (ẋ² + ẏ²), Ω = ½(x² + y²) + (1−μ)/r₁ + μ/r₂
          </text>

          {/* Equations of Motion in Synodic Frame */}
          <text
            x="0"
            y="48"
            className="fill-neutral-800 dark:fill-neutral-100 font-mono text-[11px]"
            letterSpacing="0.04em"
          >
            ẍ − 2ωẏ = ∂Ω/∂x, ÿ + 2ωẋ = ∂Ω/∂y
          </text>

          {/* Parametric Manifold Trajectory */}
          <text
            x="0"
            y="74"
            className="fill-neutral-700 dark:fill-neutral-300 font-mono text-[10.5px]"
            letterSpacing="0.03em"
          >
            x(t) = 0.58 cos(t) + 0.28 cos(4t + φ₁) − 0.12 cos(7t)
          </text>

          <text
            x="0"
            y="96"
            className="fill-neutral-700 dark:fill-neutral-300 font-mono text-[10.5px]"
            letterSpacing="0.03em"
          >
            y(t) = 0.58 sin(t) − 0.28 sin(4t + φ₂) + 0.12 sin(7t)
          </text>

          {/* Mass Ratio & Ephemeris Domain */}
          <text
            x="0"
            y="124"
            className="fill-neutral-500 dark:fill-neutral-400 font-mono text-[10px]"
            letterSpacing="0.06em"
          >
            where t ∈ [0, 2π], μ = m₂/(m₁ + m₂) = 0.01215 (Earth-Moon)
          </text>
        </g>

        {/* Propulsion & Orbital Parameters Key */}
        <g transform="translate(68, 415)">
          <line
            x1="0"
            y1="0"
            x2="260"
            y2="0"
            className="stroke-neutral-200 dark:stroke-neutral-800"
            strokeWidth="0.75"
          />

          <g className="font-mono text-[9px]" letterSpacing="0.05em">
            <text
              x="0"
              y="22"
              className="fill-neutral-400 dark:fill-neutral-500 text-[8px] uppercase tracking-wider"
            >
              ORBITAL STATE MANIFOLD
            </text>

            {/* Emerald Channel */}
            <circle
              cx="4"
              cy="44"
              r="3"
              className="fill-emerald-500 dark:fill-[#00E68A]"
            />
            <text
              x="14"
              y="47"
              className="fill-neutral-800 dark:fill-neutral-200"
            >
              Resonant Transfer Manifold
            </text>
            <text x="180" y="47" className="fill-neutral-500 font-medium">
              CJ = 3.0142, Δv = 3.12 km/s
            </text>

            {/* Cyan Channel */}
            <circle
              cx="4"
              cy="66"
              r="3"
              className="fill-cyan-600 dark:fill-[#00E5FF]"
            />
            <text
              x="14"
              y="69"
              className="fill-neutral-800 dark:fill-neutral-200"
            >
              Collinear L₁/L₂ Halo Orbit
            </text>
            <text x="180" y="69" className="fill-neutral-500 font-medium">
              Ax = 206,000 km, e = 0.054
            </text>

            {/* Violet Channel */}
            <circle
              cx="4"
              cy="88"
              r="3"
              className="fill-violet-600 dark:fill-[#A78BFA]"
            />
            <text
              x="14"
              y="91"
              className="fill-neutral-800 dark:fill-neutral-200"
            >
              Jacobi Zero-Velocity Hill
            </text>
            <text x="180" y="91" className="fill-neutral-500 font-medium">
              Equipotential Boundary Ω₀
            </text>

            {/* Amber Channel */}
            <circle
              cx="4"
              cy="110"
              r="3"
              className="fill-amber-600 dark:fill-[#F59E0B]"
            />
            <text
              x="14"
              y="113"
              className="fill-neutral-800 dark:fill-neutral-200"
            >
              Hyperbolic Escape Vector
            </text>
            <text x="180" y="113" className="fill-neutral-500 font-medium">
              v_inf = 1.414 km/s, θ = 45.2°
            </text>
          </g>

          <line
            x1="0"
            y1="128"
            x2="260"
            y2="128"
            className="stroke-neutral-200 dark:stroke-neutral-800"
            strokeWidth="0.75"
          />

          {/* Live Orbital Telemetry */}
          <g transform="translate(0, 148)" className="font-mono text-[9.5px]">
            <text
              x="0"
              y="0"
              className="fill-neutral-400 dark:fill-neutral-500 text-[8px] uppercase tracking-wider"
            >
              LIVE PROBE TELEMETRY
            </text>
            <text
              x="0"
              y="18"
              className="fill-emerald-600 dark:fill-[#00E68A] font-semibold"
            >
              VELOCITY: {liveVelocity} km/s
            </text>
          </g>
        </g>

        {/* ================= 2. ASTRODYNAMICS REFERENCE FRAME ================= */}
        {/* Outer Reference Orbit (r = 1.0) */}
        <circle
          cx={cx}
          cy={cy}
          r={scale}
          fill="none"
          className="stroke-neutral-300 dark:stroke-white/8"
          strokeDasharray="2 4"
          strokeWidth="0.75"
        />

        {/* Intermediate Hill Sphere Boundary (r = 0.78) */}
        <circle
          cx={cx}
          cy={cy}
          r={scale * 0.78}
          fill="none"
          className="stroke-cyan-500/25 dark:stroke-cyan-400/15"
          strokeDasharray="3 5"
          strokeWidth="0.75"
        />

        {/* Fine Synodic Coordinate Axes */}
        <g
          className="stroke-neutral-300 dark:stroke-white/12"
          strokeWidth="0.75"
        >
          <line x1={cx - scale - 30} y1={cy} x2={cx + scale + 30} y2={cy} />
          <line x1={cx} y1={cy - scale - 30} x2={cx} y2={cy + scale + 30} />
        </g>

        {/* Coordinate Ticks */}
        <g
          className="fill-neutral-400 dark:fill-neutral-500 font-mono text-[7.5px]"
          stroke="none"
        >
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

        {/* Lagrange Points (L1 to L5) */}
        {lagrangePoints.map((lp) => (
          <g key={lp.id}>
            <circle
              cx={lp.x}
              cy={lp.y}
              r="3.5"
              fill="none"
              stroke="#00E5FF"
              strokeOpacity="0.8"
              strokeWidth="0.85"
            />
            <circle cx={lp.x} cy={lp.y} r="1.2" fill="#00E5FF" />
            <text
              x={lp.x + lp.labelDx}
              y={lp.y + lp.labelDy}
              textAnchor="middle"
              className="fill-neutral-600 dark:fill-neutral-300 font-mono text-[9px] font-semibold"
              letterSpacing="0.04em"
            >
              {lp.name}
            </text>
          </g>
        ))}

        {/* Primary Gravitational Mass m1 (Earth) */}
        <g>
          <circle
            cx={primaryMassX}
            cy={primaryMassY}
            r="10"
            className="fill-cyan-500/20 stroke-cyan-500/80"
            strokeWidth="1.2"
          />
          <circle cx={primaryMassX} cy={primaryMassY} r="4" fill="#00E5FF" />
          <text
            x={primaryMassX}
            y={primaryMassY + 22}
            textAnchor="middle"
            className="fill-neutral-700 dark:fill-neutral-300 font-mono text-[8.5px] font-semibold"
          >
            m₁ (Primary)
          </text>
        </g>

        {/* Secondary Gravitational Mass m2 (Moon) */}
        <g>
          <circle
            cx={secondaryMassX}
            cy={secondaryMassY}
            r="6"
            className="fill-emerald-500/20 stroke-emerald-500/80"
            strokeWidth="1"
          />
          <circle
            cx={secondaryMassX}
            cy={secondaryMassY}
            r="2.5"
            fill="#00E68A"
          />
          <text
            x={secondaryMassX}
            y={secondaryMassY + 18}
            textAnchor="middle"
            className="fill-neutral-700 dark:fill-neutral-300 font-mono text-[8px] font-semibold"
          >
            m₂ (Moon)
          </text>
        </g>

        {/* ================= 3. MULTI-COLOR ASTRODYNAMIC MANIFOLD CURVES ================= */}
        {/* Layer 4: Hyperbolic Gravity Assist Filament */}
        <path
          d={amberPath}
          fill="none"
          className="stroke-amber-500/70 dark:stroke-[#F59E0B]/75 orbit-anim-amber"
          strokeWidth="0.9"
        />

        {/* Layer 3: Jacobi Zero-Velocity Equipotential Contour */}
        <path
          d={violetPath}
          fill="none"
          className="stroke-violet-600/75 dark:stroke-[#A78BFA]/80 orbit-anim-violet"
          strokeWidth="1.0"
        />

        {/* Layer 2: Collinear L1/L2 Halo Orbit */}
        <path
          d={cyanPath}
          fill="none"
          className="stroke-cyan-600 dark:stroke-[#00E5FF] orbit-anim-cyan"
          strokeWidth="1.2"
        />

        {/* Layer 1: Main Resonant 3-Body Transfer Manifold */}
        <path
          d={emeraldPath}
          fill="none"
          className="stroke-emerald-600 dark:stroke-[#00E68A] orbit-anim-emerald"
          strokeWidth="1.35"
        />

        {/* ================= 4. REAL-TIME FLIGHT PROBE & VELOCITY VECTOR ================= */}
        {/* Velocity Tangent Vector Arrow */}
        <line
          x1={probePx}
          y1={probePy}
          x2={arrowEndX}
          y2={arrowEndY}
          stroke="#00E68A"
          strokeWidth="1.5"
          markerEnd="url(#velocityArrow)"
        />

        {/* Spacecraft Target Reticle */}
        <circle
          cx={probePx}
          cy={probePy}
          r="6"
          fill="none"
          stroke="#00E68A"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <circle cx={probePx} cy={probePy} r="2.5" fill="#00E68A" />

        {/* Reticle Coordinates HUD Tag */}
        <g transform={`translate(${probePx + 10}, ${probePy - 10})`}>
          <rect
            x="0"
            y="-10"
            width="68"
            height="14"
            rx="2"
            className="fill-neutral-900/90 dark:fill-black/90 stroke-neutral-700/60"
            strokeWidth="0.5"
          />
          <text
            x="4"
            y="0"
            className="fill-emerald-400 font-mono text-[7.5px] font-bold"
          >
            v: {liveVelocity} km/s
          </text>
        </g>
      </svg>
    </div>
  );
};

export default ArchitectureSpecification;
