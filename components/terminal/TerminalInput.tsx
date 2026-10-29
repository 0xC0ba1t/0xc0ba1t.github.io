"use client";

import { useState, type KeyboardEvent, type RefObject } from "react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  /** When set (auto-typed intro), shown instead of the real value. */
  typed?: string;
  maxLength: number;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  /** Called when the visitor focuses or types, so the intro can yield. */
  onIntent: () => void;
}

/**
 * A real <input> (so mobile keyboards, IME and screen readers work) made
 * invisible, with a rendered line and block cursor on top.
 */
export function TerminalInput({ value, typed, maxLength, inputRef, onChange, onKeyDown, onIntent }: Props) {
  const [caret, setCaret] = useState(0);
  const [focused, setFocused] = useState(false);

  const shown = typed ?? value;
  const pos = typed !== undefined ? shown.length : Math.min(caret, shown.length);
  const before = shown.slice(0, pos);
  const at = shown.charAt(pos) || " ";
  const after = shown.slice(pos + 1);

  const sync = (el: HTMLInputElement) => setCaret(el.selectionStart ?? el.value.length);

  return (
    <span className="relative min-w-0 flex-1 rounded-sm has-[:focus-visible]:bg-ivory/[0.04]">
      <input
        ref={inputRef}
        value={value}
        maxLength={maxLength}
        aria-label="Terminal input. Type a command, or type help."
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="go"
        className="absolute inset-0 h-full w-full cursor-text bg-transparent text-[16px] text-transparent opacity-0 outline-none"
        onFocus={(e) => {
          setFocused(true);
          sync(e.currentTarget);
          onIntent();
        }}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          onIntent();
          onChange(e.target.value);
          sync(e.target);
        }}
        onKeyDown={(e) => {
          onKeyDown(e);
        }}
        onKeyUp={(e) => sync(e.currentTarget)}
        onSelect={(e) => sync(e.currentTarget)}
        onClick={(e) => sync(e.currentTarget)}
      />
      <span aria-hidden className="whitespace-pre-wrap break-all">
        {before}
        <span className={cn("term-cursor", focused ? "term-cursor-blink" : "term-cursor-idle")}>{at}</span>
        {after}
      </span>
    </span>
  );
}
