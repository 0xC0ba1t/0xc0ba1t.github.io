import type { Command } from "@/lib/terminal/types";
import { cat, cd, ls, pwd } from "./commands/fs";
import { aboutCmd, contact, educationCmd, experienceCmd, resume, skills, socialsCmd, whoami } from "./commands/info";
import { openCmd, projectCmd, projectsCmd } from "./commands/projects";
import { clear, date, echo, help, historyCmd, neofetch, theme } from "./commands/system";

/**
 * Command registry. To add a command: create a `Command` object (see
 * ./commands/*.ts) and append it here. The Terminal component never changes.
 */
export const commands: Command[] = [
  help,
  whoami,
  aboutCmd,
  projectsCmd,
  projectCmd,
  skills,
  experienceCmd,
  educationCmd,
  contact,
  socialsCmd,
  resume,
  neofetch,
  clear,
  date,
  pwd,
  ls,
  cd,
  cat,
  openCmd,
  theme,
  historyCmd,
  echo,
];

export function findCommand(name: string): Command | undefined {
  const n = name.toLowerCase();
  return commands.find((c) => c.name === n || c.aliases?.includes(n));
}
