import { useEffect, useRef } from "react";

interface Props {
  index: string;
  label: string;
  title: React.ReactNode;
  align?: "left" | "center";
  autoAnimate?: boolean;
}

export default function SectionHead({ index, label, title, align = "left", autoAnimate = false }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (autoAnimate) {
      let raf = 0;
      let startTime: number | null = null;
      const duration = 1500;

      const tick = (now: number) => {
        if (startTime === null) startTime = now;
        const elapsed = (now - startTime) % duration;
        const progress = elapsed / duration;

        const x = 50 + Math.sin(progress * Math.PI * 2) * 40;
        const y = 50 + Math.cos(progress * Math.PI * 2) * 30;

        el.style.setProperty("--gradient-x", `${x}%`);
        el.style.setProperty("--gradient-y", `${y}%`);

        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    } else {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--gradient-x", `${x}%`);
        el.style.setProperty("--gradient-y", `${y}%`);
      };

      el.addEventListener("mousemove", handleMouseMove);
      return () => el.removeEventListener("mousemove", handleMouseMove);
    }
  }, [autoAnimate]);

  return (
    <div className={align === "center" ? "text-center" : ""}>
      <div className={`flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}>
        <span className="font-body text-[0.82rem] font-bold uppercase tracking-[0.25em] text-ash md:text-[0.92rem]">{index}</span>
        <span className="h-px w-12 bg-paper/30" aria-hidden="true" />
        <span className="font-body text-[0.82rem] font-bold uppercase tracking-[0.25em] text-paper md:text-[0.92rem]">{label}</span>
      </div>
      <h2
        ref={titleRef}
        className={`section-head-title mt-5 font-display text-[clamp(2rem,5.4vw,3.9rem)] font-bold leading-[1.02] tracking-tight ${autoAnimate ? "auto-animate" : ""}`}
        style={{ ["--gradient-x" as string]: "50%", ["--gradient-y" as string]: "50%" } as React.CSSProperties}
      >
        {title}
      </h2>
    </div>
  );
}
