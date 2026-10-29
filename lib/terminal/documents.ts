import { about, home } from "@/data/home";
import { education, languages } from "@/data/education";
import { awards, certifications, experience } from "@/data/experience";
import { skillGroups } from "@/data/skills";
import { socials } from "@/data/socials";
import { site } from "@/config/site";
import { getProjects, getProject, statusLabels } from "@/lib/projects";

/** Markdown documents shown by `cat`. Generated from the same data as the pages. */

export function aboutDoc(): string {
  return [`# ${site.name} (${site.handle})`, "", home.intro, "", ...about.sections.flatMap((s) => [`## ${s.title}`, "", ...s.body.flatMap((p) => [p, ""])])].join("\n").trimEnd();
}

export function skillsDoc(): string {
  return skillGroups.flatMap((g) => [`## ${g.title}`, ...g.items.map((i) => `- ${i}`), ""]).join("\n").trimEnd();
}

export function experienceDoc(): string {
  return experience
    .flatMap((e) => [`## ${e.role}`, `${e.org} · ${e.period}`, ...(e.description ? ["", e.description] : []), ""])
    .join("\n")
    .trimEnd();
}

export function educationDoc(): string {
  return [
    ...education.flatMap((e) => [`## ${e.institution}`, `${e.period}${e.programme ? ` · ${e.programme}` : ""}`, ...e.points.map((p) => `- ${p}`), ""]),
    "## Languages",
    ...languages.map((l) => `- ${l}`),
  ].join("\n");
}

export function contactDoc(): string {
  return ["# Contact", "", ...socials.map((s) => `- ${s.label}: ${s.handle ?? s.href}`)].join("\n");
}

export function achievementsDoc(): string {
  return ["# Awards", "", ...awards.map((a) => `- ${a.year}: ${a.title} (${a.issuer})`)].join("\n");
}

export function certificationsDoc(): string {
  return ["# Certifications", "", ...certifications.map((c) => `- ${c.year}: ${c.title} (${c.issuer})${c.note ? `, ${c.note}` : ""}`)].join("\n");
}

export function projectDoc(slug: string): string {
  const p = getProject(slug);
  if (!p) return "";
  return [
    `# ${p.name}`,
    "",
    p.summary,
    "",
    ...(p.status ? [`status: ${statusLabels[p.status]}`] : []),
    ...(p.technologies.length ? [`tech: ${p.technologies.join(", ")}`] : []),
    ...(p.repoUrl ? [`repo: ${p.repoUrl}`] : []),
    ...(p.demoUrl ? [`demo: ${p.demoUrl}`] : []),
    "",
    ...p.overview.flatMap((o) => [o, ""]),
  ]
    .join("\n")
    .trimEnd();
}

export function readmeDoc(): string {
  return [
    `# ${site.handle}'s portfolio shell`,
    "",
    "This is a simulated shell. Try `help`, `projects`, `skills` or `cat about.md`.",
    "",
    `${getProjects().length} projects are indexed under ~/projects.`,
  ].join("\n");
}
