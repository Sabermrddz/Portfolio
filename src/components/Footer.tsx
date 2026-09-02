import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import Magnetic from "./Magnetic";


const EASE = [0.22, 1, 0.36, 1] as const;

function useClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Africa/Algiers",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Footer({ onNavigate }: { onNavigate: (t: string) => void }) {
  const time = useClock();

  return (
    <footer className="relative overflow-hidden border-t border-line px-4 pt-20 sm:px-6 sm:pt-28 md:px-10 md:pt-40">
      <div className="flex flex-col items-start">
        <motion.p
          className="mb-6 font-mono text-[12px] font-semibold uppercase tracking-[0.28em] text-paper drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] md:text-[14px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          (Saber_mourad — Full-stack · Python · Automation)
        </motion.p>

        <Magnetic strength={0.15} className="w-fit">
          <motion.button
            data-cursor="hover"
            onClick={() => onNavigate("#contact")}
            className="group flex items-center gap-2 font-display text-[12vw] font-semibold uppercase leading-[0.85] tracking-tight text-paper sm:gap-3 sm:text-[11vw] md:text-[9vw]"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: EASE }}
          >
            <span className="transition-colors duration-500 group-hover:text-acid">Get in Touch</span>
            <ArrowUpRight
              className="h-[9vw] w-[9vw] text-acid transition-transform duration-500 group-hover:rotate-45 sm:h-[8vw] sm:w-[8vw] md:h-[6vw] md:w-[6vw]"
              strokeWidth={1.2}
            />
          </motion.button>
        </Magnetic>
      </div>

      {/* Meta — equally spread across footer */}
      <div className="mt-16 border-t border-line py-8 sm:mt-24 sm:py-10 md:mt-32 md:py-12">
        <p className="mb-8 text-center font-mono text-[12px] font-bold uppercase tracking-[0.3em] text-paper md:text-[13px]">Direct line</p>
        <div className="grid grid-cols-1 gap-4 font-mono text-[12px] font-semibold sm:grid-cols-2 sm:gap-6 sm:text-[13px] md:grid-cols-3 lg:grid-cols-6 md:text-[14px]">
          <a data-cursor="hover" href="tel:+213696331367" className="text-center text-paper transition-colors hover:text-acid">
            +213 696 331 367
          </a>
          <a
            data-cursor="hover"
            href="https://t.me/sabermrddz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-paper transition-colors hover:text-acid"
          >
            Telegram — fastest
          </a>
          <a data-cursor="hover" href="mailto:sabermrddz@gmail.com" className="break-all text-center text-paper underline decoration-white/20 underline-offset-4 transition-colors hover:text-acid hover:decoration-acid sm:break-normal">
            sabermrddz@gmail.com
          </a>
          <span className="text-center font-medium tracking-[0.02em] text-paper/80 text-[11px] sm:text-[13px]">Batna, DZ — 36.75°N 5.77°E</span>
          <span className="text-center font-medium tracking-[0.02em] text-paper/80">
            Batna — Local time <span className="font-bold tabular-nums text-acid drop-shadow-[0_0_8px_rgba(212,255,63,0.35)]">{time} CET</span>
          </span>
          <div className="col-span-1 flex justify-center sm:col-span-2 md:col-span-3 lg:col-span-1 lg:justify-end">
            <Magnetic strength={0.5}>
              <button
                data-cursor="hover"
                onClick={() => onNavigate("#top")}
                aria-label="Back to top"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-paper transition-colors duration-300 hover:border-acid hover:bg-acid hover:text-ink md:h-12 md:w-12"
              >
                <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="pointer-events-none select-none overflow-hidden">
        <motion.p
          className="translate-y-[18%] whitespace-nowrap text-center font-display text-[21vw] font-semibold leading-[0.8] tracking-tight text-panel"
          initial={{ y: "45%" }}
          whileInView={{ y: "18%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          SABER.
        </motion.p>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-t border-line py-6 font-body font-bold text-[11px] uppercase tracking-[0.24em] sm:flex-row sm:items-center md:text-[12px]">
        <motion.span
          className="font-semibold text-paper drop-shadow-[0_0_10px_rgba(212,255,63,0.18)]"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          © saber_mourad — Built with precision
        </motion.span>
        <motion.span
          className="font-medium text-paper/80"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          S. Mourad, Archivist
        </motion.span>
      </div>
    </footer>
  );
}
