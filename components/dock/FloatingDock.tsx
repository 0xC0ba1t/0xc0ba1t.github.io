"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState, type MutableRefObject, type PointerEvent as ReactPointerEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { useTheme } from "@/components/providers/ThemeProvider";
import { dockEntries, type DockEntry } from "@/config/navigation";
import { site } from "@/config/site";
import { themes } from "@/config/theme";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { cn, isActivePath } from "@/lib/utils";

const BASE = 44;
const MAX = 64;

/** Shared by every dock item: which label is showing, and where each item's centre is. */
interface DockCtx {
  mouseX: MotionValue<number>;
  magnify: boolean;
  /** id of the one item whose label is visible (null = none) */
  tip: string | null;
  setTip: (id: string | null) => void;
  /** unmagnified x-centres, measured once when the pointer enters (not on every mouse move) */
  centers: MutableRefObject<Record<string, number>>;
}

/**
 * Bottom Floating Dock — the primary navigation. Items come from
 * config/navigation.ts. Magnification is desktop-only; on touch it is a
 * compact row of 44px targets that respects the safe-area inset.
 *
 * Labels: exactly one can be visible, it only follows a real mouse hover or *keyboard* focus
 * (a click focuses the link but must not pin its label), and it is cleared whenever the pointer
 * leaves the dock, the route changes or the window loses focus.
 */
export function FloatingDock() {
  const pathname = usePathname();
  const mouseX = useMotionValue(Infinity);
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const magnify = fine && !reduce;
  const [themeOpen, setThemeOpen] = useState(false);
  const [tip, setTip] = useState<string | null>(null);
  const centers = useRef<Record<string, number>>({});
  const dockRef = useRef<HTMLDivElement>(null);

  const entries: DockEntry[] = [...dockEntries];
  if (site.resumeUrl && !entries.some((e) => e.id === "resume")) {
    entries.splice(entries.length - 1, 0, { type: "link", id: "resume", label: "Résumé", href: site.resumeUrl, icon: "resume", external: true, desktopOnly: true });
  }

  const clear = useCallback(() => {
    mouseX.set(Infinity);
    setTip(null);
  }, [mouseX]);

  // Never carry a label across a navigation, a tab switch or a window blur.
  useEffect(() => {
    clear();
  }, [pathname, clear]);
  useEffect(() => {
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, [clear]);

  const measure = () => {
    const root = dockRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-dock-id]").forEach((el) => {
      const r = el.getBoundingClientRect();
      centers.current[el.dataset.dockId as string] = r.left + r.width / 2;
    });
  };

  const onPointerEnter = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    measure();
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse") mouseX.set(e.clientX);
  };

  const ctx: DockCtx = { mouseX, magnify, tip, setTip, centers };

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div
        ref={dockRef}
        onPointerEnter={magnify ? onPointerEnter : undefined}
        onPointerMove={magnify ? onPointerMove : undefined}
        onPointerLeave={clear}
        onPointerCancel={clear}
        className="pointer-events-auto relative flex max-w-full items-end gap-1.5 rounded-2xl border border-line-strong bg-obsidian/85 px-2 py-2 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9)] backdrop-blur-sm"
      >
        {entries.map((entry) => {
          if (entry.type === "theme") {
            return <DockButton key={entry.id} ctx={ctx} id={entry.id} label={entry.label} icon={entry.icon} onClick={() => setThemeOpen((o) => !o)} expanded={themeOpen} />;
          }
          const active = !entry.external && isActivePath(pathname, entry.href);
          return <DockLink key={entry.id} ctx={ctx} entry={entry} active={active} />;
        })}
        <AnimatePresence>{themeOpen && <ThemeMenu onClose={() => setThemeOpen(false)} />}</AnimatePresence>
      </div>
    </nav>
  );
}

function useSize(ctx: DockCtx, id: string) {
  // Infinity when the pointer is away (Infinity - Infinity would be NaN, so guard it)
  const distance = useTransform(ctx.mouseX, (x) => {
    const c = ctx.centers.current[id];
    return Number.isFinite(x) && c !== undefined ? x - c : Infinity;
  });
  const raw = useTransform(distance, [-130, 0, 130], [BASE, MAX, BASE]);
  const sized = useSpring(raw, { mass: 0.1, stiffness: 160, damping: 14 });
  return ctx.magnify ? sized : BASE;
}

/** Hover/focus wiring for one item. Only a real mouse hover or keyboard focus shows a label. */
function tipHandlers(ctx: DockCtx, id: string, suppress = false) {
  return {
    onPointerEnter: (e: ReactPointerEvent) => {
      if (e.pointerType === "mouse" && !suppress) ctx.setTip(id);
    },
    onPointerLeave: () => ctx.setTip(ctx.tip === id ? null : ctx.tip),
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      // :focus-visible is true for keyboard focus and false for focus caused by a mouse click
      if (!suppress && e.currentTarget.matches(":focus-visible")) ctx.setTip(id);
    },
    onBlur: () => ctx.setTip(ctx.tip === id ? null : ctx.tip),
  };
}

