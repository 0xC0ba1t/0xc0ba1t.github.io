import { terminalConfig } from "@/config/terminal";
import { closest, parseArgs, tokenize } from "./parse";
import type { Command, CommandContext, CommandResult } from "./types";

/** Expand a configured alias in the first word (one level only). */
export function expandAlias(line: string): string {
  const trimmed = line.trim();
  const [first, ...rest] = trimmed.split(/\s+/);
  const expansion = terminalConfig.aliases[first];
  return expansion ? [expansion, ...rest].join(" ") : trimmed;
}

function lookup(commands: Command[], name: string): Command | undefined {
  const n = name.toLowerCase();
  return commands.find((c) => c.name === n || c.aliases?.includes(n));
}

/** Parse and run one command line. Returns null for empty input. Never throws. */
export function execute(line: string, ctx: CommandContext): CommandResult | null {
  const expanded = expandAlias(line);
  if (!expanded) return null;
  const tokens = tokenize(expanded);
  if (tokens.length === 0) return null;
  const [name, ...rest] = tokens;
  const command = lookup(ctx.commands, name);
  if (!command) {
    const guess = closest(name, ctx.commands.map((c) => c.name));
    return {
      output: [
        { type: "text", text: `command not found: ${name}`, tone: "error" },
        { type: "text", text: guess ? `Did you mean "${guess}"? Run "help" for all commands.` : 'Run "help" for the list of commands.', tone: "muted" },
      ],
    };
  }
  try {
    return command.run(ctx, parseArgs(rest, rest.join(" ")));
  } catch {
    return { output: [{ type: "text", text: `${command.name}: something went wrong`, tone: "error" }] };
  }
}

function commonPrefix(values: string[]): string {
  if (values.length === 0) return "";
  let prefix = values[0];
  for (const v of values.slice(1)) {
    while (!v.toLowerCase().startsWith(prefix.toLowerCase())) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

export interface Completion {
  value: string;
  suggestions: string[];
}

/** Tab completion for command names and arguments. */
export function complete(line: string, ctx: CommandContext): Completion {
  const endsWithSpace = /\s$/.test(line);
  const tokens = line.trim() === "" ? [] : line.trim().split(/\s+/);

  // Completing the command name
  if (tokens.length === 0 || (tokens.length === 1 && !endsWithSpace)) {
    const partial = tokens[0] ?? "";
    const names = Array.from(
      new Set([...ctx.commands.flatMap((c) => [c.name, ...(c.aliases ?? [])]), ...Object.keys(terminalConfig.aliases).filter((a) => /^[a-z]/i.test(a))]),
    )
      .filter((n) => n.toLowerCase().startsWith(partial.toLowerCase()))
      .sort();
    if (names.length === 0) return { value: line, suggestions: [] };
    if (names.length === 1) return { value: `${names[0]} `, suggestions: [] };
    return { value: commonPrefix(names) || partial, suggestions: names };
  }

  // Completing an argument
  const command = lookup(ctx.commands, tokens[0]) ?? lookup(ctx.commands, expandAlias(tokens[0]).split(" ")[0]);
  if (!command?.args?.length) return { value: line, suggestions: [] };
  const argIndex = Math.max(0, (endsWithSpace ? tokens.length : tokens.length - 1) - 1);
  const spec = command.args[Math.min(argIndex, command.args.length - 1)];
  const partial = endsWithSpace ? "" : tokens[tokens.length - 1];
  const candidates = (spec.complete?.(ctx, partial) ?? []).filter((c) => c.toLowerCase().startsWith(partial.toLowerCase()));
  if (candidates.length === 0) return { value: line, suggestions: [] };

  const head = endsWithSpace ? line : line.slice(0, line.length - partial.length);
  if (candidates.length === 1) {
    const only = candidates[0];
    return { value: `${head}${only}${only.endsWith("/") ? "" : " "}`, suggestions: [] };
  }
  return { value: `${head}${commonPrefix(candidates) || partial}`, suggestions: candidates };
}
