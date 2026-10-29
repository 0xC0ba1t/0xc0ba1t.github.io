export interface Segment {
  text: string;
  cls?: string;
}

/** Very small syntax highlighter for the document types the shell prints. */

const INLINE = /(`[^`]+`)|(https?:\/\/[^\s)]+)|(\*\*[^*]+\*\*)/g;

function inline(text: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ text: text.slice(last, idx) });
    const cls = m[1] ? "tok-code" : m[2] ? "tok-url" : "tok-strong";
    out.push({ text: m[0], cls });
    last = idx + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

function mdLine(line: string): Segment[] {
  if (/^#{1,6}\s/.test(line)) return [{ text: line, cls: "tok-heading" }];
  const bullet = line.match(/^(\s*[-*]\s)(.*)$/);
  if (bullet) return [{ text: bullet[1], cls: "tok-marker" }, ...inline(bullet[2])];
  const kv = line.match(/^([a-z][\w ]{1,14}:)(\s.*)$/);
  if (kv) return [{ text: kv[1], cls: "tok-key" }, ...inline(kv[2])];
  return inline(line);
}

function shLine(line: string): Segment[] {
  if (line.trim().startsWith("#")) return [{ text: line, cls: "tok-muted" }];
  const m = line.match(/^(\S+)(.*)$/);
  if (!m) return [{ text: line }];
  return [{ text: m[1], cls: "tok-heading" }, ...inline(m[2])];
}

export function highlight(code: string, lang: "md" | "sh" | "text"): Segment[][] {
  return code.split("\n").map((line) => {
    if (lang === "md") return mdLine(line);
    if (lang === "sh") return shLine(line);
    return [{ text: line }];
  });
}
