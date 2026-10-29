import { themes } from "@/config/theme";
import { site } from "@/config/site";
import { terminalConfig } from "@/config/terminal";
import { education, languages } from "@/data/education";
import { getProjects } from "@/lib/projects";
import type { Command } from "@/lib/terminal/types";
import { fail, heading, ok, spacer, text } from "./helpers";

export const help: Command = {
  name: "help",
  aliases: ["man"],
  summary: "List commands, or explain one",
  usage: "help [command]",
  args: [{ name: "command", description: "command to describe", complete: (c, p) => c.commands.map((x) => x.name).filter((n) => n.startsWith(p.toLowerCase())) }],
  run: (ctx, args) => {
    const q = args.positional[0]?.toLowerCase();
    if (q) {
      const cmd = ctx.commands.find((c) => c.name === q || c.aliases?.includes(q));
      if (!cmd) return fail(`help: no help for "${q}"`, 'Run "help" for the list.');
      return ok(
        heading(cmd.name),
        text(cmd.summary),
        ...(cmd.usage ? [{ type: "kv" as const, rows: [{ key: "usage", value: cmd.usage }] }] : []),
        ...(cmd.args?.length ? [{ type: "kv" as const, rows: cmd.args.map((a) => ({ key: a.name + (a.required ? "*" : ""), value: a.description })) }] : []),
        ...(cmd.flags?.length ? [{ type: "kv" as const, rows: cmd.flags.map((f) => ({ key: `--${f.name}`, value: f.description })) }] : []),
        ...(cmd.aliases?.length ? [text(`aliases: ${cmd.aliases.join(", ")}`, "muted")] : []),
      );
    }
    return ok(
      { type: "list", items: ctx.commands.map((c) => ({ label: c.usage ?? c.name, detail: c.summary, command: c.usage ? undefined : c.name })) },
      spacer(),
      text("Tab completes · ↑/↓ browse history · Ctrl+L clears · this shell is simulated and never runs real commands", "muted"),
    );
  },
};

export const clear: Command = {
  name: "clear",
  summary: "Clear the screen",
  run: () => ({ output: [], effects: [{ type: "clear" }] }),
};

export const date: Command = {
  name: "date",
  summary: "Your local date and time",
  run: (ctx) =>
    ok(
      text(
        ctx.now.toLocaleString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        }),
      ),
    ),
};

export const historyCmd: Command = {
  name: "history",
  summary: "Commands you have run",
  run: (ctx) =>
    ctx.history.length === 0
      ? ok(text("No commands yet.", "muted"))
      : ok({ type: "list", items: ctx.history.map((h, i) => ({ label: `${String(i + 1).padStart(3, " ")}  ${h}`, command: h })) }),
};

export const echo: Command = {
  name: "echo",
  summary: "Print text",
  usage: "echo <text>",
  run: (_ctx, args) => ok(text(args.positional.join(" "))),
};

export const neofetch: Command = {
  name: "neofetch",
  summary: "System-information panel",
  run: (ctx) => {
    const theme = themes.find((t) => t.id === ctx.theme)?.label ?? ctx.theme;
    const school = education[0];
    return ok({
      type: "neofetch",
      art: ["╭─────────╮", "│  c  0  b│", "│  a  1  t│", "╰─────────╯"],
      rows: [
        { key: "user", value: `${terminalConfig.username}@${terminalConfig.hostname}` },
        { key: "name", value: site.name },
        { key: "role", value: site.role.toLowerCase() },
        { key: "study", value: school.programme ?? school.institution },
        { key: "languages", value: ["Python", "Rust", "C/C++", "TypeScript"].join(", ") },
        { key: "speaks", value: languages.slice(0, 3).map((l) => l.split(" ")[0]).join(", ") },
        { key: "projects", value: String(getProjects().length) },
        { key: "theme", value: theme },
        { key: "site", value: "Next.js static export on GitHub Pages" },
        { key: "shell", value: "portfolio (simulated)" },
      ],
    });
  },
};

export const theme: Command = {
  name: "theme",
  summary: "Show or change the colour theme",
  usage: "theme [name]",
  args: [{ name: "name", description: "theme id", complete: (_c, p) => themes.map((t) => t.id).filter((id) => id.startsWith(p.toLowerCase())) }],
  run: (ctx, args) => {
    const q = args.positional.join(" ").toLowerCase().trim();
    if (!q) {
      return ok(
        {
          type: "list",
          items: themes.map((t) => ({
            label: `${t.id === ctx.theme ? "*" : " "} ${t.id}`,
            detail: t.description,
            command: `theme ${t.id}`,
          })),
        },
        text("* marks the current theme.", "muted"),
      );
    }
    const match = themes.find((t) => t.id === q || t.label.toLowerCase() === q) ?? themes.find((t) => t.id.startsWith(q));
    if (!match) return fail(`theme: unknown theme "${q}"`, `Available: ${themes.map((t) => t.id).join(", ")}`);
    return { output: [text(`Theme set to ${match.label}.`, "success")], effects: [{ type: "theme", id: match.id }] };
  },
};
