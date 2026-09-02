import { useEffect, useRef, useState } from "react";
import SectionHead from "./SectionHead";
import { XLogo } from "./icons";
import { Send, Check, Loader2, ShieldCheck, ArrowUpRight } from "lucide-react";

/* keep exactly as in v1 — orbit definitions in stage fractions */
const ORBITS = [
  { cx: 0.22, cy: 0.32, rx: 0.17, ry: 0.24, speed: 0.62, phase: 0 },
  { cx: 0.78, cy: 0.28, rx: 0.19, ry: 0.25, speed: -0.52, phase: 1.8 },
  { cx: 0.5, cy: 0.82, rx: 0.18, ry: 0.21, speed: 0.58, phase: 1.1 },
  { cx: 0.18, cy: 0.72, rx: 0.16, ry: 0.22, speed: -0.48, phase: 3.0 },
  { cx: 0.82, cy: 0.72, rx: 0.18, ry: 0.23, speed: 0.55, phase: 0.7 },
  { cx: 0.5, cy: 0.48, rx: 0.21, ry: 0.19, speed: 0.46, phase: 2.6 },
];

const SOCIALS = {
  github: "https://github.com/Sabermrddz",
  x: "https://x.com/sabermourad7",
  instagram: "https://www.instagram.com/saber_mrd_/",
  itch: "https://sabermrddz.itch.io/",
  telegram: "https://t.me/sabermrddz",
  discord: "https://discord.com/users/924701364385382410",
};

interface BubbleData {
  name: string;
  icon?: React.ReactNode;
  image?: string;
  url: string;
  label: string;
}

