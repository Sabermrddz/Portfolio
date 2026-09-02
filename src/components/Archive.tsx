import { useLayoutEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap } from "../lib/anim";

const PROJECTS = [
  {
    img: "/logos/medical.jpeg",
    title: "Medical AI Chat-Bot Site",
    subtitle: "Conversational triage front-end",
    desc: "Conversational symptom intake with structured responses — AI assistance with a clinical, calm UI.",
    tags: "JAVASCRIPT · AI · CHAT-BOT · WEB",
    year: "2025",
    lang: "JS",
    web: true,
    featured: false,
    url: "https://ia-chat-bot.icyhill-613c94fd.francecentral.azurecontainerapps.io/",
  },
  {
    img: "/logos/distributed.jpeg",
    title: "Distributed DB — Cultural Trip",
    desc: "Fragmentation, allocation and replication across nodes with consistent query routing — built on a cultural-trip dataset.",
    tags: "NODE.JS · DISTRIBUTION · REPLICATION · SHARDING",
    year: "2025",
    lang: "JS",
    web: true,
    featured: false,
    url: "https://disui-site.icyhill-613c94fd.francecentral.azurecontainerapps.io/index.html",
  },
  {
    img: "/logos/readestateagency.jpeg",
    title: "Real Estate Agency Portal",
    subtitle: "Listings, agents & leads — Django",
    desc: "Listings with media, agent accounts, inquiry routing and an admin a non-technical office can actually run.",
    tags: "DJANGO · POSTGRESQL · PORTAL · ADMIN",
    year: "2024",
    lang: "PY",
    web: true,
    featured: false,
    url: "https://github.com/Sabermrddz/Real-estate-agency",
  },
  {
    img: "/logos/maitrisez.jpeg",
    title: "Maitrisez",
    subtitle: "Quiz & Exam Platform — MERN flagship",
    desc: "Part of the dev team & deployer — hosting, databases, error fixing, scalability. Timed exams, question banks, auto-grading, result analytics.",
    tags: "REACT · NODE · EXPRESS · MONGODB",
    year: "2025",
    lang: "JS",
    web: true,
    featured: true,
    url: "https://maitrisez.app/",
  },
  {
    img: "/logos/apex2.jpeg",
    title: "APEX",
    subtitle: "Currency Strength Engine — QuantCore-FX",
    desc: "Measures relative currency strength across FX pairs in real time and feeds a StatArb workflow. Numbers in, signals out — no opinions.",
    tags: "PYTHON · QUANT · STATARB · FX · PANDAS",
    year: "2025",
    lang: "PY",
    web: false,
    featured: true,
    url: "https://github.com/Sabermrddz/QuantCore-FX",
  },
  {
    img: "/logos/progressobserver3.jpeg",
    title: "ProgressOBServer",
    subtitle: "Telegram watcher — always on",
    desc: "Tracks channels and progress markers, then reports back on schedule. Runs quiet, runs long, misses nothing.",
    tags: "PYTHON · TELEGRAM · AUTOMATION · WATCHER",
    year: "2024",
    lang: "PY",
    web: false,
    featured: false,
    url: "https://github.com/Sabermrddz/ProgressOBServer",
  },
  {
    img: "/logos/telegram-slack2.jpeg",
    title: "Telegram → Slack Migrator",
    subtitle: "History migration pipeline",
    desc: "Moves entire Telegram workspaces into Slack — messages, threads, media and metadata — rate limits respected, idempotent re-runs.",
    tags: "PYTHON · TELEGRAM API · SLACK API · ETL",
    year: "2024",
    lang: "PY",
    web: false,
    featured: false,
    url: "https://github.com/Sabermrddz/telegram-slack-migrator",
  },
  {
    img: "/images/work-7.jpg",
    title: "NFA ε-Transition Removal",
    subtitle: "Automata / CS theory",
    desc: "A clean implementation of ε-closure computation and NFA-to-DFA-equivalent conversion. Theory, filed as working code.",
    tags: "AUTOMATA · NFA · ALGORITHMS · CS THEORY",
    year: "2024",
    lang: "PY",
    web: false,
    featured: false,
    url: "https://github.com/Sabermrddz/NFA-Epsilon-Transition-Removal-Program",
  },
];

/**
 * Archive — replaced with transision Showcase.
 * Pinned horizontal scroll: vertical scroll drives the track,
 * per-panel image parallax, progress bar.
 * Uses gsap + ScrollTrigger (see src/lib/anim.ts) and Lenis.
 * Section keeps id="archive" so existing Nav scroll still works.
 */
