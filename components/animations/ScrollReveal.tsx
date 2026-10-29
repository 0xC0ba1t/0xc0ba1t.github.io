"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { motionConfig } from "@/config/animations";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** px to travel; defaults to the shared reveal distance */
  y?: number;
}

/**
 * Fade-and-rise on first entry into the viewport. Renders plain markup for
 * reduced-motion users. `data-reveal` lets the <noscript> rule keep content visible.
 */
export function ScrollReveal({ children, className, delay = 0, y = motionConfig.reveal.distance }: Props) {
  const reduce = usePrefersReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: motionConfig.reveal.once, margin: motionConfig.reveal.margin }}
      transition={{ duration: motionConfig.duration.reveal, ease: motionConfig.ease.standard, delay }}
    >
      {children}
    </motion.div>
  );
}
