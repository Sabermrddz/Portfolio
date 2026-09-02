import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface NavProps {
  started: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: (target: string) => void;
}

export default function Nav({ started, menuOpen, onToggleMenu, onNavigate }: NavProps) {
  const [showTopButtons, setShowTopButtons] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTopButtons(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[70] mix-blend-difference"
      initial={{ y: -80, opacity: 0 }}
      animate={started ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 md:px-10">
        <div className="flex items-center min-w-[6rem] md:min-w-[8rem]">
          <button
            data-cursor="hover"
            onClick={() => onNavigate("#top")}
            aria-label="Back to top"
            className={`flex items-center gap-3 border-0 bg-transparent px-2 py-2 text-base md:text-lg text-paper ${showTopButtons ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            <ArrowUp className="h-6 w-6" />
            <span>TOP</span>
          </button>
        </div>

        <div className="hidden items-center gap-8 font-mono text-[14px] md:text-[16px] uppercase tracking-[0.25em] text-paper md:flex">
          <button data-cursor="hover" onClick={() => onNavigate("#about")} className="link-sweep text-lg md:text-xl">
            About
          </button>
          <button data-cursor="hover" onClick={() => onNavigate("#archive")} className="link-sweep text-lg md:text-xl">
            Archive
          </button>
          <button data-cursor="hover" onClick={() => onNavigate("#contact")} className="link-sweep text-lg md:text-xl">
            Contact
          </button>
        </div>

        <button
          data-cursor="hover"
          onClick={onToggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="group flex h-10 w-10 flex-col items-center justify-center gap-[7px]"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            className="block h-px w-7 bg-paper transition-colors"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            className="block h-px w-7 bg-paper transition-colors"
          />
        </button>
      </nav>
    </motion.header>
  );
}
