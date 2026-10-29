import Link from "next/link";
import { ProjectThumb } from "./ProjectThumb";
import { projectHref, statusLabels } from "@/lib/projects";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-line-strong focus-within:border-line-strong">
      <div className="aspect-[16/9] shrink-0 border-b border-line">
        <ProjectThumb project={project} />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-medium text-ivory">
            <Link href={projectHref(project)} className="after:absolute after:inset-0 after:content-['']">
              {project.name}
            </Link>
          </h3>
          {project.status ? (
            <span className="shrink-0 rounded-full border border-line-strong px-2 py-0.5 font-mono text-[0.66rem] text-stone">
              {statusLabels[project.status]}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-ivory/75">{project.summary}</p>
        {project.technologies.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Technologies">
            {project.technologies.map((t) => (
              <li key={t} className="font-mono text-[0.7rem] text-stone before:mr-1 before:text-accent-soft before:content-['/']">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
