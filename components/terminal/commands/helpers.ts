import type { CommandContext, CommandResult, OutputNode, Tone } from "@/lib/terminal/types";
import { allNodes, resolvePath } from "@/lib/terminal/vfs";

export const text = (t: string, tone: Tone = "default"): OutputNode => ({ type: "text", text: t, tone });
export const heading = (t: string): OutputNode => ({ type: "heading", text: t });
export const spacer = (): OutputNode => ({ type: "spacer" });

export function ok(...output: OutputNode[]): CommandResult {
  return { output };
}

export function fail(message: string, hint?: string): CommandResult {
  return { output: [text(message, "error"), ...(hint ? [text(hint, "muted")] : [])] };
}

/** `~/projects` → `/home/<user>/projects` for display in `pwd`. */
export function toDisplayPath(cwd: string, username: string): string {
  return cwd === "~" ? `/home/${username}` : `/home/${username}${cwd.slice(1)}`;
}

/** Completion candidates for path arguments, relative to the current directory. */
export function pathCandidates(ctx: CommandContext, partial: string, dirsOnly = false): string[] {
  const slash = partial.lastIndexOf("/");
  const dirPart = slash >= 0 ? partial.slice(0, slash + 1) : "";
  const namePart = slash >= 0 ? partial.slice(slash + 1) : partial;
  const base = resolvePath(ctx.cwd, dirPart || ".");
  if (!base || base.type !== "dir") return [];
  const names = (base.children ?? [])
    .filter((c) => (dirsOnly ? c.type === "dir" : true))
    .map((c) => dirPart + c.name + (c.type === "dir" ? "/" : ""))
    .filter((n) => n.toLowerCase().startsWith((dirPart + namePart).toLowerCase()));
  // For `cat`, also offer bare filenames from anywhere when nothing is typed with a slash.
  if (!dirsOnly && slash < 0) {
    const extra = allNodes()
      .filter((n) => n.type === "file" && n.name.toLowerCase().startsWith(namePart.toLowerCase()))
      .map((n) => n.name);
    return Array.from(new Set([...names, ...extra]));
  }
  return names;
}
