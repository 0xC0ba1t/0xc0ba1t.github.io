import type { OutputNode } from "./types";

/** Plain-text rendering of output, used for the screen-reader live region. */
export function nodesToPlainText(nodes: OutputNode[]): string {
  return nodes
    .map((n) => {
      switch (n.type) {
        case "text":
          return n.text;
        case "heading":
          return n.text;
        case "kv":
          return n.rows.map((r) => `${r.key}: ${r.value}`).join(". ");
        case "list":
          return n.items.map((i) => (i.detail ? `${i.label}, ${i.detail}` : i.label)).join(". ");
        case "code":
          return n.code;
        case "neofetch":
          return n.rows.map((r) => `${r.key}: ${r.value}`).join(". ");
        case "spacer":
          return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}
