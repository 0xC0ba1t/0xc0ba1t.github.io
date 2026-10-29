import { navItems } from "@/config/navigation";
import { getProjects, findProject, projectHref, statusLabels } from "@/lib/projects";
import { closest } from "@/lib/terminal/parse";
import type { Command, CommandResult } from "@/lib/terminal/types";
import { resolvePath } from "@/lib/terminal/vfs";
import { fail, heading, ok, spacer, text } from "./helpers";

const projectNames = () => getProjects().map((p) => p.slug);

function notFound(query: string): CommandResult {
  const guess = closest(query, projectNames());
  return fail(`project: no project matches "${query}"`, guess ? `Did you mean "${guess}"?` : 'Run "projects" to list them.');
}

export const projectsCmd: Command = {
  name: "projects",
  aliases: ["ls-projects"],
  summary: "List projects",
  run: () =>
    ok(
      {
        type: "list",
        items: getProjects().map((p) => ({
          label: p.slug,
          detail: `${p.summary}${p.status ? ` [${statusLabels[p.status].toLowerCase()}]` : ""}`,
          command: `project ${p.slug}`,
        })),
      },
      spacer(),
      text('Use "project <name>" for details or "open <name>" to visit its page.', "muted"),
    ),
};

export const projectCmd: Command = {
  name: "project",
  summary: "Show one project's details",
  usage: "project <name>",
  args: [{ name: "name", required: true, description: "project slug or name", complete: (_c, partial) => projectNames().filter((n) => n.startsWith(partial.toLowerCase())) }],
  run: (_ctx, args) => {
    const query = args.positional.join(" ");
    if (!query) return fail("usage: project <name>", 'Run "projects" to see the list.');
    const result = findProject(query);
    if (result.kind === "none") return notFound(query);
    if (result.kind === "ambiguous") {
      return {
        output: [
          text(`"${query}" matches several projects:`, "error"),
          { type: "list", items: result.matches.map((p) => ({ label: p.slug, detail: p.summary, command: `project ${p.slug}` })) },
        ],
      };
    }
    const p = result.project;
    const rows: { key: string; value: string; href?: string }[] = [];
    if (p.status) rows.push({ key: "status", value: statusLabels[p.status].toLowerCase() });
    if (p.technologies.length) rows.push({ key: "tech", value: p.technologies.join(", ") });
    if (p.tags.length) rows.push({ key: "tags", value: p.tags.join(", ") });
    if (p.license) rows.push({ key: "license", value: p.license });
    if (p.repoUrl) rows.push({ key: "repo", value: p.repoUrl, href: p.repoUrl });
    if (p.demoUrl) rows.push({ key: "demo", value: p.demoUrl, href: p.demoUrl });
    return ok(
      heading(p.name),
      text(p.summary, "muted"),
      spacer(),
      ...p.overview.map((o) => text(o)),
      spacer(),
      { type: "kv", rows },
      spacer(),
      text(`open ${p.slug}${p.repoUrl ? `   ·   open ${p.slug} --repo` : ""}`, "accent"),
    );
  },
};

export const openCmd: Command = {
  name: "open",
  aliases: ["goto"],
  summary: "Open a project page, a section, or a repository",
  usage: "open <project|section> [--repo] [--demo]",
  args: [
    {
      name: "target",
      required: true,
      description: "project or section name",
      complete: (_c, partial) =>
        [...projectNames(), ...navItems.map((n) => n.id)].filter((n) => n.startsWith(partial.toLowerCase())),
    },
  ],
  flags: [
    { name: "repo", description: "open the GitHub repository instead" },
    { name: "demo", description: "open the live demo instead" },
  ],
  run: (ctx, args) => {
    const target = args.positional.join(" ").trim();
    if (!target) return fail("usage: open <project|section> [--repo] [--demo]");

    // sections
    const lower = target.toLowerCase().replace(/\/$/, "");
    const section = navItems.find((n) => n.id === lower || n.label.toLowerCase() === lower);
    if (section) return { output: [text(`Opening ${section.href}`, "success")], effects: [{ type: "navigate", href: section.href }] };

    // current directory
    if (target === ".") {
      const here = resolvePath(ctx.cwd, ".");
      if (here?.href) return { output: [text(`Opening ${here.href}`, "success")], effects: [{ type: "navigate", href: here.href }] };
      return { output: [text("Opening /", "success")], effects: [{ type: "navigate", href: "/" }] };
    }

    const result = findProject(target);
    if (result.kind === "none") return notFound(target);
    if (result.kind === "ambiguous") return fail(`open: "${target}" is ambiguous`, result.matches.map((m) => m.slug).join(", "));
    const p = result.project;

    if (args.flags.has("repo")) {
      if (!p.repoUrl) return fail(`open: ${p.slug} has no repository link`);
      return { output: [text(`Opening ${p.repoUrl}`, "success")], effects: [{ type: "open", url: p.repoUrl }] };
    }
    if (args.flags.has("demo")) {
      if (!p.demoUrl) return fail(`open: ${p.slug} has no live demo`);
      return { output: [text(`Opening ${p.demoUrl}`, "success")], effects: [{ type: "open", url: p.demoUrl }] };
    }
    return { output: [text(`Opening ${projectHref(p)}`, "success")], effects: [{ type: "navigate", href: projectHref(p) }] };
  },
};
