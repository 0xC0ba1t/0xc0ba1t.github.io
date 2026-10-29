import Link from "next/link";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ title: "Not found", path: "/404/" });

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-16 pt-24 sm:px-8 sm:pt-32">
      <p className="mono-label mb-4">
        <span className="text-accent-soft">$ </span>cd ./this-page
      </p>
      <h1 className="display text-6xl text-ivory sm:text-8xl">404</h1>
      <p className="mt-4 font-mono text-sm text-accent-soft">cd: no such file or directory</p>
      <p className="prose-measure mt-6 text-ivory/80">That path doesn't exist on this site. It may have moved, or the link may be mistyped.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="rounded-lg bg-accent px-5 py-2.5 font-mono text-sm text-ivory hover:bg-accent/80">
          Back home
        </Link>
        <Link href="/projects/" className="rounded-lg border border-line-strong px-5 py-2.5 font-mono text-sm text-ivory hover:border-accent hover:bg-accent/25">
          Browse projects
        </Link>
      </div>
    </div>
  );
}
