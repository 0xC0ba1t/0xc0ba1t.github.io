import type { ParsedArgs } from "./types";

/** Split a command line into tokens, honouring single and double quotes. */
export function tokenize(line: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  let has = false;
  for (const ch of line) {
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      has = true;
    } else if (/\s/.test(ch)) {
      if (current || has) tokens.push(current);
      current = "";
      has = false;
    } else {
      current += ch;
    }
  }
  if (current || has) tokens.push(current);
  return tokens;
}

export function parseArgs(tokens: string[], raw: string): ParsedArgs {
  const positional: string[] = [];
  const flags = new Set<string>();
  for (const t of tokens) {
    if (t.startsWith("--") && t.length > 2) flags.add(t.slice(2).toLowerCase());
    else if (t.startsWith("-") && t.length > 1 && !/^-\d/.test(t)) {
      for (const c of t.slice(1)) flags.add(c.toLowerCase());
    } else positional.push(t);
  }
  return { positional, flags, raw };
}

/** Smallest edit distance, for "did you mean" suggestions. */
export function distance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

export function closest(input: string, candidates: string[]): string | undefined {
  let best: string | undefined;
  let bestScore = Infinity;
  for (const c of candidates) {
    const d = distance(input.toLowerCase(), c.toLowerCase());
    if (d < bestScore) {
      bestScore = d;
      best = c;
    }
  }
  return bestScore <= Math.max(2, Math.floor(input.length / 2)) ? best : undefined;
}
