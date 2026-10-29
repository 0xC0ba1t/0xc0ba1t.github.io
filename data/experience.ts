import type { Award, Certification, ExperienceEntry } from "@/lib/types";

/**
 * Taken from the CV. Periods are shown as written there.
 * NOTE: the CV groups several entries under one date heading; where that
 * happens the shared date is applied to each entry. Check these against the
 * original and correct any that differ.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "interplast",
    role: "IT Intern",
    org: "Interplast Limited",
    period: "Jun – Jul 2026",
    kind: "work",
    description:
      "Managed core IT infrastructure and security (Active Directory, firewalls, remote access) and user support, with rotations in Procurement, Marketing & Sales.",
  },
  {
    id: "paywell",
    role: "Intern",
    org: "Paywell Solutions",
    period: "18 & 19 Jun 2025",
    kind: "work",
    description:
      "Two-day fintech placement covering HR, hardware servicing and software development, with hands-on exposure to smart PoS devices and PCI/ISO compliance standards.",
  },
  {
    id: "robotics-senior",
    role: "Robotics Member (Senior)",
    org: "The Roman Ridge School",
    period: "Sep 2026 – present",
    kind: "activity",
  },
  {
    id: "design-trainee",
    role: "Design Trainee (Blueprint)",
    org: "The Roman Ridge School",
    period: "Sep 2026 – present",
    kind: "activity",
  },
  {
    id: "peer-mentor",
    role: "Peer Mentorship Volunteer (Middle School)",
    org: "The Roman Ridge School",
    period: "Oct 2026 – present",
    kind: "volunteering",
  },
  {
    id: "ignite-her-future",
    role: "IT Volunteer",
    org: "Ignite Her Future",
    period: "Oct 2026 – present",
    kind: "volunteering",
  },
  {
    id: "bloom-rise",
    role: "Co-Founder and Head of IT & Technology",
    org: "Bloom & Rise Foundation",
    period: "Oct 2026 – present",
    kind: "leadership",
  },
  {
    id: "zooniverse",
    role: "Research Volunteer",
    org: "Zooniverse (remote)",
    period: "Aug 2026 – present",
    kind: "volunteering",
    description: "Contributing to citizen-science research projects.",
  },
  {
    id: "mun",
    role: "Delegate of Saudi Arabia, UN Women",
    org: "DPSI MUN 2026, Delhi Private School International",
    period: "Sep 2026",
    kind: "activity",
  },
  {
    id: "robotics-lead",
    role: "Robotics Lead & Member",
    org: "The Roman Ridge School",
    period: "2023 – 2025",
    kind: "leadership",
    description:
      "Led a cross-functional team from junior school to sixth form on robotics and electronics projects, delegating tasks across C/C++, Python and Scratch. Worked with Marty and mBot robots, Arduino and Raspberry Pi.",
  },
];

export const awards: Award[] = [
  { id: "cs-second", title: "Book Prize: Second in Computer Science (IGCSE Mock Examinations)", issuer: "The Roman Ridge School", year: "2026" },
  { id: "addmaths", title: "Book Prize: Most Improved in Additional Mathematics (2025/2026)", issuer: "The Roman Ridge School", year: "2026" },
  { id: "qcec", title: "The Queen's Commonwealth Essay Competition: Silver Award", issuer: "Royal Commonwealth Society", year: "2026" },
  { id: "kukkiwon", title: "KUKKIWON 1st Poom (Taekwondo)", issuer: "KUKKIWON", year: "2025" },
  { id: "distinction-25", title: "Special Certificate of Academic Distinction", issuer: "The Roman Ridge School", year: "2025" },
  { id: "distinction-24", title: "Special Certificate of Academic Distinction", issuer: "The Roman Ridge School", year: "2024" },
  { id: "cs-first", title: "Book Prize: First in Computer Science (2023/2024)", issuer: "The Roman Ridge School", year: "2024" },
];

export const certifications: Certification[] = [
  { id: "fcc-python", title: "Python Developer Certification", issuer: "freeCodeCamp", year: "2026", note: "100.0% in the final exam" },
  { id: "mcp-intro", title: "Claude Academy: Introduction to Model Context Protocol", issuer: "Anthropic", year: "2026" },
  { id: "mcp-adv", title: "Claude Academy: Model Context Protocol: Advanced topics", issuer: "Anthropic", year: "2026" },
  { id: "k-game-ai", title: "Intro to Game AI and Reinforcement Learning", issuer: "Kaggle", year: "2026" },
  { id: "k-cv", title: "Computer Vision", issuer: "Kaggle", year: "2026" },
  { id: "k-ethics", title: "Intro to AI Ethics", issuer: "Kaggle", year: "2026" },
  { id: "k-dl", title: "Intro to Deep Learning", issuer: "Kaggle", year: "2026" },
  { id: "k-iml", title: "Intermediate Machine Learning", issuer: "Kaggle", year: "2026" },
  { id: "k-ml", title: "Intro to Machine Learning", issuer: "Kaggle", year: "2026" },
  { id: "ibm-ai", title: "AI Fundamentals: Language and Vision in AI", issuer: "IBM", year: "2026" },
];
