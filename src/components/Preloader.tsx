import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start = 0;
    const duration = 2100;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(onComplete, 420);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100]"
      initial="visible"
      exit="exit"
      variants={{ visible: {}, exit: { transition: { duration: 1.1 } } }}
    >
      {/* Acid trailing panel */}
      <motion.div
        className="absolute inset-0 bg-acid"
        variants={{
          visible: { y: 0 },
          exit: { y: "-100%", transition: { duration: 0.85, delay: 0.18, ease: EASE } },
        }}
      />
      {/* Ink main panel */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-between bg-ink p-6 md:p-10"
        variants={{
          visible: { y: 0 },
          exit: { y: "-100%", transition: { duration: 0.85, ease: EASE } },
        }}
      >
        <motion.div
          className="flex h-full flex-col justify-between"
          variants={{
            visible: { opacity: 1 },
            exit: { opacity: 0, transition: { duration: 0.3 } },
          }}
        >
          <div className="flex items-start justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-smoke">
            <span>Saber_mourad</span>
            <span className="hidden sm:block">S. Mourad, Archivist</span>
          </div>

          <div className="flex items-end justify-between">
            <p className="mb-3 max-w-[220px] font-mono text-[11px] uppercase leading-relaxed tracking-[0.25em] text-smoke">
              Filed, not hyped — opening the archive
            </p>
            <div className="flex items-baseline font-display text-[22vw] font-medium leading-[0.8] tracking-tight text-paper md:text-[16vw]">
              {count}
              <span className="ml-1 text-[4vw] text-acid md:text-[3vw]">%</span>
            </div>
          </div>
        </motion.div>

        {/* Progress hairline */}
        <motion.div
          className="absolute bottom-0 left-0 h-[3px] bg-acid"
          style={{ width: `${count}%` }}
          variants={{ exit: { opacity: 0 } }}
        />
      </motion.div>
    </motion.div>
  );
}
