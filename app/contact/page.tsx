import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { PageHeader } from "@/components/layout/PageHeader";
import { site } from "@/config/site";
import { socials } from "@/data/socials";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Contact",
  description: "Email, GitHub, LinkedIn and PGP key for Aditya Patil.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="contact"
        title="Contact"
        lead="Email is the quickest way to reach me."
      />
      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <ScrollReveal>
          <a
            href={`mailto:${site.email}`}
            className="inline-block break-all rounded-xl bg-accent px-6 py-4 font-mono text-base text-ivory transition-colors hover:bg-accent/80 sm:text-lg"
          >
            {site.email}
          </a>
        </ScrollReveal>

        <ScrollReveal className="mt-12">
          <ul className="divide-y divide-line border-y border-line">
            {socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  {...(s.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 py-4 transition-colors hover:bg-accent/10 sm:grid-cols-[12rem_1fr_auto]"
                >
                  <span className="text-ivory">{s.label}</span>
                  <span className="hidden break-all font-mono text-[0.8rem] text-stone sm:block">{s.handle ?? s.href}</span>
                  <ArrowUpRight size={16} aria-hidden className="text-stone transition-colors group-hover:text-ivory" />
                </a>
              </li>
            ))}
            {site.resumeUrl ? (
              <li>
                <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[1fr_auto] items-center gap-4 py-4 hover:bg-accent/10 sm:grid-cols-[12rem_1fr_auto]">
                  <span className="text-ivory">Résumé</span>
                  <span className="hidden font-mono text-[0.8rem] text-stone sm:block">PDF</span>
                  <ArrowUpRight size={16} aria-hidden className="text-stone group-hover:text-ivory" />
                </a>
              </li>
            ) : null}
          </ul>
          <p className="mt-6 max-w-xl font-mono text-[0.76rem] text-stone">
            Encrypted mail: my PGP key ({site.pgp.id}) is published on GitHub. Messages go to a DuckDuckGo email alias and are forwarded to me.
          </p>
        </ScrollReveal>
      </div>
    </>
  );
}
