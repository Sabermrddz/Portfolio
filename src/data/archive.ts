export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lang: "python" | "javascript";
  web: boolean;
  featured?: boolean;
  tags: string[];
  url: string;
  year: string;
  img: string;
}

export const projects: Project[] = [
  {
    id: "01",
    title: "Maitrisez",
    subtitle: "Quiz & Exam Platform — MERN flagship",
    description:
      "Part of the dev team & deployer — responsible for hosting, database management, error fixing and scalability. A full MERN examination platform with timed exams, question banks, auto-grading and result analytics — built to stay correct when it matters.",
    lang: "javascript",
    web: true,
    featured: true,
    tags: ["React", "Node", "Express", "MongoDB", "MERN"],
    url: "https://maitrisez.app/",
    year: "2025",
    img: "/images/work-5.jpg",
  },
  {
    id: "02",
    title: "APEX",
    subtitle: "Currency Strength Engine — QuantCore-FX",
    description:
      "A quant engine that measures relative currency strength across FX pairs in real time and feeds a StatArb workflow. Numbers in, signals out — no opinions.",
    lang: "python",
    web: false,
    featured: true,
    tags: ["Python", "Quant", "StatArb", "FX", "Pandas"],
    url: "https://github.com/Sabermrddz/QuantCore-FX",
    year: "2025",
    img: "/images/work-3.jpg",
  },
  {
    id: "03",
    title: "Real Estate Agency Portal",
    subtitle: "Listings, agents & leads — Django",
    description:
      "A Django portal for an agency: listings with media, agent accounts, inquiry routing and an admin that a non-technical office can actually run.",
    lang: "python",
    web: true,
    tags: ["Django", "PostgreSQL", "Portal", "Admin"],
    url: "https://github.com/Sabermrddz/Real-estate-agency",
    year: "2024",
    img: "/images/work-2.jpg",
  },
  {
    id: "04",
    title: "ProgressOBServer",
    subtitle: "Telegram watcher — always on",
    description:
      "A Telegram watcher that tracks channels and progress markers, then reports back on schedule. Runs quiet, runs long, misses nothing.",
    lang: "python",
    web: false,
    tags: ["Python", "Telegram", "Automation", "Watcher"],
    url: "https://github.com/Sabermrddz/ProgressOBServer",
    year: "2024",
    img: "/images/work-6.jpg",
  },
  {
    id: "05",
    title: "Telegram → Slack Migrator",
    subtitle: "History migration pipeline",
    description:
      "Moves entire Telegram workspaces into Slack — messages, threads, media and metadata — with rate limits respected and idempotent re-runs.",
    lang: "python",
    web: false,
    tags: ["Python", "Telegram API", "Slack API", "ETL"],
    url: "https://github.com/Sabermrddz/telegram-slack-migrator",
    year: "2024",
    img: "/images/work-1.jpg",
  },
  {
    id: "06",
    title: "NFA ε-Transition Removal",
    subtitle: "Automata / CS theory",
    description:
      "A clean implementation of ε-closure computation and NFA-to-DFA-equivalent conversion. Theory, filed as working code.",
    lang: "python",
    web: false,
    tags: ["Automata", "NFA", "Algorithms", "CS Theory"],
    url: "https://github.com/Sabermrddz/NFA-Epsilon-Transition-Removal-Program",
    year: "2024",
    img: "/images/hero.jpg",
  },
  {
    id: "07",
    title: "Distributed DB — Cultural Trip",
    subtitle: "Fragmented & replicated data layer",
    description:
      "A distributed database project built around a cultural-trip dataset: fragmentation, allocation and replication across nodes with consistent query routing.",
    lang: "javascript",
    web: true,
    tags: ["Node.js", "Distribution", "Replication", "Sharding"],
    url: "https://disui.vercel.app/",
    year: "2025",
    img: "/images/work-7.jpg",
  },
  {
    id: "08",
    title: "Medical AI Chat-Bot Site",
    subtitle: "Conversational triage front-end",
    description:
      "A medical chat-bot site with a conversational interface, symptom intake flow and structured responses — AI assistance with a clinical, calm UI.",
    lang: "javascript",
    web: true,
    tags: ["JavaScript", "AI", "Chat-bot", "Web"],
    url: "https://ia-chat-bot.icyhill-613c94fd.francecentral.azurecontainerapps.io/",
    year: "2025",
    img: "/images/work-8.jpg",
  },
];

