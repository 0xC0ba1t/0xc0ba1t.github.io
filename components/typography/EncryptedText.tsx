"use client";

import { useEffect, useRef, useState } from "react";
import { motionConfig } from "@/config/animations";
import { features } from "@/config/features";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  className?: string;
  /** ms before decoding starts once visible */
  delayMs?: number;
  revealMs?: number;
}

/**
 * Decodes `text` once, the first time it scrolls into view. The real text is
 * rendered on the server and for screen readers; the scramble is purely visual,
 * runs once, and is skipped for reduced motion.
 */
export function EncryptedText({ text, className, delayMs = 0, revealMs = motionConfig.text.encrypted.revealMs }: Props) {
  const cfg = motionConfig.text.encrypted;
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const played = useRef(false);

  useEffect(() => {
    setDisplay(text);
    if (!features.encryptedText || reduce || played.current) return;
    const el = ref.current;
    if (!el) return;

    let interval = 0;
    let timeout = 0;
    const scramble = (progress: number) => {
      const revealed = Math.floor(progress * text.length);
      return text
        .split("")
        .map((ch, idx) => (ch === " " || idx < revealed ? ch : cfg.charset[Math.floor(Math.random() * cfg.charset.length)]))
        .join("");
    };
    const run = () => {
      played.current = true;
      const startAt = performance.now();
      interval = window.setInterval(() => {
        const progress = Math.min(1, (performance.now() - startAt) / revealMs);
        setDisplay(progress >= 1 ? text : scramble(progress));
        if (progress >= 1) window.clearInterval(interval);
      }, cfg.scrambleEveryMs);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          timeout = window.setTimeout(run, delayMs);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [text, reduce, delayMs, revealMs, cfg.charset, cfg.scrambleEveryMs]);

  return (
    <span ref={ref} className={cn("font-mono", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
