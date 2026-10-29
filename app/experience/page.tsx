import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { PageHeader, Section } from "@/components/layout/PageHeader";
import { education, languages } from "@/data/education";
import { awards, certifications, experience } from "@/data/experience";
import type { ExperienceEntry } from "@/lib/types";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Experience",
  description: "Work experience, leadership, volunteering, education, awards and certifications of Aditya Patil.",
  path: "/experience/",
});

const groups: { kind: ExperienceEntry["kind"]; title: string }[] = [
  { kind: "work", title: "Work experience" },
  { kind: "leadership", title: "Leadership" },
  { kind: "volunteering", title: "Volunteering" },
  { kind: "activity", title: "Activities" },
];

export default function ExperiencePage() {
  return (
    <>
      <PageHeader eyebrow="experience" title="Experience" lead="Work placements, leadership, volunteering and qualifications." />

      {groups.map((g) => {
        const entries = experience.filter((e) => e.kind === g.kind);
        if (entries.length === 0) return null;
        return (
          <Section key={g.kind} id={g.kind} title={g.title}>
            <ul className="divide-y divide-line border-y border-line">
              {entries.map((e) => (
                <li key={e.id}>
                  <ScrollReveal className="grid gap-2 py-5 md:grid-cols-[1fr_2fr_auto] md:gap-8">
                    <div>
                      <h3 className="text-ivory">{e.role}</h3>
                      <p className="text-sm text-stone">{e.org}</p>
                    </div>
                    <div className="prose-measure text-sm text-ivory/80">
                      {e.description ? <p>{e.description}</p> : null}
                      {e.points?.length ? (
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          {e.points.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    <p className="font-mono text-[0.76rem] text-stone md:text-right">{e.period}</p>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}

      <Section id="education" title="Education">
        <ul className="divide-y divide-line border-y border-line">
          {education.map((e) => (
            <li key={e.id}>
              <ScrollReveal className="grid gap-2 py-5 md:grid-cols-[1fr_2fr_auto] md:gap-8">
                <div>
                  <h3 className="text-ivory">{e.institution}</h3>
                  {e.programme ? <p className="text-sm text-stone">{e.programme}</p> : null}
                </div>
                <div className="prose-measure text-sm text-ivory/80">
                  {e.points.length ? (
                    <ul className="list-disc space-y-1 pl-5">
                      {e.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <p className="font-mono text-[0.76rem] text-stone md:text-right">{e.period}</p>
              </ScrollReveal>
            </li>
          ))}
        </ul>
        {languages.length ? (
          <p className="mt-6 font-mono text-[0.78rem] text-stone">
            <span className="text-accent-soft">languages</span> {languages.join(" · ")}
          </p>
        ) : null}
      </Section>

      <Section id="awards" title="Awards">
        <ul className="divide-y divide-line border-y border-line">
          {awards.map((a) => (
            <li key={a.id} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto] sm:gap-6">
              <p className="text-ivory/90">
                {a.title} <span className="text-stone">· {a.issuer}</span>
              </p>
              <p className="font-mono text-[0.76rem] text-stone">{a.year}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="certifications" title="Certifications">
        <ul className="divide-y divide-line border-y border-line">
          {certifications.map((c) => (
            <li key={c.id} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto] sm:gap-6">
              <p className="text-ivory/90">
                {c.title} <span className="text-stone">· {c.issuer}</span>
                {c.note ? <span className="text-stone"> ({c.note})</span> : null}
              </p>
              <p className="font-mono text-[0.76rem] text-stone">{c.year}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
