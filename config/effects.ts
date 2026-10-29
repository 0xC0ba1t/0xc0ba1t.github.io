/** Background effect settings (dither shader + noise). */

export type DitherMode = "bayer" | "halftone" | "noise" | "crosshatch";

export const dither = {
  mode: "bayer" as DitherMode,
  /** dither cell size in CSS px */
  gridSize: 3,
  /** 0–1 overall brightness of the field (keep low for text legibility) */
  intensity: 0.5,
  animated: true,
  /** animation speed multiplier */
  speed: 0.6,
  maxFps: 30,
  /** cap on devicePixelRatio used by the canvas */
  pixelRatioCap: 1.5,
  /** 0–1 share of lit cells tinted with the accent colour (oxblood by default) */
  accentAmount: 0.07,
  /** 0–1 how far the field shifts toward the pointer (desktop only) */
  pointerInfluence: 0.12,
  /** static fallback mask (used when WebGL is unavailable or motion is reduced) */
  fallbackMask: "/images/dither-mask.png",
} as const;

export const noise = {
  /** 0–1 opacity of the grain overlay */
  intensity: 0.07,
  /** slow drift of the grain on desktop; always static on mobile / reduced motion */
  animating: true,
  /** px size of one grain tile */
  tileSize: 180,
} as const;
