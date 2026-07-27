'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const GLOW = '#ff1744';

/** Concept 04 — the visitor becomes the input: cursor = KNN query point. */
export default function KNNPlayground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clsRef = useRef<HTMLSpanElement | null>(null);
  const voteRef = useRef<HTMLSpanElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let A: { x: number; y: number }[] = [];
    let B: { x: number; y: number }[] = [];
    let mx = 0;
    let my = 0;
    let has = false;
    const K = 5;

    function seed() {
      w = cv!.clientWidth;
      h = cv!.clientHeight;
      cv!.width = w * dpr;
      cv!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      mx = w / 2;
      my = h / 2;
      A = [];
      B = [];
      for (let i = 0; i < 22; i++) A.push({ x: w * (0.12 + Math.random() * 0.32), y: h * (0.15 + Math.random() * 0.7) });
      for (let i = 0; i < 22; i++) B.push({ x: w * (0.56 + Math.random() * 0.32), y: h * (0.15 + Math.random() * 0.7) });
    }
    seed();

    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      has = true;
    };
    const onLeave = () => {
      has = false;
    };
    cv.addEventListener('mousemove', onMove);
    cv.addEventListener('mouseleave', onLeave);

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const all = A.map((p) => ({ ...p, c: 0, d: 0 })).concat(B.map((p) => ({ ...p, c: 1, d: 0 })));
      let near: typeof all = [];
      if (has) {
        all.forEach((p) => (p.d = Math.hypot(p.x - mx, p.y - my)));
        near = all.slice().sort((a, b) => a.d - b.d).slice(0, K);
        near.forEach((p) => {
          ctx!.strokeStyle = p.c ? 'rgba(255,23,68,0.55)' : 'rgba(255,255,255,0.4)';
          ctx!.lineWidth = 1.4;
          ctx!.beginPath();
          ctx!.moveTo(mx, my);
          ctx!.lineTo(p.x, p.y);
          ctx!.stroke();
        });
      }
      all.forEach((p) => {
        const inN = near.includes(p);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, inN ? 6 : 4.5, 0, 6.28);
        ctx!.fillStyle = p.c ? 'rgba(255,23,68,0.85)' : 'rgba(235,235,235,0.85)';
        ctx!.fill();
        if (inN) {
          ctx!.strokeStyle = '#fff';
          ctx!.lineWidth = 1.5;
          ctx!.stroke();
        }
      });
      if (has) {
        const votes = near.reduce((s, p) => s + p.c, 0);
        const cls = votes >= 3 ? 1 : 0;
        ctx!.beginPath();
        ctx!.arc(mx, my, 9, 0, 6.28);
        ctx!.fillStyle = cls ? GLOW : '#fff';
        ctx!.shadowColor = cls ? GLOW : '#fff';
        ctx!.shadowBlur = 16;
        ctx!.fill();
        ctx!.shadowBlur = 0;
        ctx!.strokeStyle = '#000';
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
        if (clsRef.current) {
          clsRef.current.textContent = cls ? 'Class B' : 'Class A';
          clsRef.current.style.color = cls ? GLOW : '#fff';
        }
        if (voteRef.current) voteRef.current.textContent = `${K - votes} A · ${votes} B`;
      } else {
        if (clsRef.current) clsRef.current.textContent = '—';
        if (voteRef.current) voteRef.current.textContent = '—';
      }
    }

    let raf = 0;
    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }
    if (reduce) draw();
    else raf = requestAnimationFrame(loop);

    const onResize = () => seed();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      cv.removeEventListener('mousemove', onMove);
      cv.removeEventListener('mouseleave', onLeave);
    };
  }, [reduce]);

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="font-display text-xl font-bold text-blood tabular-nums">04</span>
        <h2 className="font-display text-xl md:text-2xl font-bold text-fg tracking-tight">
          Interactive playground
        </h2>
      </div>
      <p className="text-sm text-fg/50 mb-5 max-w-xl">
        You are the query point. K-Nearest Neighbours finds your {5} closest points and votes on the class — live.
      </p>
      <div className="relative rounded-2xl border border-white/10 overflow-hidden bg-[#0b0b0b]">
        <span className="absolute top-3.5 left-3.5 z-10 text-[10px] font-mono uppercase tracking-[0.14em] text-white/40 border border-white/10 rounded-md px-2.5 py-1.5 bg-black/50 backdrop-blur-sm">
          move your cursor — you are the query
        </span>
        <div className="absolute top-3.5 right-3.5 z-10 text-xs font-mono text-white/60 border border-white/10 rounded-lg px-3 py-2 bg-black/50 backdrop-blur-sm text-right leading-relaxed">
          predicted <b className="text-white" ref={clsRef}>—</b>
          <br />
          k=5 vote <span ref={voteRef}>—</span>
        </div>
        <canvas ref={canvasRef} className="block w-full h-[320px] md:h-[380px]" aria-hidden />
      </div>
    </section>
  );
}
