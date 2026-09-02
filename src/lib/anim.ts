import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out" });

/** Shared handle so any component can drive the smooth scroller */
export const lenisStore: { current: Lenis | null } = { current: null };

export const scrollToId = (id: string) => {
  const lenis = lenisStore.current;
  if (lenis) {
    lenis.scrollTo(id, { offset: -64, duration: 1.6 });
  } else {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  }
};

export { gsap, ScrollTrigger };
