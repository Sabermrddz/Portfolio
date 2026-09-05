import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { focusAreas } from "../data/archive";
import { cn } from "../utils/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

function FocusCard({ f, i }: { f: (typeof focusAreas)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // Scroll-linked drift: moves DOWN while page scrolls UP,
  // counteracting native scroll so the card lags behind = slower feel.
  // Reduce the drift range again so this section feels ~40% slower than before.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const slowY = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  return (
    <div ref={ref} className="sticky mb-6" style={{ top: `calc(16vh + ${i * 38}px)` }}>
      <motion.div style={{ y: slowY }} className="will-change-transform">
        <motion.article
          data-cursor="hover"
          className={cn(
            "group relative flex min-h-[38vh] flex-col justify-between overflow-hidden rounded-lg border p-6 sm:min-h-[46vh] sm:p-8 md:p-14",
            f.invert ? "border-acid bg-acid text-ink" : "border-line bg-panel text-paper"
          )}
          style={{
            backgroundImage:
              i === 0
                ? "linear-gradient(rgba(6,6,11,0.72), rgba(6,6,11,0.9)), url('/logos/ai.jpg')"
                : i === 1
                  ? "linear-gradient(rgba(6,6,11,0.68), rgba(6,6,11,0.88)), url('/logos/quant_user.jpg')"
                  : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 2, ease: EASE }}
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-0",
              i === 2 ? "bg-gradient-to-br from-acid/18 via-transparent to-black/25" : "bg-gradient-to-br from-white/5 via-transparent to-black/20"
            )}
          />
          <div className="flex items-start justify-between">
            <span className={cn("relative z-10 font-mono text-xs tracking-[0.25em]", f.invert ? "text-ink/80" : "text-acid/95")}>
              /{f.id}
            </span>
            <ArrowUpRight
              className={cn(
                "relative z-10 h-10 w-10 transition-transform duration-500 ease-out group-hover:rotate-45 md:h-16 md:w-16",
                f.invert ? "text-ink/90" : "text-paper/80 group-hover:text-acid"
              )}
              strokeWidth={1}
            />
          </div>

          {i !== 2 ? (
            <div className="relative z-10 grid grid-cols-12 items-end gap-4 rounded-2xl border border-white/10 bg-ink/30 p-4 backdrop-blur-md sm:gap-8 sm:p-5 md:p-7">
              <h3
                className={cn(
                  "col-span-12 font-display text-3xl font-medium uppercase leading-[0.95] tracking-tight sm:text-4xl md:col-span-7 md:text-7xl",
                  f.invert ? "text-ink" : "text-paper"
                )}
              >
                {f.title}
              </h3>
              <div className="col-span-12 md:col-span-5">
                <p className={cn("max-w-md text-sm font-normal leading-relaxed md:text-base", f.invert ? "text-ink/88" : "text-paper/92")}>{f.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {f.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] backdrop-blur-sm",
                        f.invert ? "border-ink/25 bg-white/20 text-ink" : "border-white/20 bg-black/20 text-paper/90"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 mt-auto flex flex-col gap-6 pt-8 md:pt-12">
              <h3 className="max-w-2xl font-display text-3xl font-medium uppercase leading-[0.95] tracking-tight text-ink sm:text-4xl md:text-7xl">
                {f.title}
              </h3>
              <p className="max-w-2xl text-sm font-normal leading-relaxed text-ink/88 md:text-base">
                {f.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {f.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ink/20 bg-white/35 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.article>
      </motion.div>
    </div>
  );
}

export default function Focus() {
  return (
    <section className="relative px-4 pb-20 sm:px-6 sm:pb-28 md:px-10 md:pb-40">
      <div className="mb-14 flex flex-col items-center text-center md:mb-20">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-paper/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
          (What I do)
        </p>
        <motion.h2
          className="font-display text-4xl font-medium uppercase leading-[0.95] tracking-tight text-paper sm:text-5xl md:text-8xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          Focus
          <br />
          <span className="text-outline">Areas</span>
        </motion.h2>
        <p className="mx-auto mt-5 max-w-2xl font-display text-lg font-medium leading-snug tracking-tight text-paper sm:text-xl md:mt-8 md:text-3xl md:leading-tight">
          Three lanes. Everything filed under one of them.
        </p>
      </div>

      <div className="relative">
        {focusAreas.map((f, i) => (
          <FocusCard key={f.id} f={f} i={i} />
        ))}
      </div>
    </section>
  );
}