export default function Archive() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const trackEl = track.current!;
      const getDist = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);

      const tween = gsap.to(trackEl, {
        x: () => -getDist(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current!,
          start: "top top",
          end: () => `+=${getDist()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-panel-img]").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement!,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section id="archive" className="relative">
      <div ref={wrap} className="relative h-[100svh] overflow-hidden bg-night text-ink">
        {/* header — different font types for distinction */}
        <div className="absolute inset-x-[6vw] top-24 z-20 flex items-center justify-between gap-4 md:top-28">
          <span className="flex items-center gap-3 font-body text-[15px] font-bold uppercase tracking-[0.15em] text-paper drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)] md:text-[18px]">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-lime shadow-[0_0_10px_rgba(217,255,74,0.6)]" />
            04 — Projects Archive
          </span>
          <span className="font-body text-[13px] font-medium tracking-[0.1em] text-paper/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] md:text-[15px]">
            ( 08 entries — 2024 → 2025 )
          </span>
        </div>

        {/* horizontal track */}
        <div ref={track} className="flex h-full w-max items-center gap-[4vw] pl-[6vw] pr-[12vw] pt-16 md:pt-10">
          {/* intro panel */}
          <div className="flex w-[82vw] shrink-0 flex-col justify-center md:w-[30vw]">
            <h3 className="font-display text-[clamp(2.6rem,5.2vw,4.8rem)] font-semibold leading-[0.98] tracking-tight text-ink">
              Shipped,
              <br />
              not just
              <br />
              <em className="font-serif text-[1.02em] font-normal italic text-aqua">built</em>
              <span className="text-lime">.</span>
            </h3>
            <p className="mt-7 max-w-sm font-display text-base font-medium leading-relaxed tracking-tight text-paper md:text-[1.15rem] md:leading-relaxed">
              Eight systems filed — platforms, engines, bots, and theory. Every entry shipped, running, and on record.
            </p>
            <span className="mt-10 flex items-center gap-3 font-mono text-[12px] font-bold uppercase tracking-[0.32em] text-paper drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] md:text-[13px]">
              Drag the scroll <ArrowRight className="h-4 w-4 text-lime" />
            </span>
          </div>

          {/* project panels */}
          {PROJECTS.map((p, i) => (
            <a
              key={p.title}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              data-hover
              className="group relative block h-[64vh] w-[84vw] shrink-0 overflow-hidden rounded-3xl border border-white/10 transition-colors duration-500 hover:border-white/30 md:h-[68vh] md:w-[42vw]"
            >
              <img
                data-panel-img
                src={p.img}
                alt={p.title}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-center will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/95 via-night/25 to-night/30" />

              {/* top meta row */}
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 md:p-7">
                <span className="font-mono text-xs tracking-[0.2em] text-ink drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
                  0{i + 1}
                </span>
                <div className="flex items-center gap-2">
                  {p.featured && (
                    <span className="rounded-full bg-lime px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.18em] text-night shadow-sm shadow-black/20">
                      Featured
                    </span>
                  )}
                  {p.web && (
                    <span className="rounded-full border border-aqua/80 bg-night/20 px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.18em] text-aqua shadow-sm shadow-black/20 backdrop-blur-sm">
                      Web
                    </span>
                  )}
                  <span className="rounded-full border border-white/35 bg-night/20 px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.18em] text-ink shadow-sm shadow-black/20 backdrop-blur-sm">
                    {p.lang}
                  </span>
                </div>
              </div>

              {/* bottom info */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/88 via-night/45 to-transparent p-6 md:p-8">
                <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                  {p.subtitle} — {p.year}
                </p>
                <div className="flex items-end justify-between gap-4">
                  <h4 className="font-display text-2xl font-semibold leading-[1.05] tracking-tight text-ink drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] md:text-4xl">
                    {p.title}
                  </h4>
                  <span className="grid h-12 w-12 shrink-0 translate-y-2 place-items-center rounded-full border border-white/25 bg-night/40 opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5 text-ink" />
                  </span>
                </div>
                <p className="mt-3 hidden max-w-lg text-sm leading-relaxed text-ink/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] line-clamp-2 md:block">
                  {p.desc}
                </p>
                <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
                  {p.tags}
                </p>
              </div>
            </a>
          ))}

          {/* end CTA panel */}
          <a
            href="https://github.com/Sabermrddz"
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            data-hover
            className="group relative flex h-[64vh] w-[70vw] shrink-0 flex-col items-start justify-between overflow-hidden rounded-3xl border border-dashed border-white/20 p-8 transition-colors duration-500 hover:border-lime/60 md:h-[68vh] md:w-[26vw]"
          >
            <img
              src="/logos/github.jpg"
              alt="GitHub background"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-35 transition-transform duration-700 group-hover:scale-105 animate-github-tone"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night/92 via-night/55 to-night/20" />
            <span className="relative grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-night/35 text-ink transition-all duration-500 group-hover:rotate-45 group-hover:border-lime group-hover:text-lime">
              <ArrowUpRight className="h-6 w-6" />
            </span>
            <span className="relative font-display text-3xl font-semibold leading-tight tracking-tight text-ink drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)] md:text-4xl">
              + more
              <br />
              shelved at
              <em className="mt-2 block font-serif text-[0.72em] font-normal italic text-lime drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                github.com/Sabermrddz
              </em>
            </span>
          </a>
        </div>

        {/* progress */}
        <div className="absolute bottom-8 left-1/2 z-20 h-px w-[min(420px,58vw)] -translate-x-1/2 bg-white/10">
          <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-lime" />
        </div>
      </div>
    </section>
  );
}
