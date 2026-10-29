import { navItems } from "@/config/navigation";
import { site } from "@/config/site";
import { getProjects } from "@/lib/projects";
import {
  aboutDoc,
  achievementsDoc,
  certificationsDoc,
  contactDoc,
  educationDoc,
  experienceDoc,
  projectDoc,
  readmeDoc,
  skillsDoc,
} from "./documents";

/**
 * Read-only simulated filesystem built from the portfolio data.
 *   ~/about/about.md   ~/projects/<slug>.md   ~/experience/{experience,achievements,certifications}.md …
 * Nothing here touches a real filesystem.
 */

export interface VNode {
  name: string;
  /** e.g. "~", "~/projects", "~/projects/zero.md" */
  path: string;
  type: "dir" | "file";
  description: string;
  children?: VNode[];
  /** markdown content for files */
  read?: () => string;
  /** site route for section directories */
  href?: string;
}

function file(dir: string, name: string, description: string, read: () => string): VNode {
  return { name, path: `${dir}/${name}`, type: "file", description, read };
}

function dir(name: string, description: string, children: VNode[], href?: string): VNode {
  return { name, path: `~/${name}`, type: "dir", description, children, href };
}

export function buildTree(): VNode {
  const nav = (id: string) => navItems.find((n) => n.id === id)?.href;
  const sections: VNode[] = [
    dir("about", "Background and direction", [file("~/about", "about.md", "Introduction", aboutDoc)], nav("about")),
    dir(
      "projects",
      "Things I have built",
      getProjects().map((p) => file("~/projects", `${p.slug}.md`, p.summary, () => projectDoc(p.slug))),
      nav("projects"),
    ),
    dir("skills", "Tools and technologies", [file("~/skills", "skills.md", "Skills by category", skillsDoc)], nav("skills")),
    dir(
      "experience",
      "Work, leadership, awards",
      [
        file("~/experience", "experience.md", "Experience and activities", experienceDoc),
        file("~/experience", "achievements.md", "Awards", achievementsDoc),
        file("~/experience", "certifications.md", "Certifications", certificationsDoc),
      ],
      nav("experience"),
    ),
    dir("education", "Schools and qualifications", [file("~/education", "education.md", "Education", educationDoc)], nav("experience")),
    dir("contact", "Ways to reach me", [file("~/contact", "contact.md", "Contact methods", contactDoc)], nav("contact")),
  ];
  const files: VNode[] = [file("~", "README.md", "About this shell", readmeDoc)];
  if (site.resumeUrl) {
    files.push({ name: "resume.pdf", path: "~/resume.pdf", type: "file", description: "Résumé (opens in a new tab)" });
  }
  return { name: "~", path: "~", type: "dir", description: "Home", children: [...sections, ...files] };
}

export function listDir(node: VNode): VNode[] {
  return node.children ?? [];
}

function walk(node: VNode, fn: (n: VNode) => void) {
  fn(node);
  node.children?.forEach((c) => walk(c, fn));
}

export function allNodes(): VNode[] {
  const out: VNode[] = [];
  walk(buildTree(), (n) => out.push(n));
  return out;
}

/** Resolve a user-supplied path against the current directory. Case-insensitive. */
export function resolvePath(cwd: string, input: string): VNode | undefined {
  const tree = buildTree();
  let parts: string[];
  const cleaned = input.trim();
  if (cleaned === "" || cleaned === "~" || cleaned === "~/") return tree;
  if (cleaned.startsWith("~/")) parts = cleaned.slice(2).split("/");
  else if (cleaned.startsWith("/")) parts = cleaned.slice(1).split("/");
  else parts = [...cwd.split("/").filter((p) => p && p !== "~"), ...cleaned.split("/")];

  const stack: string[] = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  let node: VNode = tree;
  for (const seg of stack) {
    const next: VNode | undefined = node.children?.find((c) => c.name.toLowerCase() === seg.toLowerCase());
    if (!next) return undefined;
    node = next;
  }
  return node;
}

/** Find a file by bare name anywhere (so `cat about.md` works from `~`). Unique matches only. */
export function findFileByName(name: string): VNode | undefined {
  const lower = name.toLowerCase();
  const matches = allNodes().filter((n) => n.type === "file" && n.name.toLowerCase() === lower);
  return matches.length === 1 ? matches[0] : undefined;
}

export function promptPath(cwd: string): string {
  return cwd;
}
