import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type CursorVariant = "default" | "hover" | "view";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [visible, setVisible] = useState(false);

  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const ringX = useSpring(cx, { stiffness: 420, damping: 38, mass: 0.6 });
  const ringY = useSpring(cy, { stiffness: 420, damping: 38, mass: 0.6 });
  const dotX = useSpring(cx, { stiffness: 1600, damping: 80, mass: 0.2 });
  const dotY = useSpring(cy, { stiffness: 1600, damping: 80, mass: 0.2 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    setEnabled(true);
    document.body.classList.add("custom-cursor");

    const onMove = (e: MouseEvent) => {
      cx.set(e.clientX);
      cy.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      if (t) setVariant((t.dataset.cursor as CursorVariant) || "hover");
      else setVariant("default");
    };
    const onLeaveDoc = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveDoc);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
      document.body.classList.remove("custom-cursor");
    };
  }, [cx, cy]);

  if (!enabled) return null;

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[98]"
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          animate={{
            width: variant === "view" ? 96 : variant === "hover" ? 64 : 36,
            height: variant === "view" ? 96 : variant === "hover" ? 64 : 36,
            backgroundColor: variant === "view" ? "#d4ff3f" : "rgba(212,255,63,0)",
            borderColor: variant === "view" ? "rgba(212,255,63,0)" : "rgba(236,233,226,0.5)",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          style={{ borderWidth: 1 }}
        >
          <AnimatePresence>
            {variant === "view" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="font-mono text-[10px] font-medium tracking-[0.2em] text-ink"
              >
                VIEW
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Precise dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99]"
        style={{ x: dotX, y: dotY, opacity: visible && variant !== "view" ? 1 : 0 }}
      >
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acid" />
      </motion.div>
    </>
  );
}
