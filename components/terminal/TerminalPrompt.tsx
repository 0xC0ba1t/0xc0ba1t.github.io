import { terminalConfig } from "@/config/terminal";

export function TerminalPrompt({ cwd }: { cwd: string }) {
  return (
    <span className="select-none whitespace-nowrap">
      <span className="text-ivory">{terminalConfig.username}</span>
      <span className="text-stone">@{terminalConfig.hostname}</span>{" "}
      <span className="text-accent-soft">{cwd}</span>{" "}
      <span className="text-stone">{terminalConfig.promptSymbol}</span>
    </span>
  );
}
