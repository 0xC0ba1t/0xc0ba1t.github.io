"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconAdjustments, IconBattery3, IconSearch, IconWifi } from "@tabler/icons-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { site } from "@/config/site";
import { themes } from "@/config/theme";
import { asset, cn } from "@/lib/utils";

interface Ctx {
  go: (href: string) => void;
  setTheme: (id: string) => void;
}
interface Item {
  label: string;
  run: (c: Ctx) => void;
}
type Entry = Item | null;

const open_ = (url: string) => () => window.open(url, "_blank", "noopener,noreferrer");
const exec = (cmd: string) => () => {
  try {
    document.execCommand(cmd);
  } catch {
    /* unsupported: ignore */
  }
};
const toggleFullscreen = () => {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen?.().catch(() => {});
};
const nav = (label: string, href: string): Item => ({ label, run: (c) => c.go(href) });

/** macOS-style menus. Only actions that make sense on a static site are included. */
const MENUS: { label: string; items: Entry[] }[] = [
  {
    label: "File",
    items: [
      { label: "New Window", run: () => window.open(window.location.href, "_blank", "noopener") },
      { label: "Copy Page Link", run: () => void navigator.clipboard?.writeText(window.location.href).catch(() => {}) },
      null,
      { label: "Print…", run: () => window.print() },
    ],
  },
  {
    label: "Edit",
    items: [
      { label: "Copy", run: exec("copy") },
      { label: "Select All", run: exec("selectAll") },
    ],
  },
  {
    label: "View",
    items: [
      { label: "Reload Page", run: () => window.location.reload() },
      { label: "Scroll to Top", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
      null,
      { label: "Toggle Full Screen", run: toggleFullscreen },
    ],
  },
  {
    label: "Go",
    items: [
      { label: "Back", run: () => window.history.back() },
      { label: "Forward", run: () => window.history.forward() },
      null,
      nav("Home", "/"),
      nav("About", "/about/"),
      nav("Projects", "/projects/"),
      nav("Skills", "/skills/"),
      nav("Experience", "/experience/"),
      nav("Contact", "/contact/"),
    ],
  },
  {
    label: "Window",
    items: [...themes.map((t): Item => ({ label: `Theme: ${t.label}`, run: (c) => c.setTheme(t.id) }))],
  },
  {
    label: "Help",
    items: [
      { label: "Email Me", run: open_(`mailto:${site.email}`) },
      { label: "View Source on GitHub", run: open_(site.sourceUrl) },
      { label: "PGP Key", run: open_(site.pgp.url) },
    ],
  },
];

const APPLE_ITEMS: Entry[] = [
  nav("About This Portfolio", "/about/"),
  { label: "Source Code…", run: open_(site.sourceUrl) },
  null,
  { label: "Restart…", run: () => window.location.reload() },
];

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const t = window.setInterval(tick, 15_000);
    return () => window.clearInterval(t);
  }, []);
  if (!now) return "";
  const d = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const t = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${d}  ${t}`;
}

function Dropdown({ items, className, onPick, ctx }: { items: Entry[]; className?: string; onPick: () => void; ctx: Ctx }) {
  return (
    <div role="menu" className={cn("absolute top-[calc(100%+2px)] min-w-44 rounded-lg border border-white/15 bg-obsidian/90 p-1 shadow-2xl backdrop-blur-xl", className)}>
      {items.map((it, i) =>
        it === null ? (
          <div key={i} className="my-1 h-px bg-white/10" role="separator" />
        ) : (
          <button
            key={it.label}
            type="button"
            role="menuitem"
            onClick={() => {
              onPick();
              it.run(ctx);
            }}
            className="block w-full rounded px-2.5 py-1 text-left text-[0.78rem] text-ivory/90 hover:bg-accent hover:text-ivory">
            {it.label}
          </button>
        ),
      )}
    </div>
  );
}

export function MenuBar() {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const clock = useClock();
  const router = useRouter();
  const { setTheme } = useTheme();
  const ctx: Ctx = { go: (href) => router.push(href), setTheme: (id) => setTheme(id as Parameters<typeof setTheme>[0]) };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const btn = "rounded px-2 py-0.5 text-[0.78rem] leading-5 text-ivory/90 transition-colors hover:bg-white/15 data-[open=true]:bg-white/20";
  const close = () => setOpen(null);

  return (
    <div ref={ref} className="fixed inset-x-0 top-0 z-[60] flex h-7 select-none items-center justify-between border-b border-white/10 bg-obsidian/70 px-2 font-sans backdrop-blur-xl">
      <div className="flex min-w-0 items-center">
        <div className="relative">
          <button
            type="button"
            aria-label="Apple menu"
            aria-haspopup="menu"
            aria-expanded={open === "apple"}
            className={cn(btn, "px-2.5")}
            data-open={open === "apple"}
            onClick={() => setOpen(open === "apple" ? null : "apple")}
            onPointerEnter={() => open && setOpen("apple")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/images/crow.png")} alt="" width={14} height={18} className="h-[18px] w-auto" draggable={false} />
          </button>
          {open === "apple" && <Dropdown items={APPLE_ITEMS} className="left-0 min-w-48" onPick={close} ctx={ctx} />}
        </div>
        <span className="px-2 text-[0.78rem] font-bold text-ivory">{site.handle}</span>
        <div className="hidden items-center md:flex">
          {MENUS.map((m) => (
            <div key={m.label} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open === m.label}
                data-open={open === m.label}
                className={btn}
                onClick={() => setOpen(open === m.label ? null : m.label)}
                onPointerEnter={() => open && setOpen(m.label)}
              >
                {m.label}
              </button>
              {open === m.label && <Dropdown items={m.items} className="left-0" onPick={close} ctx={ctx} />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pr-1.5 text-ivory/90" aria-hidden>
        <IconBattery3 size={17} className="hidden sm:block" />
        <IconWifi size={15} className="hidden sm:block" />
        <IconSearch size={14} className="hidden sm:block" />
        <IconAdjustments size={15} className="hidden sm:block" />
        <time suppressHydrationWarning className="min-w-[8.5rem] text-right text-[0.78rem] tabular-nums">
          {clock}
        </time>
      </div>
    </div>
  );
}

/** Decorative window title bar with traffic lights. The buttons react to hover/press but do nothing. */
export function WindowChrome() {
  const [hover, setHover] = useState(false);
  const dots = [
    { label: "Close", color: "#ff5f57", glyph: "×" },
    { label: "Minimise", color: "#febc2e", glyph: "−" },
    { label: "Full screen", color: "#28c840", glyph: "⤢" },
  ];
  return (
    <div className="relative flex h-10 select-none items-center border-b border-line bg-surface/80 px-3">
      <div className="relative z-10 flex gap-2" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
        {dots.map((d) => (
          <button
            key={d.label}
            type="button"
            aria-label={`${d.label} (decorative)`}
            style={{ background: d.color }}
            className="flex size-3.5 items-center justify-center rounded-full border border-black/20 text-[0.6rem] font-bold leading-none text-black/60 transition-[filter,transform] active:scale-90 active:brightness-75"
          >
            <span className={cn("transition-opacity", hover ? "opacity-100" : "opacity-0")}>{d.glyph}</span>
          </button>
        ))}
      </div>
      <p className="pointer-events-none absolute inset-x-20 truncate text-center font-mono text-[0.72rem] text-stone">{site.handle} — ~/portfolio</p>
    </div>
  );
}
