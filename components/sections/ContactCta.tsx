import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { home } from "@/data/home";
import { site } from "@/config/site";

export function ContactCta() {
  return (
    <section aria-labelledby="cta-h" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <ScrollReveal>
        <div className="rounded-3xl border border-line-strong bg-surface p-8 sm:p-12">
          <h2 id="cta-h" className="display text-4xl text-ivory sm:text-6xl">
            {home.contactCta.title}
          </h2>
          <p className="prose-measure mt-4 text-ivory/80">{home.contactCta.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="rounded-lg bg-accent px-5 py-2.5 font-mono text-sm text-ivory transition-colors hover:bg-accent/80"
            >
              {site.email}
            </a>
            <Link href="/contact/" className="rounded-lg border border-line-strong px-5 py-2.5 font-mono text-sm text-ivory transition-colors hover:border-accent hover:bg-accent/25">
              {home.contactCta.button}
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