export default function Contact() {
  const stageRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([null, null, null, null, null, null]);
  const hoverState = useRef([false, false, false, false, false, false]);

  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const reduceMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  const isTouch =
    typeof window !== "undefined"
      ? !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      : false;

  const tiltHovered = useRef(false);
  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !formCardRef.current) return;
    tiltHovered.current = true;
    const rect = formCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    formCardRef.current.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
    formCardRef.current.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
    formCardRef.current.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    formCardRef.current.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const handleTiltLeave = () => {
    tiltHovered.current = false;
  };
  const handleTiltEnter = () => {
    if (reduceMotion) return;
    tiltHovered.current = true;
  };

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      if (!tiltHovered.current && formCardRef.current) {
        const t = (now - start) / 1000;
        const tRx = Math.sin(t * 0.45) * 3.2;
        const tRy = Math.cos(t * 0.38) * 4.2;
        const tMx = 50 + Math.sin(t * 0.34) * 26;
        const tMy = 50 + Math.cos(t * 0.41) * 20;
        const style = formCardRef.current.style;
        const curRx = parseFloat(style.getPropertyValue("--rx")) || 0;
        const curRy = parseFloat(style.getPropertyValue("--ry")) || 0;
        const curMx = parseFloat(style.getPropertyValue("--mx")) || 50;
        const curMy = parseFloat(style.getPropertyValue("--my")) || 50;
        const nRx = curRx + (tRx - curRx) * 0.04;
        const nRy = curRy + (tRy - curRy) * 0.04;
        const nMx = curMx + (tMx - curMx) * 0.04;
        const nMy = curMy + (tMy - curMy) * 0.04;
        style.setProperty("--rx", `${nRx.toFixed(2)}deg`);
        style.setProperty("--ry", `${nRy.toFixed(2)}deg`);
        style.setProperty("--mx", `${nMx.toFixed(1)}%`);
        style.setProperty("--my", `${nMy.toFixed(1)}%`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  const bubbles: BubbleData[] = [
    { name: "instagram", url: SOCIALS.instagram, label: "@saber_mrd_", image: "/images/instagram-logo.jpg" },
    { name: "x", url: SOCIALS.x, label: "@sabermourad7", image: "/images/x_logo.jpg" },
    { name: "github", url: SOCIALS.github, label: "Sabermrddz", image: "/images/githublogo.jpg" },
    { name: "itch", url: SOCIALS.itch, label: "Itch.io", image: "/images/itch-logo.jpg" },
    { name: "telegram", url: SOCIALS.telegram, label: "Telegram", image: "/images/telegramlogo.jpg" },
    { name: "discord", url: SOCIALS.discord, label: "Discord", image: "/images/discord_logo.jpg" },
  ];

  useEffect(() => {
    const stage = stageRef.current;
    const els = bubblesRef.current;
    if (!stage || !els.some((el) => el)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let wPx = stage.clientWidth;
    let hPx = stage.clientHeight;
    let sizes = els.map((el) => (el ? el.offsetWidth : 90));
    const times = [0.4, 2.3, 4.1, 1.5, 5.8, 3.0];

    const place = (i: number) => {
      const o = ORBITS[i];
      const el = els[i];
      if (!el) return;
      const th = times[i] * o.speed + o.phase;
      const x = o.cx + o.rx * Math.cos(th) + 0.012 * Math.cos(times[i] * 0.9 + i * 1.7);
      const y = o.cy + o.ry * Math.sin(th) + 0.022 * Math.sin(times[i] * 1.5 + i * 2.4);
      const s = 1 + 0.025 * Math.sin(times[i] * 1.1 + i);
      el.style.transform = `translate3d(${(x * wPx - sizes[i] / 2).toFixed(1)}px, ${(y * hPx - sizes[i] / 2).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
    };

    const COUNT = ORBITS.length;
    const onResize = () => {
      wPx = stage.clientWidth;
      hPx = stage.clientHeight;
      sizes = els.map((el) => (el ? el.offsetWidth : 90));
      if (reduced) {
        for (let i = 0; i < COUNT; i++) place(i);
      }
    };
    window.addEventListener("resize", onResize);

    if (reduced) {
      for (let i = 0; i < COUNT; i++) place(i);
      return () => window.removeEventListener("resize", onResize);
    }

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      for (let i = 0; i < COUNT; i++) {
        if (!hoverState.current[i]) times[i] += dt;
        place(i);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const pause = (i: number) => () => (hoverState.current[i] = true);
  const resume = (i: number) => () => (hoverState.current[i] = false);

  const getBubbleContent = (bubble: BubbleData) => {
    if (bubble.image) {
      if (bubble.name === "x" || bubble.name === "telegram" || bubble.name === "github") {
        return (
          <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-black">
            <img
              src={bubble.image}
              alt={bubble.name}
              className="h-full w-full object-cover rounded-full"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              draggable={false}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </span>
        );
      }
      return (
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white p-2">
          <img
            src={bubble.image}
            alt={bubble.name}
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            draggable={false}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </span>
      );
    } else if (bubble.icon === "x") {
      return (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-black text-white">
          <XLogo size={24} />
        </span>
      );
    }
    return null;
  };

  const getBubbleStyle = (index: number) => {
    const gradients = [
      "#000000",
      "#000000",
      "linear-gradient(135deg,#1f2937 0%,#374151 50%,#4b5563 100%)",
      "#ffffff",
      "#000000",
      "#000000",
    ];

    if (index === 1) {
      return {
        background: "#000000",
        boxShadow: "0 0 70px rgba(0,0,0,0.55), 0 18px 50px -12px rgba(0,0,0,0.8)",
      };
    }

    const background = gradients[index] || gradients[0];
    const shadowColors = [
      "rgba(0,0,0,0.55)",
      "rgba(0,0,0,0.55)",
      "rgba(0,0,0,0.40)",
      "rgba(255,255,255,0.32)",
      "rgba(0,0,0,0.55)",
      "rgba(0,0,0,0.55)",
    ];

    return {
      background,
      boxShadow: `0 0 70px ${shadowColors[index]}, 0 18px 50px -12px rgba(0,0,0,0.8)`,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending || submitted) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to send. Try again.");
      setSubmitted(true);
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : "Failed to send. Check your connection.";
      // Vite proxy ECONNREFUSED → fetch TypeError: Failed to fetch
      if (/Failed to fetch|ECONNREFUSED|NetworkError/i.test(msg)) {
        msg = "Email server not reachable. If you use `npm run dev`, Vite now handles email directly — just set real Gmail + App Password in .env and retry. Or run `npm run dev:all` / `npm run server` in another terminal.";
      }
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSending(false);
    setError(null);
    setValues({ name: "", email: "", message: "" });
    setFocused(null);
  };

  return (
    <section id="contact" className="relative py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHead
          index="05"
          label="CONTACT"
          align="center"
          autoAnimate
          title={
            <>
              Contact <span className="text-outline">Us</span>
            </>
          }
        />
        <p className="mx-auto mt-5 max-w-xl text-center font-serif text-[clamp(1.15rem,2.4vw,1.55rem)] italic leading-relaxed text-paper/70">
          Find Me Orbiting — <span className="text-ash">Six orbits. Endless connections.</span>
        </p>

        {/* orbit stage — transparent without coloring */}
        <div
          ref={stageRef}
          className="relative mt-12 w-full overflow-hidden rounded-2xl border border-white/10 bg-transparent"
          style={{ height: "clamp(260px, 50vw, 520px)" }}
          role="group"
          aria-label="Orbit stage with six social profile bubbles"
        >

          <p className="absolute left-1/2 top-5 z-10 -translate-x-1/2 whitespace-nowrap font-body font-bold text-[0.56rem] tracking-[0.3em] text-ash/80 uppercase">
            ORBIT STAGE — 06 BODIES — ELLIPTICAL PATHS
          </p>
          {ORBITS.map((o, i) => (
            <div
              key={i}
              aria-hidden="true"
              className="absolute z-10 rounded-[50%] border-[1.5px] border-dashed border-white/[0.15]"
              style={{
                width: `${o.rx * 200}%`,
                height: `${o.ry * 200}%`,
                left: `${o.cx * 100}%`,
                top: `${o.cy * 100}%`,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 12px rgba(244,241,234,0.08), inset 0 0 9px rgba(244,241,234,0.03)",
              }}
            />
          ))}
          {bubbles.map((bubble, i) => (
            <a
              key={i}
              ref={(el) => {
                bubblesRef.current[i] = el;
              }}
              href={bubble.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${bubble.name.charAt(0).toUpperCase() + bubble.name.slice(1)} — ${bubble.label}`}
              className="bubble absolute left-0 top-0 z-10 will-change-transform"
              style={{ width: "clamp(48px, 13vw, 84px)" }}
              onPointerEnter={pause(i)}
              onPointerLeave={resume(i)}
              onFocus={pause(i)}
              onBlur={resume(i)}
            >
              <span
                className="bubble-inner flex w-full rounded-full p-[3px]"
                style={{
                  aspectRatio: "1 / 1",
                  ...getBubbleStyle(i),
                }}
              >
                {getBubbleContent(bubble)}
              </span>
            </a>
          ))}
        </div>

        {/* marquee — bigger & more visible */}
        <div className="mx-auto mt-7 max-w-[560px] overflow-hidden rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
          <div className="marquee relative overflow-hidden py-3.5">
            <div className="marquee-track items-center">
              {Array.from({ length: 4 }).map((_, k) => (
                <span key={k} className="flex shrink-0 items-center">
                  <span className="font-mono text-[0.82rem] font-bold tracking-[0.26em] text-paper drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] md:text-[0.86rem]">
                    ◆ HOVER TO FREEZE AN ORBIT — CLICK TO OPEN
                  </span>
                  <span className="mx-6 text-[0.62rem] text-acid" aria-hidden="true">
                    ◆
                  </span>
                </span>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-void to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-void to-transparent" />
          </div>
        </div>

        {/* ================= Simplified Prefer email? — no 3D, lightweight auto JS ================= */}
        <div className="relative mt-12 overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-transparent p-3 sm:mt-16 sm:rounded-[2.1rem] sm:p-6 lg:p-7">

          <div className="relative mb-6 flex flex-col gap-4 border-b border-white/[0.06] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h3 className="font-serif text-[clamp(1.8rem,5vw,4.4rem)] leading-[0.96] tracking-tight text-paper">
                Prefer <span className="italic text-paper">email?</span>
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-md">
                <ShieldCheck size={12} className="text-paper" />
                <span className="font-body text-[0.62rem] font-bold tracking-[0.2em] text-paper">ENCRYPTED</span>
              </span>
            </div>
          </div>

          <div className="relative mx-auto max-w-2xl">
            {/* right — form (kept, tilt auto JS still active) */}
            <div
              ref={formCardRef}
              onMouseMove={handleTiltMove}
              onMouseEnter={handleTiltEnter}
              onMouseLeave={handleTiltLeave}
              onPointerEnter={handleTiltEnter}
              onPointerLeave={handleTiltLeave}
              className="contact-tilt relative overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-transparent p-4 sm:rounded-[1.8rem] sm:p-7 lg:p-8"
              style={
                {
                  "--rx": "0deg",
                  "--ry": "0deg",
                  "--mx": "50%",
                  "--my": "50%",
                  transform: isTouch ? "none" : "perspective(1200px) rotateX(var(--rx)) rotateY(var(--ry))",
                  transformStyle: "preserve-3d",
                } as React.CSSProperties
              }
            >
              <div className="relative" style={{ transform: "translateZ(18px)" }}>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1.5 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-paper" />
                  <span className="font-body text-[0.68rem] font-bold tracking-[0.22em] text-paper">SECURE TRANSMISSION</span>
                  <ArrowUpRight size={12} className="text-paper" />
                </div>
                <h4 className="mt-4 font-serif text-[2.2rem] leading-[0.95] tracking-tight text-paper sm:text-[2.8rem]">
                  Send a <span className="italic font-light text-paper">message.</span>
                </h4>
                <p className="mt-3 max-w-[36ch] font-mono text-[0.82rem] leading-relaxed tracking-wide text-paper/85 sm:text-[0.88rem]">
                  Simple form — just type and send.
                </p>
              </div>

              <div className="relative mt-6 flex-1" style={{ transform: "translateZ(22px)" }}>
                {submitted ? (
                  <div className="relative overflow-hidden rounded-2xl border border-emerald-300/40 bg-emerald-400/[0.09] p-7 text-center shadow-[0_0_36px_rgba(16,185,129,0.12)] backdrop-blur-md sm:p-8">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(16,185,129,0.12),transparent_70%)]" />
                    <div className="relative">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-300 text-void shadow-[0_8px_30px_rgba(16,185,129,0.4)]">
                        <Check size={26} strokeWidth={2.8} />
                      </div>
                      <h5 className="mt-5 font-serif text-[1.65rem] font-medium tracking-tight text-emerald-200 sm:text-[1.9rem]">Message sent.</h5>
                      <p className="mx-auto mt-2 max-w-[32ch] font-mono text-[0.78rem] leading-relaxed tracking-wide text-paper/90 sm:text-[0.84rem]">
                        Your message has been sealed and queued. I&apos;ll reply within a few hours — usually faster.
                      </p>
                      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
                        <button
                          onClick={resetForm}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 font-mono text-[0.62rem] font-bold tracking-[0.18em] text-emerald-300 transition hover:bg-emerald-400/15"
                        >
                          SEND ANOTHER <ArrowUpRight size={12} />
                        </button>
                      </div>
                      <p className="hidden">
                        ID: {Math.random().toString(36).slice(2, 8).toUpperCase()} • {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <label className="group/field relative block">
                        <span className="mb-1.5 block font-mono text-[0.68rem] font-medium tracking-[0.18em] text-paper group-focus-within/field:text-paper">YOUR NAME</span>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                            onFocus={() => setFocused("name")}
                            onBlur={() => setFocused(null)}
                            placeholder="you"
                            required
                            className="peer w-full rounded-xl border border-white/[0.08] bg-transparent px-3.5 py-3 pr-9 font-mono text-[0.9rem] font-medium tracking-wide text-paper placeholder:text-paper/55 backdrop-blur-md outline-none transition-all duration-300 focus:border-paper/20 focus:bg-transparent focus:shadow-[0_0_22px_rgba(244,241,234,0.08)]"
                          />
                          <span className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 transition ${focused === "name" || values.name ? "bg-paper text-void" : "bg-white/5 text-ash/60"}`}>
                            <span className="block h-1.5 w-1.5 rounded-full bg-current" />
                          </span>
                        </div>
                      </label>

                      <label className="group/field relative block">
                        <span className="mb-1.5 block font-mono text-[0.68rem] font-medium tracking-[0.18em] text-paper group-focus-within/field:text-paper">EMAIL ADDRESS</span>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                            onFocus={() => setFocused("email")}
                            onBlur={() => setFocused(null)}
                            placeholder="yourmail@domain.com"
                            required
                            className="peer w-full rounded-xl border border-white/[0.08] bg-transparent px-3.5 py-3 pr-9 font-mono text-[0.9rem] font-medium tracking-wide text-paper placeholder:text-paper/55 backdrop-blur-md outline-none transition-all duration-300 focus:border-paper/20 focus:bg-transparent focus:shadow-[0_0_22px_rgba(244,241,234,0.08)]"
                          />
                          <span className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 transition ${focused === "email" || values.email ? "bg-paper text-void" : "bg-white/5 text-ash/60"}`}>
                            <span className="text-[0.62rem] leading-none">✦</span>
                          </span>
                        </div>
                      </label>
                    </div>

                    <label className="group/field relative block">
                      <span className="mb-1.5 flex items-center justify-between font-mono text-[0.68rem] font-medium tracking-[0.18em] text-paper group-focus-within/field:text-paper">
                        <span>MESSAGE</span>
                        <span className="font-mono text-[0.64rem] font-medium tracking-wide text-paper/70">{values.message.length}/500</span>
                      </span>
                      <div className="relative">
                        <textarea
                          name="message"
                          value={values.message}
                          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value.slice(0, 500) }))}
                          onFocus={() => setFocused("message")}
                          onBlur={() => setFocused(null)}
                          placeholder="Tell me about your idea, project, or just say hi..."
                          rows={4}
                          required
                          className="peer max-h-[140px] min-h-[110px] w-full resize-none rounded-xl border border-white/[0.08] bg-transparent px-3.5 py-3 font-mono text-[0.9rem] font-medium leading-relaxed tracking-wide text-paper placeholder:text-paper/55 backdrop-blur-md outline-none transition-all duration-300 focus:border-paper/20 focus:bg-transparent focus:shadow-[0_0_22px_rgba(244,241,234,0.08)]"
                        />
                        <div className="pointer-events-none absolute bottom-2 right-2 hidden items-center gap-1 rounded-full border border-white/10 bg-void/60 px-2 py-1 backdrop-blur sm:flex">
                          <span className="h-1 w-1 rounded-full bg-emerald-400/80" />
                          <span className="font-mono text-[0.62rem] font-medium tracking-[0.16em] text-paper/80">E2E</span>
                        </div>
                      </div>
                    </label>

                    <button
                      type="submit"
                      disabled={sending}
                      className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-paper px-6 py-4 font-mono text-[0.84rem] font-bold tracking-[0.18em] text-void antialiased shadow-[0_10px_30px_rgba(244,241,234,0.14),inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_14px_40px_rgba(244,241,234,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] active:translate-y-[0px] disabled:cursor-not-allowed disabled:opacity-90"
                      style={{ transform: "translateZ(10px)" }}
                    >
                      <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60 transition duration-700 group-hover/btn:translate-x-[100%]" aria-hidden="true" />
                      {sending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          SEALING &amp; SENDING...
                        </>
                      ) : (
                        <>
                          <Send size={16} className="transition group-hover/btn:translate-x-0.5" />
                          SEND TRANSMISSION
                          <ArrowUpRight size={14} className="opacity-80 transition group-hover/btn:translate-x-0.5 group-hover/btn:opacity-100" />
                        </>
                      )}
                    </button>

                    {error && (
                      <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-center font-mono text-[0.72rem] leading-relaxed text-red-300">
                        {error}
                      </p>
                    )}

                    <p className="flex items-center justify-center gap-1.5 pt-1 text-center font-body text-[0.68rem] font-bold tracking-wide text-paper/80 uppercase">
                      <ShieldCheck size={12} className="text-paper/70" />
                      Encrypted channel • No spam • Reply in ~2h
                    </p>
                  </form>
                )}
              </div>

              <div
                className="relative mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4"
                style={{ transform: "translateZ(12px)" }}
              >
                <span className="font-body text-[0.64rem] font-bold tracking-[0.18em] text-paper/80">ALSO FIND ME •</span>
                <span className="font-body text-[0.64rem] font-bold tracking-[0.14em] text-paper/70"> ORBIT ABOVE</span>
              </div>
            </div>
          </div>

          <p className="relative mx-auto mt-4 max-w-2xl text-center font-mono text-[0.52rem] leading-relaxed tracking-wide text-ash/55">
            Portal is now lightweight — pure CSS + JS auto glow, no WebGL. Keeps the same box background and feel.
          </p>
        </div>
      </div>
    </section>
  );
}
