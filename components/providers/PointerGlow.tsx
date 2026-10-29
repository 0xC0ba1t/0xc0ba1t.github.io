"use client";

import { useEffect, useRef } from "react";
import { motionConfig } from "@/config/animations";
import { features } from "@/config/features";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Desktop-only ambient glow. One fixed element with a *static* gradient that is moved with a
 * transform inside rAF, so following the pointer never repaints (the old version rewrote a
 * full-viewport gradient on every move).
 */
export function PointerGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const enabled = features.pointerGlow && fine && !reduce;
  const { glowRadius, glowOpacity } = motionConfig.pointer;

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      el.style.transform = `translate3d(${x - glowRadius}px, ${y - glowRadius}px, 0)`;
      el.style.opacity = "1";
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint); // one write per frame, never cancelled and re-queued
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, glowRadius]);

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[1] opacity-0 transition-opacity duration-500"
      style={{
        width: glowRadius * 2,
        height: glowRadius * 2,
        transform: "translate3d(-9999px, -9999px, 0)",
        willChange: "transform, opacity",
        background: `radial-gradient(closest-side, color-mix(in oklab, var(--accent) ${Math.round(glowOpacity * 100 * 3)}%, transparent), transparent 70%)`,
      }}
    />
  );
}
