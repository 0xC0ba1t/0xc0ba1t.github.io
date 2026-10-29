/** Homepage and About copy. */

export const home = {
  /** Short eyebrow; decoded once with the EncryptedText effect. */
  eyebrow: "machine learning · systems · hardware",

  headline: "ML engineer in training, curious about what runs underneath.",

  intro:
    "I'm Aditya, a Cambridge A-Level student working mostly in PyTorch and Rust. I build things to understand them: a stable diffusion pipeline, a small language model, an operating system.",

  /** Small label above the flip board. */
  boardLabel: "areas of interest",

  /** Text Flipping Board messages (max 2 rows × 12 characters per row). */
  boardMessages: [
    "MACHINE LEARNING",
    "ARTIFICIAL INTELLIGENCE",
    "SYSTEMS PROGRAMMING",
    "LOW-LEVEL SOFTWARE",
    "COMPUTER ARCHITECTURE",
  ],

  /** Inline rotating phrase: `${lead} ${word}${tail}` */
  flipWords: {
    lead: "Right now I'm most curious about",
    words: ["machine learning.", "AI systems.", "systems programming.", "computer architecture."],
    tail: "",
  },

  /** Small system panel in the hero — real facts only. */
  systemPanel: [
    { key: "role", value: "aspiring ML engineer" },
    { key: "education", value: "Cambridge A-Levels, writing in 2028" },
    { key: "main", value: "PyTorch, Python, Rust" },
    { key: "current", value: "zero" },
  ],

  scrollCue: "Scroll to open the terminal",

  /** The MacBook section: the interactive terminal lives on its screen. */
  terminalShowcase: {
    kicker: "$ ./explore --interactive",
    title: "Poke around in the terminal.",
  },

  skillsOverview: {
    title: "What I work with",
    intro: "A short overview. The full list lives on the skills page.",
    highlightGroups: ["ai-ml", "languages", "systems", "infra"],
  },

  activities: {
    title: "Beyond the keyboard",
    intro: "Teams, mentoring and volunteering alongside the technical work.",
    highlightIds: ["robotics-lead", "peer-mentor", "interplast"],
  },

  contactCta: {
    title: "Say hello",
    body: "",
    button: "Contact me",
  },
} as const;

export const about = {
  title: "About",
  lead: "I'm drawn to the layers of computing that most people never look at: how a model learns, how a kernel boots, how a packet finds its way.",
  sections: [
    {
      title: "Where I'm coming from",
      body: [
        "I'm studying Mathematics, Physics, Computer Science and Chemistry at Cambridge A-Level, and spend most of my free time programming. I am passionate about machine learning, low-level hardware and software, networking and general programming, and that about sums it up.",
        "I work mostly in PyTorch and Rust, with Python, C, C++ and a few others on the side.",
      ],
    },
    {
      title: "How I learn",
      body: [
        "I learn by reimplementing. SnapdragonLLM is a small language model built by following Andrej Karpathy's teaching material, and zero is a small operating system written in Rust. They are how I find out what I don't understand yet.",
      ],
    },
    {
      title: "Direction",
      body: [
        "The goal is to become a machine learning engineer who understands the stack beneath the framework: memory, instruction sets, operating systems and networks. I'm also interested in cybersecurity and in self-hosting and infrastructure, which I practise on my own hardware and through IT work.",
        "Outside code: robotics (I led the school robotics team), peer mentoring, badminton and Formula 1.",
      ],
    },
  ],
} as const;
