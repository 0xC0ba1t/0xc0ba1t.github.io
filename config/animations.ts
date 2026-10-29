/**
 * Shared motion language. Everything animated reads from here.
 * Reduced-motion: components check `usePrefersReducedMotion()` and fall back to static output.
 */

export const motionConfig = {
  duration: { fast: 0.18, base: 0.5, slow: 0.9, reveal: 0.7 },

  ease: {
    standard: [0.22, 1, 0.36, 1] as [number, number, number, number],
    mechanical: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },

  stagger: { tight: 0.035, base: 0.07, loose: 0.12 },

  reveal: {
    /** px travelled by fade-and-slide reveals */
    distance: 22,
    /** viewport margin before a reveal triggers */
    margin: "-10% 0px -10% 0px",
    once: true,
  },

  pointer: {
    /** ambient glow radius in px */
    glowRadius: 520,
    /** 0–1 glow opacity */
    glowOpacity: 0.1,
    /** max px of decorative parallax */
    parallax: 10,
    /** terminal highlight radius in px */
    terminalGlowRadius: 340,
  },

  /** Text effects */
  text: {
    flipBoard: {
      cols: 12,
      rows: 2,
      /** ms each message stays before the next one */
      holdMs: 5600,
      /** ms per flip step on one tile */
      stepMs: 68,
      /** ms delay between neighbouring columns */
      columnStaggerMs: 38,
      /** upper bound of flips per tile (keeps transitions ~1s) */
      maxSteps: 12,
      firstDelayMs: 900,
    },
    flipWords: { intervalMs: 3000, letterStagger: 0.022 },
    encrypted: {
      revealMs: 900,
      scrambleEveryMs: 48,
      charset: "abcdefghijklmnopqrstuvwxyz0123456789<>/_-+=",
    },
  },
} as const;
