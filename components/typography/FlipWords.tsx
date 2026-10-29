"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { motionConfig } from "@/config/animations";
import { features } from "@/config/features";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface Props {
  words: readonly string[];
  className?: string;
  intervalMs?: number;
}

/**
 * Inline rotating phrase. The slot is exactly as wide as the word being shown, so the text after
 * it always sits right next to it (reserving the widest word left a visible gap after short ones).
 * The cost is that the line can re-wrap when the width changes; callers that care should give the
 * surrounding paragraph a `min-height`. Screen readers get the full list once.
 */
export function FlipWords({ words, className, intervalMs = motionConfig.text.flipWords.intervalMs }: Props) {
  const reduce = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const animate = features.flipWords && !reduce && words.length > 1;

  useEffect(() => {
    if (!animate) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % words.length), intervalMs);
    return () => window.clearInterval(id);
  }, [animate, words.length, intervalMs]);

  const word = words[i] ?? words[0] ?? "";

  return (
    <span className={className}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true" className="whitespace-nowrap">
        {animate ? (
          // mode="wait": the old word has left before the new one mounts, so only one is ever in flow
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={word}
              className="inline-block"
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: motionConfig.duration.base * 0.7, ease: motionConfig.ease.standard }}
            >
              {word}
            </motion.span>
          </AnimatePresence>
        ) : (
          word
        )}
      </span>
    </span>
  );
}
