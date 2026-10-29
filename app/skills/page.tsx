import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { PageHeader } from "@/components/layout/PageHeader";
import { skillGroups } from "@/data/skills";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Skills",
  description: "Languages, tools and technologies Aditya Patil works with, grouped by area.",
  path: "/skills/",
});

export default function SkillsPage() {
  return (
    <>
      <PageHeader eyebrow="skills" title="Skills" lead="" />
      <div className="mx-auto grid max-w-6xl gap-5 px-5 pb-12 sm:px-8 md:grid-cols-2">
        {skillGroups.map((g) => (
          <ScrollReveal key={g.id}>
            <section id={g.id} aria-labelledby={`${g.id}-h`} className="h-full rounded-2xl border border-line bg-surface p-6">
              <h2 id={`${g.id}-h`} className="text-xl font-medium text-ivory">
                {g.title}
              </h2>
              {g.blurb ? <p className="mt-1 text-sm text-stone">{g.blurb}</p> : null}
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {g.items.map((it) => (
                  <li key={it} className="font-mono text-[0.8rem] text-ivory/85 before:mr-1 before:text-accent-soft before:content-['/']">
                    {it}
                  </li>
                ))}
              </ul>
            </section>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}
