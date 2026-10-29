import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { Section } from "@/components/layout/PageHeader";
import { home } from "@/data/home";
import { skillGroups } from "@/data/skills";

export function SkillsOverview() {
  const groups = home.skillsOverview.highlightGroups
    .map((id) => skillGroups.find((g) => g.id === id))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  return (
    <Section id="skills-overview" kicker="$ cat ~/skills/skills.md" title={home.skillsOverview.title}>
      <ScrollReveal>
        <p className="prose-measure mb-8 text-ivory/75">{home.skillsOverview.intro}</p>
      </ScrollReveal>
      <StaggerContainer className="grid gap-5 sm:grid-cols-2">
        {groups.map((g) => (
          <StaggerItem key={g.id}>
            <div className="h-full rounded-2xl border border-line bg-surface p-5">
              <h3 className="mb-3 text-lg font-medium text-ivory">{g.title}</h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                {g.items.slice(0, 7).map((it) => (
                  <li key={it} className="font-mono text-[0.76rem] text-stone before:mr-1 before:text-accent-soft before:content-['/']">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
      <p className="mt-8">
        <Link href="/skills/" className="font-mono text-sm text-ivory underline decoration-line-strong underline-offset-4 hover:decoration-accent-soft">
          Everything, by category →
        </Link>
      </p>
    </Section>
  );
}
