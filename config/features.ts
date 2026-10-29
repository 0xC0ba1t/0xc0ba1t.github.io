/** Feature flags — switch any visual effect off without touching components. */
export const features = {
  /** WebGL dither shader in the hero (falls back to a static dither mask) */
  ditherShader: true,
  /** low-opacity texture on selected surfaces */
  noiseBackground: true,
  /** split-flap board in the hero */
  flippingBoard: true,
  /** inline rotating phrase */
  flipWords: true,
  /** text-decoding microinteractions */
  encryptedText: true,
  /** SVG hover-highlight wordmark/headings */
  textHoverEffect: true,
  /** Aceternity "Macbook Scroll" around the terminal (otherwise a plain framed terminal) */
  macbookScroll: true,
  /** desktop-only ambient pointer glow */
  pointerGlow: true,
  /** typed boot sequence in the terminal */
  bootSequence: true,
  /** auto-typed intro command(s) after boot */
  introTyping: true,
} as const;

export type FeatureFlags = typeof features;
