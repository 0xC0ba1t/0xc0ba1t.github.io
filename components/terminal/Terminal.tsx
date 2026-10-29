"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useRouter } from "next/navigation";
import { useInView } from "motion/react";
import { commands } from "./command-registry";
import { TerminalInput } from "./TerminalInput";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalPrompt } from "./TerminalPrompt";
import { features } from "@/config/features";
import { motionConfig } from "@/config/animations";
import { terminalConfig } from "@/config/terminal";
import { getProjects } from "@/lib/projects";
import { complete, execute } from "@/lib/terminal/engine";
import { nodesToPlainText } from "@/lib/terminal/text";
import type { CommandContext, Effect, OutputNode } from "@/lib/terminal/types";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

interface Entry {
  id: number;
  cwd: string;
  /** undefined for boot lines */
  command?: string;
  nodes: OutputNode[];
}

type Phase = "boot" | "typing" | "ready";

export function Terminal({ className }: { className?: string }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const reduce = usePrefersReducedMotion();
  const finePointer = useFinePointer();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [typed, setTyped] = useState<string | undefined>(undefined);
  const [phase, setPhase] = useState<Phase>("boot");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [announce, setAnnounce] = useState("");

  const cwdRef = useRef("~");
  const [cwd, setCwdState] = useState("~");
  const historyRef = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const draft = useRef("");
  const idRef = useRef(0);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const phaseRef = useRef<Phase>("boot");

  // The terminal lives further down the page, so the boot sequence waits until it is
  // actually on screen (otherwise the intro would play where nobody can see it).
  const inView = useInView(windowRef, { once: true, amount: 0.15 });
  const shouldStart = inView || reduce;

  const setPhaseBoth = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };
  const later = (fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms);
    timers.current.push(t);
  };
  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const setCwd = (c: string) => {
    cwdRef.current = c;
    setCwdState(c);
  };

  const applyEffects = useCallback(
    (effects: Effect[] | undefined) => {
      for (const fx of effects ?? []) {
        switch (fx.type) {
          case "clear":
            setEntries([]);
            break;
          case "navigate":
            router.push(fx.href);
            break;
          case "open":
            window.open(fx.url, "_blank", "noopener,noreferrer");
            break;
          case "cwd":
            setCwd(fx.cwd);
            break;
          case "theme":
            setTheme(fx.id);
            break;
        }
      }
    },
    [router, setTheme],
  );

  const run = useCallback(
    (line: string) => {
      const ctx: CommandContext = {
        cwd: cwdRef.current,
        theme: themeRef.current,
        now: new Date(),
        history: historyRef.current,
        commands,
      };
      const trimmed = line.trim();
      const result = trimmed ? execute(trimmed, ctx) : null;
      const entry: Entry = { id: idRef.current++, cwd: cwdRef.current, command: trimmed, nodes: result?.output ?? [] };
      setEntries((prev) => [...prev, entry].slice(-terminalConfig.maxEntries));
      if (trimmed) {
        const h = historyRef.current;
        if (h[h.length - 1] !== trimmed) h.push(trimmed);
        if (h.length > terminalConfig.maxHistory) h.shift();
        setAnnounce(nodesToPlainText(entry.nodes));
      }
      applyEffects(result?.effects);
    },
    [applyEffects],
  );

  /* ---- boot + intro ---- */
  const finishIntroInstantly = useCallback(() => {
    clearTimers();
    setTyped(undefined);
    setPhaseBoth("ready");
  }, []);

  const typeIntro = useCallback(
    (index: number) => {
      const cmds = terminalConfig.introCommands;
      if (index >= cmds.length) {
        setTyped(undefined);
        setPhaseBoth("ready");
        return;
      }
      const cmd = cmds[index];
      setPhaseBoth("typing");
      let i = 0;
      const tick = () => {
        i += 1;
        setTyped(cmd.slice(0, i));
        if (i < cmd.length) later(tick, terminalConfig.introTypeSpeedMs);
        else
          later(() => {
            setTyped(undefined);
            run(cmd);
            later(() => typeIntro(index + 1), 350);
          }, 380);
      };
      later(tick, 300);
    },
    [run],
  );

  const bootLines = useMemo(
    () =>
      terminalConfig.bootLines.map((l) =>
        l.replace("{projectCount}", String(getProjects().length)).replace("{theme}", themeRef.current),
      ),
    [],
  );

  const afterBoot = useCallback(() => {
    const introCommands = terminalConfig.introCommands as readonly string[];
    if (introCommands.length === 0) return finishIntroInstantly();
    if (reduce || !features.introTyping) {
      introCommands.forEach((c) => run(c));
      return finishIntroInstantly();
    }
    typeIntro(0);
  }, [finishIntroInstantly, reduce, run, typeIntro]);

  useEffect(() => {
    if (!shouldStart) return;
    // Strict-mode safe: every run starts from a clean slate and the cleanup cancels all
    // pending timers, so React's dev-only mount → unmount → mount never leaves the
    // terminal frozen half-way through its intro.
    clearTimers();
    historyRef.current = [];
    idRef.current = 0;
    histIdx.current = -1;
    setEntries([]);
    setInput("");
    setSuggestions([]);
    setTyped(undefined);
    setCwd("~");
    setPhaseBoth("boot");

    if (!features.bootSequence || reduce) {
      afterBoot();
      return clearTimers;
    }
    let n = 0;
    const step = () => {
      const line = bootLines[n];
      setEntries((prev) => [...prev, { id: idRef.current++, cwd: "~", nodes: [{ type: "text", text: line, tone: "muted" }] }]);
      n += 1;
      if (n < bootLines.length) later(step, terminalConfig.bootLineDelayMs);
      else later(afterBoot, 260);
    };
    later(step, 250);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldStart]);

  const skip = () => {
    if (phaseRef.current === "ready") return;
    clearTimers();
    setTyped(undefined);
    setEntries((prev) => {
      const haveBoot = prev.filter((e) => e.command === undefined).length;
      const missing = bootLines.slice(haveBoot).map((text) => ({
        id: idRef.current++,
        cwd: "~",
        nodes: [{ type: "text", text, tone: "muted" } as OutputNode],
      }));
      return [...prev, ...missing];
    });
    // Run the intro commands immediately so the page never feels empty.
    const already = historyRef.current.length > 0;
    if (!already) terminalConfig.introCommands.forEach((c) => run(c));
    setPhaseBoth("ready");
  };

  const onIntent = () => {
    if (phaseRef.current === "typing") finishIntroInstantly();
    else if (phaseRef.current === "boot") skip();
  };

  /* ---- scroll the terminal (not the page) ---- */
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(id);
  }, [entries, typed, suggestions]);

  /* ---- input handling ---- */
  const ctxNow = (): CommandContext => ({
    cwd: cwdRef.current,
    theme: themeRef.current,
    now: new Date(),
    history: historyRef.current,
    commands,
  });

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const h = historyRef.current;
    if (e.key === "Enter") {
      e.preventDefault();
      const line = input;
      setInput("");
      setSuggestions([]);
      histIdx.current = -1;
      run(line);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (h.length === 0) return;
      if (histIdx.current === -1) draft.current = input;
      histIdx.current = Math.min(histIdx.current + 1, h.length - 1);
      setInput(h[h.length - 1 - histIdx.current]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx.current === -1) return;
      histIdx.current -= 1;
      setInput(histIdx.current === -1 ? draft.current : h[h.length - 1 - histIdx.current]);
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const res = complete(input, ctxNow());
      setInput(res.value);
      setSuggestions(res.suggestions);
      return;
    }
    if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
      e.preventDefault();
      setEntries([]);
      return;
    }
    if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
      e.preventDefault();
      setInput("");
      setSuggestions([]);
      return;
    }
    if (suggestions.length) setSuggestions([]);
  };

  const runQuick = (cmd: string) => {
    if (phaseRef.current !== "ready") finishIntroInstantly();
    setSuggestions([]);
    run(cmd);
    if (finePointer) inputRef.current?.focus({ preventScroll: true });
  };

  /* ---- pointer highlight (desktop only, rAF-throttled) ---- */
  const raf = useRef(0);
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!finePointer || reduce || e.pointerType !== "mouse") return;
    const el = windowRef.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      // the window can sit inside a scaled laptop lid: convert screen px back to CSS px
      const k = r.width > 0 ? el.offsetWidth / r.width : 1;
      el.style.setProperty("--tx", `${(clientX - r.left) * k}px`);
      el.style.setProperty("--ty", `${(clientY - r.top) * k}px`);
    });
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const focusInput = () => {
    if (phaseRef.current === "boot") return;
    if (typeof window !== "undefined" && window.getSelection()?.toString()) return;
    inputRef.current?.focus({ preventScroll: true });
  };

  const showPrompt = phase !== "boot";

  return (
    <div
      ref={windowRef}
      className={cn("term-window flex h-full min-h-0 w-full flex-col", className)}
      style={{ ["--term-glow" as string]: `${motionConfig.pointer.terminalGlowRadius}px`, fontSize: "var(--term-fs, 0.8125rem)" }}
      onPointerMove={onPointerMove}
    >
      {/* title bar */}
      <div className="relative z-10 flex shrink-0 items-center gap-[0.9em] border-b border-line px-[1em] py-[0.6em]">
        <div className="flex gap-[0.45em]" aria-hidden>
          <span className="size-[0.75em] rounded-full border border-line-strong" />
          <span className="size-[0.75em] rounded-full border border-line-strong" />
          <span className="size-[0.75em] rounded-full bg-accent" />
        </div>
        <p className="min-w-0 flex-1 truncate text-center font-mono text-[0.9em] text-stone">{terminalConfig.windowTitle}</p>
        {phase !== "ready" ? (
          <button
            type="button"
            onClick={skip}
            title="The terminal plays a short boot sequence. Click to skip it."
            className="rounded border border-line px-[0.6em] py-[0.15em] font-mono text-[0.85em] text-stone transition-colors hover:border-line-strong hover:text-ivory"
          >
            skip intro
          </button>
        ) : (
          <span className="font-mono text-[0.85em] text-stone/70" aria-hidden>
            live
            <span className="ml-[0.5em] inline-block size-[0.55em] rounded-full bg-accent-soft align-middle" />
          </span>
        )}
      </div>

      {/* output + prompt */}
      <div
        ref={bodyRef}
        role="log"
        aria-label="Terminal output"
        aria-live="off"
        onClick={focusInput}
        className="term-body relative z-10 min-h-0 flex-1 cursor-text overflow-y-auto overscroll-contain px-[1.1em] py-[0.8em]"
      >
        <div className="space-y-[0.5em]">
          {entries.map((entry) => (
            <div key={entry.id}>
              {entry.command !== undefined && (
                <p className="flex gap-[0.6em]">
                  <TerminalPrompt cwd={entry.cwd} />
                  <span className="min-w-0 break-all">{entry.command}</span>
                </p>
              )}
              <TerminalOutput nodes={entry.nodes} onRun={runQuick} />
            </div>
          ))}

          {showPrompt && (
            <div>
              <div className="flex gap-[0.6em]">
                <TerminalPrompt cwd={cwd} />
                <TerminalInput
                  value={input}
                  typed={typed}
                  maxLength={terminalConfig.maxInputLength}
                  inputRef={inputRef}
                  onChange={setInput}
                  onKeyDown={onKeyDown}
                  onIntent={onIntent}
                />
              </div>
              {suggestions.length > 0 && <p className="mt-1 break-words text-stone">{suggestions.join("   ")}</p>}
            </div>
          )}
        </div>
      </div>

      {/* command bar: tap targets (essential on mobile) and a discoverable path for everyone */}
      <div className="relative z-10 flex shrink-0 flex-wrap items-center gap-x-[0.6em] gap-y-[0.5em] border-t border-line bg-obsidian/60 px-[1em] py-[0.6em]">
        <span className="font-mono text-[0.85em] text-stone" aria-hidden>
          try
        </span>
        <div className="flex flex-wrap gap-[0.5em]" role="group" aria-label="Run a terminal command">
          {terminalConfig.quickCommands.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => runQuick(cmd)}
              className="rounded-full border border-line px-[0.85em] py-[0.2em] font-mono text-[0.9em] text-stone transition-colors hover:border-accent hover:bg-accent/20 hover:text-ivory"
            >
              {cmd}
            </button>
          ))}
        </div>
        <span className="ml-auto hidden font-mono text-[0.82em] text-stone/70 sm:inline" aria-hidden>
          click &amp; type · tab completes · ↑↓ history
        </span>
      </div>

      <p className="sr-only" aria-live="polite" role="status">
        {announce}
      </p>
    </div>
  );
}
