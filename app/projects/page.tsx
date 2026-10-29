import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { getProjects } from "@/lib/projects";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Projects",
  description: "Projects by Aditya Patil: stable diffusion in PyTorch, a Rust operating system, a small language model and more.",
  path: "/projects/",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHeader eyebrow="projects" title="Projects" lead="Things I built to understand how they work. Filter by tag, or open one for details." />
      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <ProjectGrid projects={getProjects()} />
      </div>
    </>
  );
}
