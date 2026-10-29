import Link from "next/link";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Section } from "@/components/layout/PageHeader";
import { getFeaturedProjects } from "@/lib/projects";

export function FeaturedProjects() {
  const featured = getFeaturedProjects();
  if (featured.length === 0) return null;
  return (
    <Section id="work" kicker="$ ls ~/projects --featured" title="Selected work">
      <ScrollReveal>
        <ProjectGrid projects={featured} showFilters={false} />
        <p className="mt-8">
          <Link href="/projects/" className="font-mono text-sm text-ivory underline decoration-line-strong underline-offset-4 hover:decoration-accent-soft">
            All projects →
          </Link>
        </p>
      </ScrollReveal>
    </Section>
  );
}
