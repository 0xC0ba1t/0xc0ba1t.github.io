"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { motionConfig } from "@/config/animations";
import { usePrefersReducedMotion } from "@/lib/hooks";

const container = (stagger: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
});

const item: Variants = {
  hidden: { opacity: 0, y: motionConfig.reveal.distance },
  show: { opacity: 1, y: 0, transition: { duration: motionConfig.duration.reveal, ease: motionConfig.ease.standard } },
};

interface ContainerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

/** Reveals its <StaggerItem> children one after another when scrolled into view. */
export function StaggerContainer({ children, className, stagger = motionConfig.stagger.base }: ContainerProps) {
  const reduce = usePrefersReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={container(stagger)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: motionConfig.reveal.once, margin: motionConfig.reveal.margin }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = usePrefersReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div data-reveal className={className} variants={item}>
      {children}
    </motion.div>
  );
}