export const focusAreas = [
  {
    id: "01",
    title: "Automation & bots",
    description: "Telegram watchers and migrators. Rate-limit aware, idempotent and logged.",
    tags: ["ProgressOBServer", "24/7 watcher", "Telegram → Slack", "Threads intact"],
  },
  {
    id: "02",
    title: "Quant tooling",
    description: "Currency-strength and StatArb pipelines — clean Python math a trader can act on.",
    tags: ["APEX", "Real-time FX engine", "Auditable backtests", "Live signals"],
  },
  {
    id: "03",
    title: "Systems & theory",
    description: "Automata, fragmentation and replication — theory as runnable code.",
    tags: ["NFA ε-closure", "Automata", "Distributed DB routing"],
    invert: true,
  },
];

export type SkillLevel = "CORE" | "FLUENT" | "WORKING" | "EXPLORING";

export interface SkillGroup {
  key: string;
  title: string;
  note: string;
  skills: { name: string; level: SkillLevel }[];
}

export const skillGroups: SkillGroup[] = [
  {
    key: "languages",
    title: "Languages",
    note: "spoken fluently",
    skills: [
      { name: "Python", level: "CORE" },
      { name: "JavaScript", level: "CORE" },
      { name: "TypeScript", level: "FLUENT" },
      { name: "SQL", level: "WORKING" },
      { name: "Bash", level: "WORKING" },
    ],
  },
  {
    key: "backend",
    title: "Backend",
    note: "where things run",
    skills: [
      { name: "Node.js / Express", level: "CORE" },
      { name: "Django", level: "FLUENT" },
      { name: "MongoDB", level: "FLUENT" },
      { name: "PostgreSQL", level: "WORKING" },
      { name: "Docker", level: "WORKING" },
    ],
  },
  {
    key: "domains",
    title: "Domains",
    note: "where things land",
    skills: [
      { name: "MERN platforms", level: "CORE" },
      { name: "Telegram bots", level: "CORE" },
      { name: "Django portals", level: "FLUENT" },
      { name: "Automation", level: "CORE" },
      { name: "Quant tools", level: "WORKING" },
      { name: "Automata / CS", level: "WORKING" },
      { name: "Distributed DB", level: "EXPLORING" },
    ],
  },
];

export const achievements = [
  {
    value: "08",
    label: "Projects archived",
    pct: 100,
    text: "Eight systems filed — platforms, engines, bots, and theory. Every entry shipped.",
  },
  {
    value: "+4.5",
    label: "Years building",
    pct: 82,
    text: "Continuous output since 2021 — from first Django portal to distributed databases.",
  },
  {
    value: "100%",
    label: "Fluid motion",
    pct: 100,
    text: "Every surface responsive, every canvas respecting reduced-motion. No exceptions filed.",
  },
  {
    value: "NODE",
    label: "Node powered",
    pct: 90,
    text: "Express servers, REST APIs, real-time flows — the runtime behind the MERN flagship.",
  },
];

export const traits = ["CALM", "PRECISE", "PERSISTENT", "AUTODIDACT", "LOW-NOISE", "SHIP-ORIENTED"];

export const stackTicker = [
  "Node.js",
  "Python",
  "React",
  "Django",
  "Express",
  "TypeScript",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "Quant",
  "Telegram Bots",
  "Automation",
  "Automata",
  "MERN",
];

export const heroStats = [
  { value: "08+", label: "Public repos" },
  { value: "08", label: "Projects filed" },
  { value: "+4.5", label: "Years experience" },
];

export const socials = [
  { key: "GH", name: "GitHub", handle: "@Sabermrddz", url: "https://github.com/Sabermrddz" },
  { key: "X", name: "X / Twitter", handle: "@sabermourad7", url: "https://x.com/sabermourad7" },
  { key: "IG", name: "Instagram", handle: "@saber_mrd_", url: "https://www.instagram.com/saber_mrd_/" },
  { key: "IT", name: "Itch.io", handle: "sabermrddz.itch.io", url: "https://sabermrddz.itch.io/" },
  { key: "TG", name: "Telegram", handle: "@sabermrddz", url: "https://t.me/sabermrddz" },
  { key: "DC", name: "Discord", handle: "924701364385382410", url: "https://discord.com/users/924701364385382410" },
];
