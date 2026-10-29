import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Section } from "@/components/layout/PageHeader";
import { home } from "@/data/home";
import { experience } from "@/data/experience";

export function Activities() {
  const entries = home.activities.highlightIds
    .map((id) => experience.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));
  return (
    <Section id="activities" kicker="$ cat ~/experience/experience.md" title={home.activities.title}>
      <ScrollReveal>
        <p className="prose-measure mb-8 text-ivory/75">{home.activities.intro}</p>
        <ul className="divide-y divide-line border-y border-line">
          {entries.map((e) => (
            <li key={e.id} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
              <div>
                <p className="text-ivory">{e.role}</p>
                <p className="text-sm text-stone">{e.org}</p>
              </div>
              <p className="font-mono text-[0.76rem] text-stone">{e.period}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link href="/experience/" className="font-mono text-sm text-ivory underline decoration-line-strong underline-offset-4 hover:decoration-accent-soft">
            Full experience, awards and certifications →
          </Link>
        </p>
      </ScrollReveal>
    </Section>
  );
}
