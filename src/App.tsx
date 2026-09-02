import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { gsap, ScrollTrigger, lenisStore } from "./lib/anim";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Menu from "./components/Menu";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import DeferredSection from "./components/DeferredSection";
import VoidBackground from "./components/VoidBackground";
import { stackTicker } from "./data/archive";

const loadAbout = () => import("./components/About");
const loadFocus = () => import("./components/Focus");
const loadInventory = () => import("./components/Inventory");
const loadAchievements = () => import("./components/Achievements");
const loadArchive = () => import("./components/Archive");
const loadContact = () => import("./components/Contact");
const loadFooter = () => import("./components/Footer");

const LazyAbout = lazy(loadAbout);
const LazyFocus = lazy(loadFocus);
const LazyInventory = lazy(loadInventory);
const LazyAchievements = lazy(loadAchievements);
const LazyArchive = lazy(loadArchive);
const LazyContact = lazy(loadContact);
const LazyFooter = lazy(loadFooter);

function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[95] opacity-[0.055] mix-blend-screen"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const warmBelowFold = () => {
      void loadAbout();
      void loadFocus();
      void loadInventory();
      void loadAchievements();
      void loadArchive();
      void loadContact();
      void loadFooter();
    };

    if (typeof window === "undefined") return;

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const id = idleWindow.requestIdleCallback(warmBelowFold, { timeout: 2500 });
      return () => idleWindow.cancelIdleCallback?.(id);
    }

    const timeoutId = window.setTimeout(warmBelowFold, 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  /* Lenis + GSAP wiring for pinned Showcase (transision) */
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisStore.current = lenis;
    lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisStore.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisStore.current;
    if (!lenis) return;
    if (loading || menuOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
    if (!loading) ScrollTrigger.refresh();
  }, [loading, menuOpen]);

  const visitorEmailSentRef = useRef(false);

  useEffect(() => {
    const key = "portfolio_visitor_email_sent";
    if (visitorEmailSentRef.current) return;
    if (sessionStorage.getItem(key) === "1") {
      visitorEmailSentRef.current = true;
      return;
    }

    visitorEmailSentRef.current = true;
    sessionStorage.setItem(key, "1");

    const sendVisitorEmail = async () => {
      try {
        const payload = {
          userAgent: navigator.userAgent,
          page: window.location.href,
          language: navigator.language,
          screen: `${window.screen.width} × ${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
          device: /Mobi|Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
        };

        await fetch("/api/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("Visitor email send failed:", err);
      }
    };

    sendVisitorEmail();
  }, []);

  const scrollTo = (target: string) => {
    const go = () => {
      const el = target === "#top" ? document.body : document.querySelector(target);
      if (!el) return;
      lenisStore.current?.scrollTo(target === "#top" ? 0 : (el as HTMLElement), {
        duration: 1.6,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    };
    if (menuOpen) {
      setMenuOpen(false);
      setTimeout(go, 350);
    } else {
      go();
    }
  };

  return (
    <main className="relative bg-ink font-body text-paper">
      {/* v1 moving background — global, behind everything, same as bubbles box */}
      <VoidBackground />
      <div className="bg-grid pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />
      <div className="bg-noise pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />
      <div className="bg-vignette pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />
      <Grain />

      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <Nav
        started={!loading}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onNavigate={scrollTo}
      />
      <Menu open={menuOpen} onNavigate={scrollTo} />

      <div className="relative z-10">
        <Hero started={!loading} />

        <Ticker items={stackTicker} className="border-y py-3 sm:py-5 md:py-7" />

        <DeferredSection>
          <Suspense fallback={null}>
            <LazyAbout />
          </Suspense>
        </DeferredSection>
        <DeferredSection>
          <Suspense fallback={null}>
            <LazyFocus />
          </Suspense>
        </DeferredSection>
        <DeferredSection>
          <Suspense fallback={null}>
            <LazyInventory />
          </Suspense>
        </DeferredSection>
        <DeferredSection>
          <Suspense fallback={null}>
            <LazyAchievements />
          </Suspense>
        </DeferredSection>
        <DeferredSection>
          <Suspense fallback={null}>
            <LazyArchive />
          </Suspense>
        </DeferredSection>

        <Ticker
          items={["DM for collaboration", "View archive", "Send transmission"]}
          reverse
          outline
          className="border-y py-3 sm:py-5 md:py-7"
        />

        <DeferredSection>
          <Suspense fallback={null}>
            <LazyContact />
          </Suspense>
        </DeferredSection>
        <DeferredSection>
          <Suspense fallback={null}>
            <LazyFooter onNavigate={scrollTo} />
          </Suspense>
        </DeferredSection>
      </div>
    </main>
  );
}
