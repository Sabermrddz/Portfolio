import { motion } from "framer-motion";
import { achievements } from "../data/archive";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Achievements() {
  return (
    <section className="relative px-6 py-28 md:px-10 md:py-40">
      <div className="mb-14 flex items-end justify-between md:mb-20">
        <div>
          <span className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 font-body text-[13px] font-bold uppercase tracking-[0.2em] text-paper backdrop-blur-sm md:px-6 md:py-2.5 md:text-[15px]">
            (03 — Achievements)
          </span>
          <motion.h2
            className="font-display text-5xl font-medium uppercase leading-[0.95] tracking-tight text-paper md:text-8xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Numbers,
            <br />
            <span className="text-outline">kept honestly.</span>
          </motion.h2>
          <p className="mt-5 max-w-2xl font-mono text-[11px] uppercase leading-loose tracking-[0.22em] text-paper/75 md:text-[12px]">
            Projects archived. Years building. Fluid motion. Node powered. Each card is filed with the work that shipped.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-line sm:grid-cols-2">
        {achievements.map((a, i) => (
          <motion.article
            key={a.label}
            data-cursor="hover"
            className="group relative overflow-hidden bg-ink p-8 transition-colors duration-500 hover:bg-panel md:p-12"
            initial={{ opacity: 0, y: 28 }}
            animate={{
              opacity: 1,
              y: [0, -6, 0],
            }}
            transition={{
              opacity: { duration: 0.7, delay: i * 0.12, ease: EASE },
              y: {
                duration: 3.8 + (i % 2) * 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 0.15,
              },
            }}
          >
            {/* auto shimmer sweep without trigger */}
            <motion.div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "linear",
                delay: i * 0.4,
              }}
              style={{ willChange: "transform" }}
            />
            <div className="flex items-start justify-between">
              <p className="font-display text-5xl font-medium tracking-tight text-paper transition-colors duration-500 group-hover:text-acid md:text-7xl drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]">
                {a.value}
              </p>
              <motion.span
                className="rounded-full border border-acid/25 bg-acid/10 px-2.5 py-1 font-mono text-xs tracking-[0.2em] text-acid backdrop-blur-sm"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              >
                {a.pct}%
              </motion.span>
            </div>

            {/* Progress track — auto animated */}
            <div className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-acid"
                initial={{ width: 0 }}
                animate={{ width: `${a.pct}%`, opacity: [0.9, 1, 0.9] }}
                transition={{
                  width: { duration: 1.4, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 + i * 0.15 },
                }}
              />
            </div>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.28em] text-paper/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
              {a.label}
            </p>
            <p className="mt-3 max-w-md text-sm font-normal leading-relaxed text-paper/82">
              {a.text}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
