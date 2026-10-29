"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useInView } from "motion/react";
import { motionConfig } from "@/config/animations";
import { features } from "@/config/features";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Mechanical split-flap board. Each tile flips through the character sequence
 * until it reaches its target, like a station departures board.
 *
 * Accessibility: the visual tiles are aria-hidden; the board exposes one static
 * label listing every message, so nothing is announced as it flips.
 * Reduced motion: shows the first message, no flipping.
 */

const SEQUENCE = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.";

function indexOf(ch: string): number {
  const i = SEQUENCE.indexOf(ch);
  return i === -1 ? 0 : i;
}

/** Characters a tile passes through from `from` to `to`, capped at `maxSteps`. */
function pathBetween(from: string, to: string, maxSteps: number): string[] {
  const n = SEQUENCE.length;
  const a = indexOf(from);
  const b = indexOf(to);
  let dist = (b - a + n) % n;
  if (dist === 0) return [];
  const start = dist > maxSteps ? (b - maxSteps + n) % n : a;
  dist = Math.min(dist, maxSteps);
  const out: string[] = [];
  for (let i = 1; i <= dist; i++) out.push(SEQUENCE[(start + i) % n]);
  return out;
}

/** Word-wrap a message onto `rows` rows of up to `cols` characters, centred. */
export function layoutMessage(message: string, rows: number, cols: number): string[] {
  const words = message.toUpperCase().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const word = w.length > cols ? w.slice(0, cols) : w;
    if (!line) line = word;
    else if (line.length + 1 + word.length <= cols) line += ` ${word}`;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  const used = lines.slice(0, rows);
  while (used.length < rows) used.push("");
  return used.map((l) => {
    const left = Math.floor((cols - l.length) / 2);
    return (" ".repeat(left) + l).padEnd(cols, " ");
  });
}

function Half({ part, char, className }: { part: "top" | "bottom"; char: string; className?: string }) {
  return (
    <div className={`flap-half ${part === "top" ? "flap-top" : "flap-bottom"} ${className ?? ""}`}>
      <div className="flap-glyph">{char === " " ? " " : char}</div>
    </div>
  );
}

interface TileProps {
  target: string;
  delayMs: number;
  animate: boolean;
  /** start blank and flip in on mount */
  intro: boolean;
}

function Tile({ target, delayMs, animate, intro }: TileProps) {
  const cfg = motionConfig.text.flipBoard;
  const [shown, setShown] = useState(target);
  const [flip, setFlip] = useState<{ from: string; to: string; key: number } | null>(null);
  const shownRef = useRef(target);
  const keyRef = useRef(0);
  const timers = useRef<number[]>([]);
  const introDone = useRef(false);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  // Intro: blank the tile before first paint, then flip in.
  useLayoutEffect(() => {
    if (!intro || !animate || introDone.current) return;
    introDone.current = true;
    shownRef.current = " ";
    setShown(" ");
  }, [intro, animate]);

  useEffect(() => {
    clear();
    if (!animate) {
      shownRef.current = target;
      setShown(target);
      setFlip(null);
      return;
    }
    const steps = pathBetween(shownRef.current, target, cfg.maxSteps);
    if (steps.length === 0) return;
    let elapsed = delayMs;
    steps.forEach((next) => {
      timers.current.push(
        window.setTimeout(() => {
          const from = shownRef.current;
          keyRef.current += 1;
          setFlip({ from, to: next, key: keyRef.current });
        }, elapsed),
      );
      timers.current.push(
        window.setTimeout(() => {
          shownRef.current = next;
          setShown(next);
          setFlip(null);
        }, elapsed + cfg.stepMs * 1.9),
      );
      elapsed += cfg.stepMs * 2;
    });
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, animate, delayMs]);

  const prev = flip?.from ?? shown;
  const next = flip?.to ?? shown;
  return (
    <div className="flap" aria-hidden="true">
      <Half part="top" char={next} />
      <Half part="bottom" char={prev} />
      {flip && (
        <>
          <Half key={`t${flip.key}`} part="top" char={prev} className="flap-flip-top" />
          <Half key={`b${flip.key}`} part="bottom" char={next} className="flap-flip-bottom" />
        </>
      )}
    </div>
  );
}

interface BoardProps {
  messages: readonly string[];
  className?: string;
}

export function TextFlippingBoard({ messages, className }: BoardProps) {
  const cfg = motionConfig.text.flipBoard;
  const reduce = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: "0px 0px -10% 0px" });
  const [index, setIndex] = useState(0);
  const [tabVisible, setTabVisible] = useState(true);
  const animate = features.flippingBoard && !reduce;

  const layouts = useMemo(() => messages.map((m) => layoutMessage(m, cfg.rows, cfg.cols)), [messages, cfg.rows, cfg.cols]);

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!animate || messages.length < 2 || !inView || !tabVisible) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), cfg.holdMs);
    return () => window.clearInterval(id);
  }, [animate, messages.length, inView, tabVisible, cfg.holdMs]);

  const rows = layouts[index] ?? layouts[0] ?? [];

  return (
    <div ref={wrapRef} className={className} style={{ containerType: "inline-size" }}>
      <div role="img" aria-label={`Areas of interest: ${messages.map((m) => m.toLowerCase()).join(", ")}`} className="flap-board">
        {rows.map((row, r) => (
          <div className="flap-row" key={r}>
            {row.split("").map((ch, c) => (
              <Tile
                key={c}
                target={ch}
                animate={animate}
                intro={index === 0}
                delayMs={(r * cfg.cols + c) * (cfg.columnStaggerMs / 2) + (index === 0 ? cfg.firstDelayMs : 0)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
