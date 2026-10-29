import type { Project } from "@/lib/types";
import { asset, cn } from "@/lib/utils";

/** Image when configured; otherwise a deliberate typographic fallback built from the project name. */
export function ProjectThumb({ project, className }: { project: Project; className?: string }) {
  const img = project.images?.[0];
  if (img) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset(img.src)} alt={img.alt} loading="lazy" className={cn("size-full object-cover", className)} />;
  }
  return (
    <div aria-hidden className={cn("relative flex size-full items-end overflow-hidden bg-surface-2 p-4", className)}>
      <div className="dither-static" style={{ ["--dither-mask" as string]: `url(${asset("/images/dither-mask.png")})`, opacity: 0.22 }} />
      <span className="display relative text-5xl text-ivory/90">{project.name.slice(0, 2).toLowerCase()}</span>
    </div>
  );
}
