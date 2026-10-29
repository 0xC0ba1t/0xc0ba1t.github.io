import { terminalConfig } from "@/config/terminal";
import { closest } from "@/lib/terminal/parse";
import type { Command } from "@/lib/terminal/types";
import { allNodes, findFileByName, listDir, resolvePath } from "@/lib/terminal/vfs";
import { fail, ok, pathCandidates, text, toDisplayPath } from "./helpers";

export const pwd: Command = {
  name: "pwd",
  summary: "Print the working directory",
  run: (ctx) => ok(text(toDisplayPath(ctx.cwd, terminalConfig.username))),
};

export const ls: Command = {
  name: "ls",
  summary: "List sections and files",
  usage: "ls [path] [-l]",
  args: [{ name: "path", description: "directory to list", complete: (c, p) => pathCandidates(c, p, true) }],
  flags: [{ name: "l", description: "show descriptions" }],
  run: (ctx, args) => {
    const target = resolvePath(ctx.cwd, args.positional[0] ?? ".");
    if (!target) return fail(`ls: cannot access '${args.positional[0]}': No such file or directory`);
    if (target.type === "file") return ok(text(target.name));
    const long = args.flags.has("l");
    return ok({
      type: "list",
      items: listDir(target).map((n) => ({
        label: n.type === "dir" ? `${n.name}/` : n.name,
        detail: long ? n.description : undefined,
        command: n.type === "dir" ? `cd ${n.path}` : `cat ${n.path}`,
      })),
    });
  },
};

export const cd: Command = {
  name: "cd",
  summary: "Change directory (sections are directories)",
  usage: "cd <section>",
  args: [{ name: "section", description: "directory name, .. or ~", complete: (c, p) => pathCandidates(c, p, true) }],
  run: (ctx, args) => {
    const arg = args.positional[0];
    const target = resolvePath(ctx.cwd, arg ?? "~");
    if (!target) {
      const names = allNodes().filter((n) => n.type === "dir").map((n) => n.name.toLowerCase());
      const guess = arg ? closest(arg, names) : undefined;
      return fail(`cd: no such directory: ${arg}`, guess ? `Did you mean "${guess}"?` : 'Run "ls" to see what is here.');
    }
    if (target.type !== "dir") return fail(`cd: not a directory: ${arg}`, `Try "cat ${arg}" instead.`);
    return {
      output: target.href && target.path !== "~" ? [text(`Use "open ${target.name}" to visit the ${target.name} page.`, "muted")] : [],
      effects: [{ type: "cwd", cwd: target.path }],
    };
  },
};

export const cat: Command = {
  name: "cat",
  summary: "Print a document",
  usage: "cat <file>",
  args: [{ name: "file", required: true, description: "file name, e.g. about.md", complete: (c, p) => pathCandidates(c, p) }],
  run: (ctx, args) => {
    const arg = args.positional[0];
    if (!arg) return fail("usage: cat <file>", 'Run "ls" to see files.');
    const node = resolvePath(ctx.cwd, arg) ?? findFileByName(arg);
    if (!node) {
      const files = allNodes().filter((n) => n.type === "file").map((n) => n.name);
      const guess = closest(arg, files);
      return fail(`cat: ${arg}: No such file or directory`, guess ? `Did you mean "${guess}"?` : undefined);
    }
    if (node.type === "dir") return fail(`cat: ${arg}: Is a directory`, `Try "ls ${arg}".`);
    if (!node.read) return fail(`cat: ${arg}: binary file`, 'Use "resume" to open it.');
    return ok({ type: "code", lang: "md", code: node.read() });
  },
};
