"use client";

import { Terminal } from "@/components/terminal/Terminal";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { EncryptedText } from "@/components/typography/EncryptedText";
import { features } from "@/config/features";
import { site } from "@/config/site";
import { home } from "@/data/home";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Aceternity UI "macbook-scroll-demo", adapted for this site:
 *   - the lid shows the live terminal instead of /linear.webp;
 *   - the title is the section heading from data/home.ts;
 *   - the Peerlist badge is replaced by a handle badge;
 *   - on small screens / reduced motion it falls back to a plain framed terminal,
 *     because the 3D laptop is designed for wide viewports.
 */

/** The lid scales to this size when fully open (see scaleX/scaleY in ui/macbook-scroll.tsx). */
const OPEN_SCALE = 1.5;

export default function MacbookScrollDemo() {
  const wide = useMediaQuery("(min-width: 768px)", false);
  const reduce = usePrefersReducedMotion();
  const cfg = home.terminalShowcase;

  if (!features.macbookScroll || !wide || reduce) return <StaticScreen />;

  return (
    // `isolate`: the laptop base uses -z-10, which must stay above this wrapper's background.
    <div className="isolate w-full overflow-hidden bg-obsidian">
      <MacbookScroll
        // upstream pads 20rem above the title; trim it so the section does not open on a blank screen
        className="md:pt-24"
        title={
          <>
            <span className="mono-label mb-3 block">
              <EncryptedText text={cfg.kicker} />
            </span>
            <span id="terminal-h" className="display block text-4xl text-ivory sm:text-5xl">
              {cfg.title}
            </span>
          </>
        }
        badge={<HandleBadge />}
        showGradient={false}
      >
        <CrispScreen>
          <Terminal />
        </CrispScreen>
      </MacbookScroll>
    </div>
  );
}

/**
 * Lays the terminal out at its *final on-screen size* and shrinks it back down, so that when the
 * lid has scaled up by OPEN_SCALE the net transform is 1:1 and the text is rasterised sharply
 * (a terminal laid out small and scaled up by 1.5× is what made it blurry before).
 */
function CrispScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full [--term-fs:0.8rem]">
      <div
        className="origin-top-left"
        style={{
          width: `${OPEN_SCALE * 100}%`,
          height: `${OPEN_SCALE * 100}%`,
          transform: `scale(${(1 / OPEN_SCALE).toFixed(6)})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function HandleBadge() {
  return (
    <a
      href={`https://github.com/${site.author.alias}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${site.handle} on GitHub (opens in a new tab)`}
      className="block -rotate-6 rounded-md border border-white/15 bg-black/40 px-2 py-1 font-mono text-[10px] leading-none text-neutral-300 transition-colors hover:text-white"
    >
      {site.handle}
    </a>
  );
}

function StaticScreen() {
  const cfg = home.terminalShowcase;
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="mono-label mb-3">
          <EncryptedText text={cfg.kicker} />
        </p>
        <h2 id="terminal-h" className="display text-4xl text-ivory sm:text-5xl">
          {cfg.title}
        </h2>
      </div>
      <div className="term-frame h-[min(34rem,80svh)] bg-obsidian [--term-fs:0.78rem] sm:h-[38rem] sm:[--term-fs:0.86rem]">
        <Terminal />
      </div>
    </div>
  );
}
