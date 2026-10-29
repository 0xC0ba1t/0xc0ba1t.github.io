"use client";

import { useId, useRef } from "react";
import { features } from "@/config/features";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  className?: string;
  /** SVG viewBox width; widen for longer text */
  width?: number;
  height?: number;
  fontSize?: number;
}

/**
 * Large serif text with a pointer-following highlight (accent outline revealed
 * through a radial mask). The ivory fill is always visible, so touch devices and
 * keyboard users see the same readable heading; hover only adds the highlight.
 */
export function TextHoverEffect({ text, className, width = 520, height = 140, fontSize = 112 }: Props) {
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const maskRef = useRef<SVGRadialGradientElement>(null);
  const haloRef = useRef<SVGRadialGradientElement>(null);
  const layerRef = useRef<SVGGElement>(null);

  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!features.textHoverEffect || e.pointerType !== "mouse") return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = `${((e.clientX - rect.left) / rect.width) * 100}%`;
    const cy = `${((e.clientY - rect.top) / rect.height) * 100}%`;
    for (const ref of [maskRef, haloRef]) {
      ref.current?.setAttribute("cx", cx);
      ref.current?.setAttribute("cy", cy);
    }
  };
  const setLayer = (on: boolean) => {
    if (layerRef.current) layerRef.current.style.opacity = on ? "1" : "0";
  };

  const textProps = {
    x: "50%",
    y: "54%",
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    style: { fontFamily: "var(--font-serif)", fontSize, letterSpacing: "-0.02em" },
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={text}
      className={cn("w-full select-none", className)}
      onPointerMove={move}
      onPointerEnter={(e) => e.pointerType === "mouse" && setLayer(true)}
      onPointerLeave={() => setLayer(false)}
    >
      <defs>
        <linearGradient id={`${uid}-stroke`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={width} y2="0">
          <stop offset="0%" style={{ stopColor: "var(--accent-soft)" }} />
          <stop offset="55%" style={{ stopColor: "var(--ivory)" }} />
          <stop offset="100%" style={{ stopColor: "var(--stone)" }} />
        </linearGradient>
        <radialGradient id={`${uid}-reveal`} ref={maskRef} gradientUnits="userSpaceOnUse" r="22%" cx="50%" cy="50%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id={`${uid}-mask`}>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#${uid}-reveal)`} />
        </mask>
        <radialGradient id={`${uid}-halo`} ref={haloRef} gradientUnits="userSpaceOnUse" r="26%" cx="50%" cy="50%">
          <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 0.55 }} />
          <stop offset="100%" style={{ stopColor: "var(--accent)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Always-visible text */}
      <text {...textProps} style={{ ...textProps.style, fill: "var(--ivory)" }}>
        {text}
      </text>

      {/* Hover-only highlight layer */}
      <g ref={layerRef} style={{ opacity: 0, transition: "opacity 0.25s" }} aria-hidden="true">
        <text {...textProps} style={{ ...textProps.style, fill: `url(#${uid}-halo)` }} mask={`url(#${uid}-mask)`}>
          {text}
        </text>
        <text
          {...textProps}
          style={{ ...textProps.style, fill: "none", stroke: `url(#${uid}-stroke)`, strokeWidth: 1.2 }}
          mask={`url(#${uid}-mask)`}
        >
          {text}
        </text>
      </g>
    </svg>
  );
}
