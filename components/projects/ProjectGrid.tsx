"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Filterable grid. Order follows data/projects.ts. Without JavaScript, all projects are listed. */
export function ProjectGrid({ projects, showFilters = true }: { projects: Project[]; showFilters?: boolean }) {
  const tags = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tags))).sort((a, b) => a.localeCompare(b)), [projects]);
  const [tag, setTag] = useState<string | null>(null);
  const visible = tag ? projects.filter((p) => p.tags.includes(tag)) : projects;

  return (
    <div>
      {showFilters && tags.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by tag">
          {[null, ...tags].map((t) => {
            const active = t === tag;
            return (
              <button
                key={t ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => setTag(t)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-mono text-[0.76rem] transition-colors",
                  active ? "border-accent bg-accent/50 text-ivory" : "border-line text-stone hover:border-line-strong hover:text-ivory",
                )}
              >
                {active ? "● " : ""}
                {t ?? "all"}
              </button>
            );
          })}
        </div>
      )}
      <ul className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <li key={p.slug} className="flex min-w-0">
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>
      <p className="sr-only" role="status">
        {visible.length} projects shown
      </p>
    </div>
  );
}
