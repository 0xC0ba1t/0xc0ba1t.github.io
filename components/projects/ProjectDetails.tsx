import Link from "next/link";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectThumb } from "./ProjectThumb";
import { getProjects, projectHref, statusLabels } from "@/lib/projects";
import type { Project } from "@/lib/types";

export function ProjectDetails({ project }: { project: Project }) {
  const all = getProjects();
  const i = all.findIndex((p) => p.slug === project.slug);
  const prev = i > 0 ? all[i - 1] : undefined;
  const next = i < all.length - 1 ? all[i + 1] : undefined;

  return (
    <article className="mx-auto max-w-6xl px-5 pb-12 pt-16 sm:px-8 sm:pt-24">
      <nav aria-label="Breadcrumb" className="mono-label mb-6">
        <Link href="/projects/" className="underline-offset-4 hover:text-ivory hover:underline">
          ~/projects
        </Link>
        <span className="text-accent-soft"> / </span>
        <span className="text-ivory">{project.slug}</span>
      </nav>
      <h1 className="display text-5xl text-ivory sm:text-7xl">{project.name}</h1>
      <p className="prose-measure mt-5 text-lg text-ivory/80">{project.summary}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-line">
            <ProjectThumb project={project} />
          </div>
          <div className="prose-measure space-y-4 text-ivory/85">
            {project.overview.map((p, idx) => (
              <p key={idx}>{renderInlineCode(p)}</p>
            ))}
          </div>
          {project.details?.length ? (
            <div className="mt-10 space-y-6">
              {project.details.map((d) => (
                <section key={d.title}>
                  <h2 className="mb-1 text-lg font-medium text-ivory">{d.title}</h2>
                  <p className="prose-measure text-ivory/80">{d.body}</p>
                </section>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-surface p-5">
          <dl className="space-y-4 text-sm">
            {project.status ? (
              <Row label="status">{statusLabels[project.status]}</Row>
            ) : null}
            {project.license ? <Row label="license">{project.license}</Row> : null}
            {project.technologies.length ? <Row label="stack">{project.technologies.join(", ")}</Row> : null}
            {project.tags.length ? <Row label="tags">{project.tags.join(", ")}</Row> : null}
          </dl>
          <div className="mt-5">
            <ProjectLinks project={project} />
          </div>
        </aside>
      </div>

      <nav aria-label="More projects" className="mt-16 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <Link href={projectHref(prev)} className="rounded-xl border border-line p-4 transition-colors hover:border-line-strong">
            <span className="mono-label">← previous</span>
            <span className="mt-1 block text-ivory">{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={projectHref(next)} className="rounded-xl border border-line p-4 text-right transition-colors hover:border-line-strong">
            <span className="mono-label">next →</span>
            <span className="mt-1 block text-ivory">{next.name}</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="mono-label">{label}</dt>
      <dd className="text-ivory">{children}</dd>
    </div>
  );
}

/** Renders `code` spans from overview text. */
function renderInlineCode(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") ? (
      <code key={i} className="tok-code font-mono text-[0.9em]">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}
