import { about, home } from "@/data/home";
import { education, languages } from "@/data/education";
import { awards, certifications, experience } from "@/data/experience";
import { skillGroups } from "@/data/skills";
import { socials } from "@/data/socials";
import { site } from "@/config/site";
import type { Command } from "@/lib/terminal/types";
import { fail, heading, ok, spacer, text } from "./helpers";

export const whoami: Command = {
  name: "whoami",
  summary: "Who I am, in a few lines",
  run: () =>
    ok(
      text(`${site.handle} — ${site.name}`),
      {
        type: "kv",
        rows: [
          { key: "role", value: site.role.toLowerCase() },
          { key: "focus", value: "machine learning, systems programming, hardware, networking" },
          { key: "main tools", value: "PyTorch, Rust" },
          { key: "studying", value: "Cambridge A-Levels: Mathematics, Physics, Computer Science, Chemistry" },
        ],
      },
      text('Type "about" for the longer version, or "projects" to see what I have built.', "muted"),
    ),
};

export const aboutCmd: Command = {
  name: "about",
  summary: "A longer introduction",
  run: () =>
    ok(
      text(about.lead),
      ...about.sections.flatMap((s) => [spacer(), heading(s.title), ...s.body.map((b) => text(b))]),
    ),
};

export const skills: Command = {
  name: "skills",
  summary: "Technical skills by category",
  usage: "skills",
  run: () =>
    ok(
      ...skillGroups.flatMap((g, i) => [
        ...(i > 0 ? [spacer()] : []),
        heading(g.title),
        text(g.items.join(", "), "muted"),
      ]),
    ),
};

export const experienceCmd: Command = {
  name: "experience",
  summary: "Work, leadership and volunteering",
  run: () =>
    ok({
      type: "list",
      items: experience.map((e) => ({ label: e.role, detail: `${e.org} · ${e.period}` })),
    },
    spacer(),
    text(`${awards.length} awards and ${certifications.length} certifications: try "cat achievements.md" or "cat certifications.md".`, "muted")),
};

export const educationCmd: Command = {
  name: "education",
  summary: "Schools and qualifications",
  run: () =>
    ok(
      ...education.flatMap((e) => [
        heading(`${e.institution} (${e.period})`),
        ...(e.programme ? [text(e.programme, "muted")] : []),
        ...e.points.map((p) => text(`• ${p}`)),
        spacer(),
      ]),
      heading("Languages"),
      text(languages.join(", "), "muted"),
    ),
};

export const contact: Command = {
  name: "contact",
  summary: "How to reach me",
  run: () =>
    ok(
      { type: "kv", rows: socials.filter((s) => s.kind === "email" || s.kind === "key").map((s) => ({ key: s.label.toLowerCase(), value: s.handle ?? s.href, href: s.href })) },
      text(home.contactCta.body, "muted"),
    ),
};

export const socialsCmd: Command = {
  name: "socials",
  summary: "Profiles and links",
  run: () =>
    ok({
      type: "list",
      items: socials
        .filter((s) => s.kind !== "email")
        .map((s) => ({ label: s.label, detail: s.handle, href: s.href, external: true })),
    }),
};

export const resume: Command = {
  name: "resume",
  aliases: ["cv"],
  summary: "Open my résumé",
  run: () => {
    if (!site.resumeUrl) {
      return fail("A PDF résumé isn't published on this site yet.", `Email ${site.email} and I'll send one. References are available on request.`);
    }
    return { output: [text("Opening résumé in a new tab…", "success")], effects: [{ type: "open", url: site.resumeUrl }] };
  },
};
