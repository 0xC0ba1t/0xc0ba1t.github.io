import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { PageHeader } from "@/components/layout/PageHeader";
import { about } from "@/data/home";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About",
  description: "Background, interests and direction of Aditya Patil: ML, systems programming, hardware and networking.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="about" title={about.title} lead={about.lead} />
      <div className="mx-auto max-w-6xl space-y-2 px-5 pb-12 sm:px-8">
        {about.sections.map((s) => (
          <ScrollReveal key={s.title}>
            <section className="grid gap-4 border-t border-line py-10 lg:grid-cols-[1fr_2fr] lg:gap-12">
              <h2 className="display text-3xl text-ivory sm:text-4xl">{s.title}</h2>
              <div className="prose-measure space-y-4 text-ivory/85">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          </ScrollReveal>
        ))}
        <ScrollReveal>
          <p className="border-t border-line pt-8 font-mono text-sm text-stone">
            See the{" "}
            <Link href="/projects/" className="text-ivory underline decoration-line-strong underline-offset-4 hover:decoration-accent-soft">
              projects
            </Link>
            ,{" "}
            <Link href="/skills/" className="text-ivory underline decoration-line-strong underline-offset-4 hover:decoration-accent-soft">
              skills
            </Link>{" "}
            or{" "}
            <Link href="/experience/" className="text-ivory underline decoration-line-strong underline-offset-4 hover:decoration-accent-soft">
              experience
            </Link>
            .
          </p>
        </ScrollReveal>
      </div>
    </>
  );
}
