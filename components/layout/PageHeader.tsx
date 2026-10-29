import type { ReactNode } from "react";
import { EncryptedText } from "@/components/typography/EncryptedText";

/** Shared page intro: mono eyebrow, serif title, lead paragraph. */
export function PageHeader({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-8 sm:pt-24">
      <p className="mono-label mb-4">
        <span className="text-accent-soft">~/</span>
        <EncryptedText text={eyebrow} />
      </p>
      <h1 className="display text-5xl text-ivory sm:text-7xl">{title}</h1>
      {lead ? <p className="prose-measure mt-6 text-lg text-ivory/80">{lead}</p> : null}
      {children}
    </header>
  );
}

export function Section({ id, title, kicker, children }: { id?: string; title: string; kicker?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      {kicker ? <p className="mono-label mb-2">{kicker}</p> : null}
      <h2 id={id ? `${id}-h` : undefined} className="display mb-8 text-3xl text-ivory sm:text-5xl">
        {title}
      </h2>
      {children}
    </section>
  );
}
