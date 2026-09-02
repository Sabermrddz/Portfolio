import { useEffect, useRef } from "react";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  tw: number;
}
interface Orb {
  x: number;
  y: number;
  r: number;
  hue: string;
  dx: number;
  dy: number;
  ph: number;
}
interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

const PALETTE = [
  "rgba(244,241,234,0.055)",
  "rgba(129,140,248,0.05)",
  "rgba(45,212,191,0.045)",
  "rgba(251,191,36,0.04)",
  "rgba(244,114,182,0.035)",
];
const LINK = 120;
const LINK_SQ = LINK * LINK;

/**
 * OrbitVoid — same logic as VoidBackground but sized to parent container.
 * Used inside the bubbles box so that box has exact moving v1 background,
 * clipped to rounded-2xl.
 */
export default function OrbitVoid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current?.parentElement as HTMLElement | null;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let particles: P[] = [];
    const orbs: Orb[] = [];
    let stars: Star[] = [];
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const build = () => {
      const rect = container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const count = Math.min(180, Math.floor((w * h) / 5200));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.4 + 0.5,
        a: Math.random() * 0.5 + 0.35,
        tw: Math.random() * Math.PI * 2,
      }));

      orbs.length = 0;
      for (let i = 0; i < 4; i++) {
        orbs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 160 + 140,
          hue: PALETTE[i % PALETTE.length],
          dx: (Math.random() - 0.5) * 0.18,
          dy: (Math.random() - 0.5) * 0.16,
          ph: Math.random() * Math.PI * 2,
        });
      }
      stars = [];
    };

    const spawnStar = () => {
      stars.push({
        x: Math.random() * w,
        y: -10,
        vx: -(Math.random() * 2.5 + 1.8),
        vy: Math.random() * 2 + 1.2,
        life: 0,
        max: Math.random() * 50 + 50,
      });
    };

    const cellSize = LINK;
    let gridCols = 0;
    let grid: P[][] = [];

    const buildGrid = () => {
      gridCols = Math.ceil(w / cellSize) + 1;
      const gridRows = Math.ceil(h / cellSize) + 1;
      grid = Array.from({ length: gridCols * gridRows }, () => []);
      for (const p of particles) {
        const cx = (p.x / cellSize) | 0;
        const cy = (p.y / cellSize) | 0;
        if (cx >= 0 && cx < gridCols && cy >= 0 && cy < gridRows) {
          grid[cy * gridCols + cx].push(p);
        }
      }
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);

      for (const o of orbs) {
        o.x += o.dx + Math.sin(o.ph + o.y * 0.002) * 0.09;
        o.y += o.dy + Math.cos(o.ph + o.x * 0.002) * 0.07;
        if (o.x < -o.r) o.x = w + o.r;
        if (o.x > w + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = h + o.r;
        if (o.y > h + o.r) o.y = -o.r;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, o.hue);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
      }

      buildGrid();
      ctx.lineWidth = 0.9;
      for (const a of particles) {
        const cx = (a.x / cellSize) | 0;
        const cy = (a.y / cellSize) | 0;
        for (let dy = -1; dy <= 1; dy++) {
          const ny = cy + dy;
          if (ny < 0) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const nx = cx + dx;
            if (nx < 0 || nx >= gridCols) continue;
            const cell = grid[ny * gridCols + nx];
            if (!cell) continue;
            for (const b of cell) {
              if (a === b) continue;
              if (a > b) continue;
              const ddx = a.x - b.x;
              const ddy = a.y - b.y;
              const d = ddx * ddx + ddy * ddy;
              if (d < LINK_SQ) {
                const alpha = (1 - Math.sqrt(d) / LINK) * 0.28;
                ctx.strokeStyle = `rgba(226,222,210,${alpha.toFixed(3)})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            }
          }
        }
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.022;
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        if (p.y < -8) p.y = h + 8;
        if (p.y > h + 8) p.y = -8;
        const flicker = 0.72 + Math.sin(p.tw) * 0.28;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244,241,234,${(p.a * flicker).toFixed(3)})`;
        ctx.fill();
      }

      if (Math.random() < 0.012 && stars.length < 2) spawnStar();
      stars = stars.filter((s) => s.life < s.max);
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        const fade = 1 - s.life / s.max;
        const tail = 70;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * (tail / 6), s.y - s.vy * (tail / 6));
        grad.addColorStop(0, `rgba(244,241,234,${(0.85 * fade).toFixed(3)})`);
        grad.addColorStop(1, "rgba(244,241,234,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * (tail / 6), s.y - s.vy * (tail / 6));
        ctx.stroke();
      }

      if (!reduced) raf = requestAnimationFrame(frame);
    };

    build();
    frame();

    const ro = new ResizeObserver(() => {
      build();
      if (reduced) frame();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="bg-grid absolute inset-0 opacity-[0.28]" />
      <div className="bg-noise absolute inset-0" />
      <div className="bg-vignette absolute inset-0 opacity-90" />
    </div>
  );
}
