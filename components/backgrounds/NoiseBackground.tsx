import type { CSSProperties, ReactNode } from "react";
import { features } from "@/config/features";
import { noise } from "@/config/effects";
import { cn } from "@/lib/utils";

interface Props {
  children?: ReactNode;
  className?: string;
  /** 0–1 grain opacity */
  intensity?: number;
  /** slow grain drift (desktop only; CSS disables it on mobile and for reduced motion) */
  animating?: boolean;
}

/**
 * Low-opacity grain over a surface. Pure CSS (an SVG turbulence tile), no JavaScript.
 * Disable globally with `features.noiseBackground = false`.
 */
export function NoiseBackground({ children, className, intensity = noise.intensity, animating = noise.animating }: Props) {
  if (!features.noiseBackground) return <div className={className}>{children}</div>;
  const style = { "--noise-opacity": intensity, "--noise-size": `${noise.tileSize}px` } as CSSProperties;
  return (
    <div className={cn("noise-surface", className)} data-animating={animating} style={style}>
      <div aria-hidden="true" className="noise-layer" />
      {children}
    </div>
  );
}