function DockLink({ entry, ctx, active }: { entry: Extract<DockEntry, { type: "link" }>; ctx: DockCtx; active: boolean }) {
  const size = useSize(ctx, entry.id);
  const tip = tipHandlers(ctx, entry.id);
  const cls = cn(
    "relative flex size-full items-center justify-center rounded-xl border text-ivory transition-colors",
    active ? "border-accent bg-accent/45" : "border-line bg-surface hover:border-line-strong hover:bg-accent/25",
  );
  const inner = <Icon name={entry.icon} size={20} />;
  return (
    <motion.div
      data-dock-id={entry.id}
      style={{ width: size, height: size }}
      onPointerEnter={tip.onPointerEnter}
      onPointerLeave={tip.onPointerLeave}
      className={cn("relative aspect-square shrink-0", entry.desktopOnly && "hidden sm:block")}
    >
      {entry.external ? (
        <a href={entry.href} target="_blank" rel="noopener noreferrer" aria-label={`${entry.label} (opens in a new tab)`} className={cls} onFocus={tip.onFocus} onBlur={tip.onBlur}>
          {inner}
        </a>
      ) : (
        <Link href={entry.href} aria-label={entry.label} aria-current={active ? "page" : undefined} className={cls} onFocus={tip.onFocus} onBlur={tip.onBlur}>
          {inner}
        </Link>
      )}
      {active && <span aria-hidden className="absolute -bottom-1.5 left-1/2 h-1 w-3 -translate-x-1/2 rounded-full bg-ivory" />}
      <Tooltip show={ctx.tip === entry.id} text={entry.label} />
    </motion.div>
  );
}

function DockButton({ ctx, id, label, icon, onClick, expanded }: { ctx: DockCtx; id: string; label: string; icon: Extract<DockEntry, { type: "theme" }>["icon"]; onClick: () => void; expanded: boolean }) {
  const size = useSize(ctx, id);
  const tip = tipHandlers(ctx, id, expanded);
  return (
    <motion.div data-dock-id={id} style={{ width: size, height: size }} onPointerEnter={tip.onPointerEnter} onPointerLeave={tip.onPointerLeave} className="relative aspect-square shrink-0">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={expanded}
        onClick={() => {
          ctx.setTip(null);
          onClick();
        }}
        onFocus={tip.onFocus}
        onBlur={tip.onBlur}
        className={cn(
          "flex size-full items-center justify-center rounded-xl border text-ivory transition-colors",
          expanded ? "border-accent bg-accent/45" : "border-line bg-surface hover:border-line-strong hover:bg-accent/25",
        )}
      >
        <Icon name={icon} size={20} />
      </button>
      <Tooltip show={ctx.tip === id && !expanded} text={label} />
    </motion.div>
  );
}

function Tooltip({ show, text }: { show: boolean; text: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          role="tooltip"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.12 }}
          className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-line-strong bg-obsidian px-2 py-1 font-mono text-[0.7rem] text-ivory sm:block"
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function ThemeMenu({ onClose }: { onClose: () => void }) {
  const { theme, setTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && !(e.target as HTMLElement).closest("[aria-haspopup='menu']")) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    ref.current?.querySelector<HTMLElement>("[aria-checked='true']")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      role="menu"
      aria-label="Colour theme"
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.16 }}
      className="absolute bottom-[calc(100%+0.6rem)] right-0 w-60 max-w-[calc(100vw-1.5rem)] rounded-xl border border-line-strong bg-obsidian/95 p-1.5 shadow-2xl backdrop-blur-md"
    >
      {themes.map((t) => {
        const selected = t.id === theme;
        return (
          <button
            key={t.id}
            type="button"
            role="menuitemradio"
            aria-checked={selected}
            onClick={() => {
              setTheme(t.id);
              onClose();
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-accent/25",
              selected && "bg-accent/30",
            )}
          >
            <span aria-hidden className="flex shrink-0 -space-x-1">
              {[t.tokens.charcoal, t.tokens.stone, t.tokens.accent, t.tokens.ivory].map((c, i) => (
                <span key={i} className="size-3.5 rounded-full border border-obsidian" style={{ background: c }} />
              ))}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-ivory">{t.label}</span>
              <span className="block truncate font-mono text-[0.66rem] text-stone">{t.description}</span>
            </span>
            {selected && <span className="font-mono text-xs text-ivory">✓</span>}
          </button>
        );
      })}
    </motion.div>
  );
}
