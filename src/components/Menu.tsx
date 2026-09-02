import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";
import { socials } from "../data/archive";

const EASE = [0.76, 0, 0.24, 1] as const;

const links = [
  { label: "Index", target: "#top", index: "01" },
  { label: "About", target: "#about", index: "02" },
  { label: "Archive", target: "#archive", index: "03" },
  { label: "Inventory", target: "#inventory", index: "04" },
  { label: "Contact", target: "#contact", index: "05" },
];

interface MenuProps {
  open: boolean;
  onNavigate: (target: string) => void;
}

export default function Menu({ open, onNavigate }: MenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-acid text-ink"
          initial={{ y: "-100%" }}
          animate={{ y: 0, transition: { duration: 0.7, ease: EASE } }}
          exit={{ y: "-100%", transition: { duration: 0.65, ease: EASE } }}
        >
          <div className="flex h-full flex-col justify-between overflow-y-auto px-4 pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-24 md:px-10 md:pt-32">
            <nav className="flex flex-col">
              {links.map((link, i) => (
                <div key={link.label} className="overflow-hidden border-b border-ink/15">
                  <motion.button
                    data-cursor="hover"
                    onClick={() => onNavigate(link.target)}
                    className="group flex w-full items-baseline gap-3 py-1 text-left sm:gap-4 md:gap-8 md:py-2"
                    initial={{ y: "110%" }}
                    animate={{ y: 0, transition: { duration: 0.8, delay: 0.25 + i * 0.06, ease: EASE } }}
                    exit={{ y: "110%", transition: { duration: 0.4, ease: EASE } }}
                  >
                    <span className="font-mono text-xs tracking-[0.2em] md:text-sm">{link.index}</span>
                    <span className="font-display text-[11vw] font-medium uppercase leading-[0.98] tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-4 md:text-[7vw]">
                      {link.label}
                    </span>
                    <ArrowUpRight
                      className="ml-auto h-8 w-8 -translate-x-3 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 md:h-14 md:w-14"
                      strokeWidth={1.5}
                    />
                  </motion.button>
                </div>
              ))}
            </nav>

            <motion.div
              className="flex flex-col gap-6 pt-10 md:flex-row md:items-end md:justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.55 } }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60">Direct line — Batna, DZ</p>
                <a
                  data-cursor="hover"
                  href="tel:+213696331367"
                  className="link-sweep font-display text-2xl font-medium md:text-3xl"
                >
                  +213 696 331 367
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {socials.map((s) => (
                  <Magnetic key={s.key} strength={0.5}>
                    <a
                      data-cursor="hover"
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 font-mono text-[10px] tracking-widest transition-colors duration-300 hover:bg-ink hover:text-acid"
                    >
                      {s.key}
                    </a>
                  </Magnetic>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
