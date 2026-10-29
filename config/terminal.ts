/** Terminal configuration: identity, prompt, boot sequence, aliases. */

export const terminalConfig = {
  username: "c0ba1t",
  hostname: "portfolio",
  /** display name of the home directory */
  homeLabel: "~",
  promptSymbol: "$",

  windowTitle: "c0ba1t@portfolio — zsh (simulated)",

  /** Lines printed during boot. Tokens: {projectCount} {theme} */
  bootLines: [
    "portfolio shell — a simulated environment; nothing you type is executed",
    "[ ok ] reading profile",
    "[ ok ] indexing projects ({projectCount} entries)",
    "[ ok ] applying theme ({theme})",
  ],
  bootLineDelayMs: 170,

  /** Commands typed automatically after boot. The visitor can interrupt by typing. */
  introCommands: ["whoami"],
  introTypeSpeedMs: 55,

  /** Shown as tap targets under the terminal (also helpful on mobile). */
  quickCommands: ["help", "whoami", "projects", "skills", "contact"],

  /** Alias → expansion. Resolved before command lookup. */
  aliases: {
    "?": "help",
    cls: "clear",
    ll: "ls -l",
    la: "ls -l",
    projs: "projects",
    bio: "about",
    mail: "contact",
  } as Record<string, string>,

  maxHistory: 100,
  maxInputLength: 200,
  /** Entries kept in the scrollback before old ones are dropped. */
  maxEntries: 200,
} as const;
