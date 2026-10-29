import type { ThemeId } from "@/config/theme";

export type Tone = "default" | "muted" | "accent" | "error" | "success";

/** Everything a command can print. Rendered by TerminalOutput. */
export type OutputNode =
  | { type: "text"; text: string; tone?: Tone }
  | { type: "heading"; text: string }
  | { type: "kv"; rows: { key: string; value: string; href?: string }[] }
  | {
      type: "list";
      items: { label: string; detail?: string; href?: string; command?: string; external?: boolean }[];
    }
  | { type: "code"; lang: "md" | "sh" | "text"; code: string }
  | { type: "neofetch"; art: string[]; rows: { key: string; value: string }[] }
  | { type: "spacer" };

/** Side effects are returned as data; the Terminal component applies them. */
export type Effect =
  | { type: "clear" }
  | { type: "navigate"; href: string }
  | { type: "open"; url: string }
  | { type: "cwd"; cwd: string }
  | { type: "theme"; id: ThemeId };

export interface CommandResult {
  output: OutputNode[];
  effects?: Effect[];
}

export interface ParsedArgs {
  positional: string[];
  flags: Set<string>;
  raw: string;
}

export interface CommandContext {
  /** current simulated directory, e.g. "~" or "~/projects" */
  cwd: string;
  theme: ThemeId;
  now: Date;
  history: string[];
  /** all registered commands (for help and completion) */
  commands: Command[];
}

export interface ArgSpec {
  name: string;
  required?: boolean;
  description: string;
  /** candidates for tab completion */
  complete?: (ctx: CommandContext, partial: string) => string[];
}

export interface Command {
  name: string;
  aliases?: string[];
  summary: string;
  usage?: string;
  args?: ArgSpec[];
  flags?: { name: string; description: string }[];
  run: (ctx: CommandContext, args: ParsedArgs) => CommandResult;
}
