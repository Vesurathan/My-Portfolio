'use client';

import { useEffect, useRef } from 'react';

/** Perlin-ish flow field — particles stream along a noise field in blood tones. */
export default function FlowField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    const N = reduce ? 0 : 130;
    const ps: { x: number; y: number; px: number; py: number }[] = [];

    const fract = (v: number) => v - Math.floor(v);
    const hash = (x: number, y: number) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453);
    const noise = (x: number, y: number) => {
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      const xf = x - xi;
      const yf = y - yi;
      const a = hash(xi, yi);
      const b = hash(xi + 1, yi);
      const c = hash(xi, yi + 1);
      const d = hash(xi + 1, yi + 1);
      const ux = xf * xf * (3 - 2 * xf);
      const uy = yf * yf * (3 - 2 * yf);
      return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
    };

    const fit = () => {
      w = cv.width = cv.clientWidth;
      h = cv.height = cv.clientHeight;
    };
    fit();
    window.addEventListener('resize', fit);

    for (let i = 0; i < N; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ps.push({ x, y, px: x, py: y });
    }

    let t = 0;
    let raf = 0;
    const frame = () => {
      ctx.fillStyle = 'rgba(9,9,9,0.08)';
      ctx.fillRect(0, 0, w, h);
      t += 0.002;
      for (const p of ps) {
        const a = noise(p.x * 0.0025, p.y * 0.0025 + t) * Math.PI * 4;
        p.px = p.x;
        p.py = p.y;
        p.x += Math.cos(a) * 1.4;
        p.y += Math.sin(a) * 1.4;
        if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.px = p.x;
          p.py = p.y;
        }
        ctx.strokeStyle = Math.random() < 0.5 ? 'rgba(196,30,58,0.5)' : 'rgba(255,23,68,0.5)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    };
    if (!reduce) frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fit);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
