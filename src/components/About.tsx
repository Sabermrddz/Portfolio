import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, type MotionValue } from "framer-motion";
import { traits } from "../data/archive";

const EASE = [0.22, 1, 0.36, 1] as const;

const TEXT =
  "Full-stack developer working from Batna, Algeria. I build *MERN* platforms, *Django* portals, *quant* tools and *Telegram* *bots* — systems that ship, run, and stay up. Filed under: Python, JavaScript, and everything in between.";

const STATS = [
  { target: 4.5, label: "Years experience", suffix: "+", decimals: 1 },
  { target: 8, label: "Public repos", suffix: "+", pad: 2 },
  { target: 8, label: "Projects filed", pad: 2 },
  { target: 2021, label: "Active since" },
] as const;

function CountUp({
  target,
  decimals = 0,
  suffix = "",
  pad = 0,
  duration = 1700,
}: {
  target: number;
  decimals?: number;
  suffix?: string;
  pad?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(() => {
    if (decimals > 0) return (0).toFixed(decimals);
    return pad ? String(0).padStart(pad, "0") : "0";
  });

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let final = decimals > 0 ? target.toFixed(decimals) : String(target);
      if (pad && decimals === 0) final = final.padStart(pad, "0");
      setDisplay(final);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = eased * target;
      let out: string;
      if (decimals > 0) out = current.toFixed(decimals);
      else out = Math.round(current).toString();
      if (pad && decimals === 0) out = out.padStart(pad, "0");
      setDisplay(out);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else {
        let final = decimals > 0 ? target.toFixed(decimals) : String(target);
        if (pad && decimals === 0) final = final.padStart(pad, "0");
        setDisplay(final);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, decimals, pad, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix ? <span className="text-acid">{suffix}</span> : null}
    </span>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const accent = children.startsWith("*");
  const clean = children.replace(/\*/g, "");
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={accent ? "text-acid" : undefined}>
      {clean}{" "}
    </motion.span>
  );
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const traitsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.3"] });
  const words = TEXT.split(" ");

  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: imgProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const imgY = useTransform(imgProgress, [0, 1], ["-12%", "12%"]);

  useEffect(() => {
    const wrap = traitsRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chips = Array.from(wrap.querySelectorAll<HTMLElement>("[data-trait-chip]"));
    const colors = ["#d9ff4a", "#22d3ee", "#ffffff", "#8b5cf6"];
    let raf = 0;
    const start = performance.now();

    const loop = (now: number) => {
      const t = (now - start) / 1000;
      chips.forEach((chip, i) => {
        const phase = t * 1.35 + i * 0.55;
        const pulse = 0.5 + Math.sin(phase) * 0.5;
        const color = colors[(i + Math.floor(t * 0.75)) % colors.length];
        chip.style.color = color;
        chip.style.borderColor = `rgba(255,255,255,${0.18 + pulse * 0.22})`;
        chip.style.backgroundColor = `rgba(6, 6, 11, ${0.26 + pulse * 0.2})`;
        chip.style.boxShadow = `0 0 ${Math.round(10 + pulse * 8)}px rgba(255,255,255,${0.04 + pulse * 0.08})`;
        chip.style.transform = `translateY(${Math.sin(phase) * 1.5}px)`;
      });
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="about" className="relative px-4 py-20 sm:px-6 sm:py-28 md:px-10 md:py-44">
      <div className="mb-10 flex items-center justify-between gap-4">
        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 font-mono text-[13px] font-semibold uppercase tracking-[0.28em] text-paper backdrop-blur-sm md:px-6 md:py-2.5 md:text-[15px]">
          (01 — About)
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-smoke">Filed, not hyped.</span>
      </div>

      {/* Bio — word reveal */}
      <div ref={ref}>
        <p className="max-w-6xl font-display text-3xl font-medium leading-[1.15] tracking-tight text-paper sm:text-4xl md:text-5xl lg:text-6xl">
          {words.map((word, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {word}
            </Word>
          ))}
        </p>
      </div>

      {/* Quote + traits */}
      <div className="mt-14 grid grid-cols-12 gap-6 sm:mt-20 sm:gap-8 md:mt-28">
        <motion.blockquote
          className="col-span-12 border-l-2 border-acid pl-6 md:col-span-6 md:pl-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="font-display text-xl font-medium leading-snug text-paper sm:text-2xl md:text-4xl">
            “Most portfolios shout. This one <span className="text-acid">files</span> — only
            shipped, running work stays on record.”
          </p>
        </motion.blockquote>

        <div className="col-span-12 md:col-span-5 md:col-start-8">
          <p className="mb-5 font-mono text-[12px] font-bold uppercase tracking-[0.32em] text-acid md:text-[14px]">
            Traits on record
          </p>
          <div ref={traitsRef} className="flex flex-wrap gap-2">
            {traits.map((t, i) => (
              <motion.span
                key={t}
                data-trait-chip
                className="rounded-full border border-white/15 bg-night/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/90 transition-colors duration-300 hover:border-acid hover:text-acid"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                {t}
              </motion.span>
            ))}
          </div>

        </div>
      </div>

      {/* Merged archive principle — shorter, no box, bigger & visible */}
      <motion.p
        className="mx-auto mt-12 max-w-4xl text-center font-display text-xl font-medium leading-[1.15] tracking-tight text-paper sm:mt-16 sm:text-2xl md:mt-24 md:text-[2.1rem] md:leading-[1.15]"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        Autodidact, ship-oriented — <span className="text-acid">one-person archive</span>. No layers,
        no hand-offs — you talk directly to the builder. Only what runs enters the record.
      </motion.p>

      {/* Image + stats */}
      <div ref={imgRef} className="mt-12 grid grid-cols-12 gap-4 sm:mt-16 sm:gap-6 md:mt-24">
        <div className="relative col-span-12 overflow-hidden rounded-sm md:col-span-7">
          <motion.img
            src="/images/studio.jpg"
            alt="The archive desk, working late from Batna"
            className="h-[36vh] w-full scale-[1.28] object-cover sm:h-[46vh] md:h-[68vh]"
            loading="lazy"
            decoding="async"
            style={{ y: imgY }}
          />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-line bg-ink/70 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-acid" />
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-paper/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
              Batna, DZ — currently shipping
            </span>
          </div>
        </div>
        <div className="col-span-12 flex flex-col justify-end md:col-span-5">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-line">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className="bg-ink p-6 md:p-8"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              >
                <p className="font-display text-3xl font-medium text-paper sm:text-4xl md:text-5xl">
                  <CountUp
                    target={s.target}
                    decimals={(s as { decimals?: number }).decimals ?? 0}
                    suffix={(s as { suffix?: string }).suffix ?? ""}
                    pad={(s as { pad?: number }).pad ?? 0}
                    duration={s.target === 2021 ? 2100 : 1600}
                  />
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
