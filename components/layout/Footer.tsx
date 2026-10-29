import Link from "next/link";
import { FooterWordmark } from "./FooterWordmark";
import { getFooterGroups } from "@/config/footer";
import { site } from "@/config/site";
import { isExternal } from "@/lib/utils";

/** Vertically organised footer. Groups come from config/footer.ts. */
export function Footer() {
  const groups = getFooterGroups();
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 pb-6 pt-14 sm:px-8">
        <FooterWordmark />
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {groups.map((g) => (
            <nav key={g.id} aria-labelledby={`footer-${g.id}`}>
              <h2 id={`footer-${g.id}`} className="mono-label mb-3 uppercase tracking-[0.14em]">
                {g.title}
              </h2>
              <ul className="flex flex-col gap-2">
                {g.links.map((l) => {
                  const ext = l.external ?? isExternal(l.href);
                  const cls = "break-words text-sm text-ivory/85 underline-offset-4 transition-colors hover:text-ivory hover:underline";
                  return (
                    <li key={l.href + l.label}>
                      {ext ? (
                        <a href={l.href} className={cls} {...(l.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
                          {l.label}
                        </a>
                      ) : (
                        <Link href={l.href} className={cls}>
                          {l.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-1 border-t border-line pt-5 font-mono text-[0.72rem] text-stone sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          {site.status ? <p>{site.status}</p> : null}
        </div>
      </div>
    </footer>
  );
}
