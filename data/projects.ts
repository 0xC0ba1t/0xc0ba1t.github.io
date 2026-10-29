import type { Project } from "@/lib/types";
import { tr } from "motion/react-client";

/**
 * Single source of truth for projects. Used by the cards, detail pages, the
 * terminal (`projects`, `project <name>`, `open <name>`).
 *
 * - Add a project: add one object. Remove: delete it. Reorder: move it.
 * - Optional fields (repoUrl, demoUrl, images, status…) can simply be omitted.
 * - Everything below comes from the public repositories and the previous site.
 *   Technologies marked "(from file names)" were inferred from the repo layout —
 *   adjust if they're wrong.
 */
export const projects: Project[] = [
  {
    slug: "prettyprint",
    name: "prettyprint",
    summary: "Stable diffusion implementation in PyTorch.",
    overview: [
      "prettyprint is my from-scratch implementation of stable diffusion in Python and PyTorch. It is my current project and the one I treat as my main ML project.",
      "The repository has an `sd` package and a `main.py` entry point. The README credits the learning resources I followed: a YouTube walkthrough and the slides from the hkproj pytorch-stable-diffusion project.",
    ],
    technologies: ["Python", "PyTorch"],
    tags: ["AI / ML", "Generative models"],
    repoUrl: "https://github.com/0xC0ba1t/prettyprint",
    status: "in-progress",
    featured: false,
    license: "Apache-2.0",
  },
  {
    slug: "zero",
    name: "zero",
    summary: "A tiny operating system written in Rust.",
    overview: [
      "zero is a small operating system written in Rust. I describe it as my most ambitious project so far.",
      "The repository uses a custom x86_64 target specification (`x86_64-zero.json`), a Makefile, integration tests and GitHub Actions workflows, and is developed on the `v2` branch.",
    ],
    technologies: ["Rust"],
    tags: ["Systems", "Low-level"],
    repoUrl: "https://github.com/0xC0ba1t/zero",
    status: "active",
    featured: true,
    license: "MIT",
  },
  {
    slug: "snapdragonllm",
    name: "SnapdragonLLM",
    summary: "A tiny language model in Python, built by following Andrej Karpathy.",
    overview: [
      "SnapdragonLLM is a small language model I wrote while following Andrej Karpathy's teaching material. It is intentionally simple: the goal was to understand the training loop and the architecture, not to compete with anything.",
      "A second version is in progress on the `v2` branch.",
    ],
    technologies: ["Python"],
    tags: ["AI / ML", "Language models"],
    repoUrl: "https://github.com/0xC0ba1t/SnapdragonLLM",
    status: "in-progress",
    featured: true,
    license: "AGPL-3.0",
  },
  {
    slug: "conway",
    name: "conway",
    summary: "Conway's Game of Life in React and Tailwind.",
    overview: [
      "A relatively simple implementation of Conway's Game of Life using React and Tailwind CSS.",
    ],
    // TypeScript and Vite inferred from tsconfig/vite.config.ts (from file names)
    technologies: ["React", "Tailwind CSS", "TypeScript", "Vite"],
    tags: ["Web", "Simulation"],
    repoUrl: "https://github.com/0xC0ba1t/conway",
    license: "Apache-2.0",
  },
  {
    slug: "singularity",
    name: "Singularity",
    summary: "A robotics project from my time in the school's Advanced Robotics team.",
    overview: [
      "An older project from The Roman Ridge School's Advanced Robotics team. I consider it abandoned, but it's still part of how I got into hardware and robotics.",
    ],
    technologies: [],
    tags: ["Robotics"],
    repoUrl: "https://github.com/trrsrobotics/Singularity",
    status: "archived",
  },
  {
    slug: "portfolio",
    name: "This website",
    summary: "The terminal-inspired portfolio you're looking at, built as a static Next.js site.",
    overview: [
      "A data-driven portfolio: content, theme, motion and feature flags all live in config and data files. The interactive terminal and the pages read the same project records.",
      "It is a fully static export hosted on GitHub Pages, with no backend.",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "WebGL"],
    tags: ["Web"],
    repoUrl: "https://github.com/0xC0ba1t/0xc0ba1t.github.io",
    demoUrl: "https://c0ba1t.is-a.dev/",
    status: "live",
  },
];
