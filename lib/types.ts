export type ProjectStatus = "live" | "active" | "in-progress" | "paused" | "archived";

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  /** URL-safe id; used for /projects/<slug>/ and `project <slug>` in the terminal */
  slug: string;
  name: string;
  /** one-line description for cards and lists */
  summary: string;
  /** paragraphs for the detail view */
  overview: string[];
  technologies: string[];
  tags: string[];
  repoUrl?: string;
  demoUrl?: string;
  images?: ProjectImage[];
  status?: ProjectStatus;
  featured?: boolean;
  license?: string;
  /** optional technical notes — only facts you can stand behind */
  details?: { title: string; body: string }[];
}

export interface SkillGroup {
  id: string;
  title: string;
  blurb?: string;
  items: string[];
}

export interface ExperienceEntry {
  id: string;
  role: string;
  org: string;
  /** free text, shown as given (e.g. "Jun – Jul 2026") */
  period: string;
  kind: "work" | "leadership" | "volunteering" | "activity";
  description?: string;
  points?: string[];
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  note?: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  period: string;
  programme?: string;
  points: string[];
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  /** shown after the label in lists, e.g. a handle */
  handle?: string;
  kind: "code" | "profile" | "email" | "key" | "site";
}
