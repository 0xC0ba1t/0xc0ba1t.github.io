import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Prefix a root-relative asset path with the optional base path (empty on the custom domain). */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isExternal(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");
}

/** Normalise a path so "/about" and "/about/" compare equal. */
export function normalisePath(path: string): string {
  if (!path) return "/";
  const stripped = path.replace(/\/+$/, "");
  return stripped === "" ? "/" : stripped;
}

export function isActivePath(pathname: string, href: string): boolean {
  const p = normalisePath(pathname);
  const h = normalisePath(href);
  if (h === "/") return p === "/";
  return p === h || p.startsWith(`${h}/`);
}

export function titleCase(value: string): string {
  return value.replace(/(^|[-_\s])(\w)/g, (_m, sep: string, ch: string) => `${sep === "" ? "" : " "}${ch.toUpperCase()}`);
}
