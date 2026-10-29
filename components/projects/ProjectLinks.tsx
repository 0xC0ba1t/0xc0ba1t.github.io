import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

const btn =
  "inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3.5 py-2 font-mono text-[0.78rem] text-ivory transition-colors hover:border-accent hover:bg-accent/30";

/** Only renders buttons for links that exist. */
export function ProjectLinks({ project }: { project: Project }) {
  if (!project.repoUrl && !project.demoUrl) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {project.repoUrl ? (
        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={btn}>
          Repository <ArrowUpRight size={14} aria-hidden />
        </a>
      ) : null}
      {project.demoUrl ? (
        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={btn}>
          Live site <ArrowUpRight size={14} aria-hidden />
        </a>
      ) : null}
    </div>
  );
}
