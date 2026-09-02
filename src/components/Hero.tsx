import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import Magnetic from "./Magnetic";
import { heroStats } from "../data/archive";

function parseHeroValue(value: string) {
  const hasPrefixPlus = value.startsWith("+");
  const hasSuffixPlus = value.endsWith("+");
  const numeric = value.replace(/^\+/, "").replace(/\+$/, "");
  const decimals = numeric.includes(".") ? numeric.split(".")[1].length : 0;
  const padLen = !numeric.includes(".") && numeric.length > 1 && numeric.startsWith("0") ? numeric.length : 0;
  const target = parseFloat(numeric);
  return { hasPrefixPlus, hasSuffixPlus, numeric, decimals, padLen, target };
}

function CountUpStat({ value, started, delay = 0 }: { value: string; started: boolean; delay?: number }) {
  const { hasPrefixPlus, hasSuffixPlus, decimals, padLen, target } = useMemo(() => parseHeroValue(value), [value]);
  const initial = useMemo(() => {
    if (decimals > 0) return (0).toFixed(decimals);
    if (padLen) return String(0).padStart(padLen, "0");
    return "0";
  }, [decimals, padLen]);
  const [display, setDisplay] = useState(initial);

  useEffect(() => {
    if (!started) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const final = decimals > 0 ? target.toFixed(decimals) : padLen ? String(target).padStart(padLen, "0") : String(target);
      setDisplay(final);
      return;
    }
    let raf = 0;
    let timeoutId: number | undefined;
    const duration = decimals > 0 ? 1900 : 1500;

    const startAnim = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const current = target * eased;
        let formatted: string;
        if (decimals > 0) {
          formatted = current.toFixed(decimals);
          if (p === 1) formatted = target.toFixed(decimals);
        } else {
          const intVal = Math.floor(current);
          formatted = padLen ? String(intVal).padStart(padLen, "0") : String(intVal);
          if (p === 1) formatted = padLen ? String(target).padStart(padLen, "0") : String(target);
        }
        setDisplay(formatted);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (delay > 0) timeoutId = window.setTimeout(startAnim, delay);
    else startAnim();

    return () => {
      cancelAnimationFrame(raf);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [started, target, decimals, padLen, delay]);

  return (
    <>
      {hasPrefixPlus && <span className="text-acid">+</span>}
      {display}
      {hasSuffixPlus && <span className="text-acid">+</span>}
    </>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;
const LINE_ONE = "SABER".split("");
const LINE_TWO = "MOURAD".split("");

function TypewriterIntro() {
  const fullText = "Hi ! _  i'm";
  const [display, setDisplay] = useState("");
  const [, setDone] = useState(false);

  useEffect(() => {
    let mounted = true;
    let raf = 0;
    let timeoutId: number | undefined;
    const speed = 120; // ms per char

    const startTyping = () => {
      let i = 0;
      let last = 0;

      const tick = (now: number) => {
        if (!mounted) return;
        if (now - last >= speed) {
          last = now;
          i += 1;
          setDisplay(fullText.slice(0, i));
          if (i >= fullText.length) {
            setDone(true);
            // pause then restart
            timeoutId = window.setTimeout(() => {
              if (!mounted) return;
              setDisplay("");
              setDone(false);
              startTyping();
            }, 3000);
            return;
          }
        }
        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    startTyping();
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <p
      aria-label={fullText}
      className="mb-3 inline-flex items-center font-mono text-[clamp(1.1rem,4.5vw,1.73rem)] tracking-[0.02em] text-acid"
    >
      <span className="mr-3 h-[1px] w-9 bg-gradient-to-r from-ash/0 via-ash/60 to-ash/0" aria-hidden />
      <span className="text-acid font-semibold">{display}</span>
      <span className="ml-[6px] inline-block h-[1.05em] w-[2px] translate-y-[1px] bg-acid animate-blink" aria-hidden />
    </p>
  );
}

function OrbitBadge() {
  return (
    <a
      href="#archive"
      aria-label="Browse projects and achievements"
      data-cursor="hover"
      className="relative block h-28 w-28 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-acid md:h-36 md:w-36"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow">
        <defs>
          <path id="circlePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-paper font-mono text-[7.5px] uppercase tracking-[0.32em]">
          <textPath href="#circlePath">
            browse projects &amp; achievements — browse projects &amp; achievements — browse projects &amp; achievements —
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <ArrowDown className="h-5 w-5 text-acid" strokeWidth={1.5} />
      </div>
    </a>
  );
}

function LocationMeta() {
  const wrapRef = useRef<HTMLParagraphElement>(null);
  const pinWrapRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now();
    const el = wrapRef.current;
    const pin = pinWrapRef.current;
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      // +50% bigger base is 16.5px, JS adds subtle pulse + glow
      const scale = 1 + Math.sin(t * 1.6) * 0.035;
      const glow = 0.55 + Math.sin(t * 1.9) * 0.45;
      if (el) {
        el.style.transform = `scale(${scale.toFixed(3)})`;
        el.style.textShadow = `0 0 ${Math.round(10 * glow)}px rgba(212,255,63,${(0.38 * glow).toFixed(2)})`;
        el.style.filter = `drop-shadow(0 0 ${Math.round(6 * glow)}px rgba(212,255,63,${(0.22 * glow).toFixed(2)}))`;
      }
      if (pin) {
        const ps = 1 + Math.sin(t * 2.2) * 0.1;
        pin.style.transform = `scale(${ps.toFixed(3)})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <p
      ref={wrapRef}
      className="flex flex-col items-center text-center will-change-transform"
      style={{ transformOrigin: "center" }}
    >
      <span className="flex items-center gap-2">
        <span ref={pinWrapRef} className="inline-flex will-change-transform">
          <MapPin className="h-6 w-6 text-acid" strokeWidth={1.7} />
        </span>
        Batna, DZ
      </span>
      <span className="mt-0.5">36.75°N 5.77°E</span>
    </p>
  );
}

function CombinedTagline() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.innerHTML = `
        <p class="ct-line ct-line-1">— turning vision into reality, <em class="ct-acid">quietly &amp; precisely.</em></p>
        <p class="ct-line ct-line-2">Quant, UIUX, DevOps, hosting pro, desktop apps, bots and more ...</p>
      `;
      return;
    }
    const line1a = "— turning vision into reality,";
    const line1b = "quietly &amp; precisely.";
    const line2 = "Quant, UIUX, DevOps, hosting pro, desktop apps, bots and more ...";

    const w1a = line1a.split(/(\s+)/);
    const w1b = line1b.split(/(\s+)/);
    const w2 = line2.split(/(\s+)/);

    el.innerHTML = `
      <p class="ct-line ct-line-1">${w1a
        .map((w, i) => (/^\s+$/.test(w) ? w : `<span class="ct-word" style="--i:${i}">${w}</span>`))
        .join("")} <em class="ct-acid">${w1b
        .map((w, i) => (/^\s+$/.test(w) ? w : `<span class="ct-word acid" style="--i:${i + w1a.length}">${w}</span>`))
        .join("")}</em></p>
      <p class="ct-line ct-line-2">${w2
        .map((w, i) => (/^\s+$/.test(w) ? w : `<span class="ct-word desc" style="--i:${i}">${w}</span>`))
        .join("")}</p>
    `;

    const style = document.createElement("style");
    style.id = "ct-style";
    style.textContent = `
      .ct-line { margin: 0; }
      .ct-line-1 { font-family: ui-serif, Georgia, 'Times New Roman', serif; font-size: clamp(0.95rem,3.8vw,1.75rem); line-height:1.15; white-space: normal; overflow: visible; animation: ctFloat 7s ease-in-out infinite; }
      .ct-line-1 .ct-acid { color: var(--color-acid); font-style: italic; font-weight: 400; animation: ctGlow 2.8s ease-in-out infinite; }
      .ct-line-2 { font-size: clamp(0.82rem,3.2vw,1.25rem); margin-top:0.55rem; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.78); font-weight: 500; }
      .ct-word { display:inline-block; opacity:0; transform: translateY(10px); filter: blur(6px); animation: ctReveal 0.68s cubic-bezier(0.22,1,0.36,1) forwards; animation-delay: calc(var(--i) * 0.045s); }
      .ct-word.desc { animation: ctReveal 0.68s cubic-bezier(0.22,1,0.36,1) forwards, ctFloatWord 4.8s ease-in-out infinite; animation-delay: calc(var(--i) * 0.04s + 0.65s), calc(var(--i) * 0.08s + 1.8s); color: #fff; will-change: transform, opacity, filter; }
      .ct-word.acid { color: var(--color-acid); }
      @keyframes ctReveal { to { opacity:1; transform: translateY(0); filter: blur(0); } }
      @keyframes ctFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
      @keyframes ctGlow { 0%, 100% { text-shadow: 0 0 0 rgba(212,255,63,0); } 50% { text-shadow: 0 0 12px rgba(212,255,63,0.22); } }
      @keyframes ctFloatWord { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      @media (prefers-reduced-motion: reduce) { .ct-word { animation:none; opacity:1; transform:none; filter:none; } }
    `;
    document.head.appendChild(style);

    // auto JS wave — no trigger, loops forever
    let raf = 0;
    let startedLoop = false;
    const start = performance.now();
    const words = Array.from(el.querySelectorAll<HTMLElement>(".ct-word.desc"));
    const loop = (now: number) => {
      if (!startedLoop) {
        if (now - start < 1800) {
          raf = requestAnimationFrame(loop);
          return;
        }
        startedLoop = true;
      }

      const t = (now - start) / 1000;
      words.forEach((word, i) => {
        const wave = Math.sin(t * 1.1 + i * 0.5);
        const lift = wave * 1.6;
        const glow = Math.max(0, wave) * 0.14;
        word.style.opacity = `${0.92 + wave * 0.06}`;
        word.style.transform = `translateY(${lift.toFixed(2)}px)`;
        word.style.filter = `drop-shadow(0 0 ${glow.toFixed(2)}rem rgba(255,255,255,0.14))`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      document.getElementById("ct-style")?.remove();
    };
  }, []);

  return <div ref={ref} className="mt-2 max-w-none" />;
}

export default function Hero({ started }: { started: boolean }) {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes nameRevealV1 {
        to { transform: translateY(0%); opacity: 1; }
      }
      .name-char-v1 { display:inline-block; transform: translateY(112%); opacity:0; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative flex min-h-svh flex-col overflow-hidden">
      {/* Backdrop */}
      <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale }}>
        <motion.img
          src="/images/hero.jpg"
          alt=""
          className="h-full w-full object-cover opacity-60"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          initial={{ scale: 1.25, filter: "brightness(0.4)" }}
          animate={started ? { scale: 1, filter: "brightness(1)" } : {}}
          transition={{ duration: 2, ease: EASE }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/20 to-ink" />
      </motion.div>

      <motion.div
        className="relative flex flex-1 flex-col justify-between px-4 pb-0 pt-20 sm:px-6 sm:pt-24 md:px-10 md:pt-28"
        style={{ opacity: fade }}
      >
        {/* Metadata row */}
        <motion.div
          className="flex items-start justify-center font-mono text-[clamp(0.7rem,3.5vw,1.03rem)] uppercase leading-relaxed tracking-[0.25em] text-smoke"
          initial={{ opacity: 0, y: -16 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
        >
          <LocationMeta />
        </motion.div>

        {/* Giant name */}
        <div className="mt-8 md:mt-0">
          <div>
            {/* Typewriter intro: replaced the old 'Full-stack · Python · Automation' badge */}
            <div className="mb-5">
              <TypewriterIntro />
            </div>
          </div>

          <h1 className="font-display font-semibold uppercase leading-[0.85] tracking-[-0.02em]">
            <span className="block overflow-hidden text-[18vw] text-paper sm:text-[16vw] md:text-[15vw]">
              {LINE_ONE.map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: "112%", rotate: 4 }}
                  animate={started ? { y: 0, rotate: 0 } : {}}
                  transition={{ duration: 1.2, delay: 0.85 + i * 0.06, ease: EASE }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
            <span
              className="block overflow-hidden pl-[6vw] whitespace-nowrap text-[clamp(2.5rem,13vw,10rem)] font-extrabold tracking-tight [filter:drop-shadow(0_4px_18px_rgba(244,241,234,0.10))]"
              style={{ fontFamily: '"Syne", sans-serif' }}
            >
              {LINE_TWO.map((letter, i) => (
                <span
                  key={i}
                  className="name-char-v1 text-outline-v1 inline-block"
                  style={{
                    fontFamily: '"Syne", sans-serif',
                    animation: `nameRevealV1 1.2s cubic-bezier(0.22,1,0.36,1) forwards`,
                    animationDelay: `${1.05 + i * 0.06}s`,
                  }}
                >
                  {letter}
                </span>
              ))}
              <motion.span
                className="ml-[0.04em] inline-block text-acid"
                initial={{ opacity: 0, y: "110%" }}
                animate={started ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 1.55, ease: EASE }}
              >
                .
              </motion.span>
            </span>
          </h1>

          {/* Sub row — one-line first sentence + auto JS shimmer (no trigger) */}
          <div className="mt-4 flex items-end justify-between gap-4 sm:mt-6 sm:gap-8 md:mt-8">
            <motion.div
              className="max-w-none flex-1"
              initial={{ opacity: 0, y: 28 }}
              animate={started ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.5, ease: EASE }}
            >
              <CombinedTagline />
            </motion.div>
            <motion.div
              className="hidden shrink-0 md:block"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={started ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 1.7, ease: EASE }}
            >
              <Magnetic strength={0.4}>
                <OrbitBadge />
              </Magnetic>
            </motion.div>
          </div>
        </div>

        {/* Stats bar — count-up animated */}
        <motion.div
          className="mt-8 grid grid-cols-3 gap-px border-t border-line bg-line sm:mt-12"
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.9 }}
        >
          {heroStats.map((s, i) => (
            <div key={s.label} className="bg-ink/80 px-2.5 py-4 backdrop-blur-sm sm:px-4 sm:py-5 md:px-6">
              <p className="font-display text-xl font-medium tabular-nums text-paper sm:text-2xl md:text-4xl">
                <CountUpStat value={s.value} started={started} delay={1900 + i * 120} />
              </p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-smoke sm:text-[9px] sm:tracking-[0.22em] md:text-[10px]">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
