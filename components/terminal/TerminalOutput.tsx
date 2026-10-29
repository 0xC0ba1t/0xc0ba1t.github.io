"use client";

import Link from "next/link";
import { highlight } from "@/lib/terminal/highlight";
import type { OutputNode, Tone } from "@/lib/terminal/types";
import { cn } from "@/lib/utils";

const toneClass: Record<Tone, string> = {
  default: "text-ivory/90",
  muted: "text-stone",
  accent: "text-accent-soft",
  error: "text-accent-soft font-medium",
  success: "text-ivory",
};

interface Props {
  nodes: OutputNode[];
  onRun: (command: string) => void;
}

const linkCls =
  "text-left underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-soft hover:decoration-accent-soft focus-visible:text-accent-soft";

export function TerminalOutput({ nodes, onRun }: Props) {
  return (
    <div className="space-y-1">
      {nodes.map((node, i) => (
        <div key={i} className="term-node" style={{ ["--i" as string]: i }}>
          <Node node={node} onRun={onRun} />
        </div>
      ))}
    </div>
  );
}

function Node({ node, onRun }: { node: OutputNode; onRun: (c: string) => void }) {
  switch (node.type) {
    case "text":
      return (
        <p className={cn("whitespace-pre-wrap break-words", toneClass[node.tone ?? "default"])}>
          {node.tone === "error" ? "! " : ""}
          {node.text}
        </p>
      );
    case "heading":
      return <p className="tok-heading mt-1 break-words">{node.text}</p>;
    case "spacer":
      return <div className="h-2" aria-hidden />;
    case "kv":
      return (
        <dl className="grid grid-cols-[minmax(4.5rem,max-content)_1fr] gap-x-4">
          {node.rows.map((r, i) => (
            <div key={i} className="contents">
              <dt className="tok-key">{r.key}</dt>
              <dd className="min-w-0 break-words">
                {r.href ? (
                  <a
                    href={r.href}
                    className={linkCls}
                    {...(/^https?:/.test(r.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {r.value}
                  </a>
                ) : (
                  r.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      );
    case "list":
      return (
        <ul className="space-y-0.5">
          {node.items.map((item, i) => (
            <li key={i} className="grid grid-cols-[minmax(7rem,max-content)_1fr] gap-x-4 max-sm:grid-cols-1">
              <span className="min-w-0 break-words">
                {item.command ? (
                  <button type="button" className={cn(linkCls, "font-[inherit]")} onClick={() => onRun(item.command!)}>
                    {item.label}
                  </button>
                ) : item.href ? (
                  item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className={linkCls}>
                      {item.label}
                    </Link>
                  )
                ) : (
                  item.label
                )}
              </span>
              {item.detail ? <span className="min-w-0 break-words text-stone">{item.detail}</span> : null}
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-[inherit]">
          {highlight(node.code, node.lang).map((line, li) => (
            <span key={li} className="block min-h-[1.6em]">
              {line.map((seg, si) => (
                <span key={si} className={seg.cls}>
                  {seg.text}
                </span>
              ))}
            </span>
          ))}
        </pre>
      );
    case "neofetch":
      return (
        <div className="flex flex-wrap items-start gap-x-6 gap-y-3 py-1">
          <pre aria-hidden className="text-accent-soft leading-[1.15]">
            {node.art.join("\n")}
          </pre>
          <dl className="grid min-w-0 flex-1 grid-cols-[max-content_1fr] gap-x-3">
            {node.rows.map((r, i) => (
              <div key={i} className="contents">
                <dt className="tok-key">{r.key}</dt>
                <dd className="min-w-0 break-words">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
  }
}
