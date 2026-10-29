"use client";

import dynamic from "next/dynamic";
import { ArrowDown } from "lucide-react";
import { NoiseBackground } from "@/components/backgrounds/NoiseBackground";
import { EncryptedText } from "@/components/typography/EncryptedText";
import { FlipWords } from "@/components/typography/FlipWords";
import { TextFlippingBoard } from "@/components/typography/TextFlippingBoard";
import { home } from "@/data/home";
import { site } from "@/config/site";

// WebGL is client-only and loaded lazily; the static mask shows until it is ready.
const DitherBackground = dynamic(() => import("@/components/backgrounds/DitherBackground").then((m) => m.DitherBackground), {
  ssr: false,
  loading: () => null,
});

export function Hero() {
  return (
    <NoiseBackground className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="absolute inset-0 z-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
        <DitherBackground className="absolute inset-0" />
      </div>
      <div aria-hidden className="absolute inset-0 z-0 bg-gradient-to-b from-obsidian/70 via-obsidian/35 to-obsidian" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-5 pb-12 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:pb-16 lg:pt-24">
        <div className="min-w-0">
          <p className="mono-label mb-5 flex flex-wrap items-center gap-x-3">
            <span className="text-ivory">{site.handle}(1)</span>
            <span aria-hidden className="text-line-strong">/</span>
            <EncryptedText text={home.eyebrow} delayMs={250} />
          </p>

          <h1 className="display text-[2.6rem] text-ivory sm:text-6xl lg:text-[4.1rem]">{home.headline}</h1>
          <p className="prose-measure mt-6 text-base text-ivory/80 sm:text-lg">{home.intro}</p>

          <p className="mt-5 min-h-[3.3em] text-ivory/70">
            {home.flipWords.lead}{" "}
            <FlipWords words={home.flipWords.words} className="font-serif text-xl italic text-accent-soft" />
            {home.flipWords.tail}
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-7 gap-y-1.5 font-mono text-[0.72rem]">
            {home.systemPanel.map((row) => (
              <div key={row.key} className="flex gap-2">
                <dt className="text-accent-soft">{row.key}</dt>
                <dd className="text-stone">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0">
          <p className="mono-label mb-3">
            <span className="text-accent-soft">$ </span>
            {home.boardLabel}
          </p>
          <TextFlippingBoard messages={home.boardMessages} />
        </div>
      </div>

      <a
        href="#terminal"
        className="relative z-10 mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-line px-4 py-1.5 font-mono text-[0.72rem] text-stone transition-colors hover:border-line-strong hover:text-ivory"
      >
        {home.scrollCue}
        <ArrowDown size={13} aria-hidden className="animate-bounce" />
      </a>
    </NoiseBackground>
  );
}
