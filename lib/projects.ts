import { projects } from "@/data/projects";
import type { Project, ProjectStatus } from "@/lib/types";

export const statusLabels: Record<ProjectStatus, string> = {
  live: "Live",
  active: "Active",
  "in-progress": "In progress",
  paused: "Paused",
  archived: "Archived",
};

export function getProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug.toLowerCase());
}

export function getAllTags(): string[] {
  return Array.from(new Set(projects.flatMap((p) => p.tags))).sort((a, b) => a.localeCompare(b));
}

export type ProjectLookup =
  | { kind: "found"; project: Project }
  | { kind: "ambiguous"; matches: Project[] }
  | { kind: "none" };

/** Resolve user input (slug, name, prefix, substring) to a project. Shared by the terminal. */
export function findProject(query: string): ProjectLookup {
  const q = query.trim().toLowerCase().replace(/\.md$/, "");
  if (!q) return { kind: "none" };
  const exact = projects.find((p) => p.slug === q || p.name.toLowerCase() === q);
  if (exact) return { kind: "found", project: exact };
  const prefix = projects.filter((p) => p.slug.startsWith(q) || p.name.toLowerCase().startsWith(q));
  if (prefix.length === 1) return { kind: "found", project: prefix[0] };
  if (prefix.length > 1) return { kind: "ambiguous", matches: prefix };
  const contains = projects.filter((p) => p.slug.includes(q) || p.name.toLowerCase().includes(q));
  if (contains.length === 1) return { kind: "found", project: contains[0] };
  if (contains.length > 1) return { kind: "ambiguous", matches: contains };
  return { kind: "none" };
}

export function projectHref(project: Project): string {
  return `/projects/${project.slug}/`;
}
