'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type Algo = 'kmeans' | 'descent' | 'net';

const BLOOD = '#c41e3a';
const GLOW = '#ff1744';

const ALGOS: { id: Algo; label: string; badge: string }[] = [
  { id: 'kmeans', label: 'K-Means clustering', badge: 'unsupervised · clustering' },
  { id: 'descent', label: 'Gradient descent', badge: 'optimisation · gradient descent' },
  { id: 'net', label: 'Neural signal-flow', badge: 'supervised · neural network' },
];

/**
 * Concept 01 — a full-scale algorithm runs and converges at the top of the page.
 * K-Means re-seeds on loop; the chips swap in gradient descent / neural flow.
 */
export default function FeaturedAlgorithm() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const readoutRef = useRef<HTMLDivElement | null>(null);
  const [algo, setAlgo] = useState<Algo>('kmeans');
  const reduce = useReducedMotion();

  useEffect(() => {
    const cv = canvasRef.current;
    const readout = readoutRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function fit() {
      w = cv!.clientWidth;
      h = cv!.clientHeight;
      cv!.width = w * dpr;
      cv!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    fit();

    let frame = 0;
    let iter = 0;
    type Pt = { x: number; y: number; c: number };
    type Cent = { x: number; y: number };
    let pts: Pt[] = [];
    let cents: Cent[] = [];
    let ball = { x: 0, y: 0 };
    let trail: { x: number; y: number }[] = [];
    let net: { nodes: { x: number; y: number; li: number }[]; edges: [number, number][]; pulses: { e: number; t: number }[] } | null =
      null;

    const surf = (x: number) =>
      h * (0.24 + 0.5 * (0.5 - 0.42 * Math.sin((x / w) * Math.PI * 1.15) + 0.13 * Math.sin((x / w) * 9)));
    const dsurf = (x: number) => (surf(x + 1) - surf(x - 1)) / 2;

    function blob(cx: number, cy: number, n: number, s: number) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.28;
        const r = Math.random() * s;
        pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, c: 0 });
      }
    }
    function buildNet() {
      const layers = [3, 5, 5, 3, 1];
      net = { nodes: [], edges: [], pulses: [] };
      const pad = 70;
      layers.forEach((n, li) => {
        const x = pad + (li * (w - 2 * pad)) / (layers.length - 1);
        for (let i = 0; i < n; i++) net!.nodes.push({ x, y: h / 2 + (i - (n - 1) / 2) * 44, li });
      });
      for (let a = 0; a < net.nodes.length; a++)
        for (let b = 0; b < net.nodes.length; b++)
          if (net.nodes[b].li === net.nodes[a].li + 1) net.edges.push([a, b]);
    }
    function init() {
      pts = [];
      cents = [];
      trail = [];
      iter = 0;
      if (algo === 'kmeans') {
        ([[0.25, 0.35], [0.7, 0.3], [0.4, 0.7], [0.78, 0.72]] as const).forEach(([fx, fy]) =>
          blob(fx * w, fy * h, 45, Math.min(w, h) * 0.11)
        );
        for (let k = 0; k < 4; k++) cents.push({ x: Math.random() * w, y: Math.random() * h });
      } else if (algo === 'descent') {
        ball = { x: w * 0.15, y: 0 };
        ball.y = surf(ball.x);
      } else {
        buildNet();
      }
    }
    init();

    const cols = [
      'rgba(255,90,110,0.9)',
      'rgba(196,30,58,0.9)',
      'rgba(255,23,68,0.85)',
      'rgba(150,20,45,0.9)',
    ];

    function draw() {
      frame++;
      ctx!.clearRect(0, 0, w, h);

      if (algo === 'kmeans') {
        for (const p of pts) {
          let bd = 1e9;
          let bi = 0;
          cents.forEach((c, ci) => {
            const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
            if (d < bd) {
              bd = d;
              bi = ci;
            }
          });
          p.c = bi;
        }
        for (const p of pts) {
          const c = cents[p.c];
          ctx!.strokeStyle = 'rgba(196,30,58,0.05)';
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(c.x, c.y);
          ctx!.stroke();
        }
        for (const p of pts) {
          ctx!.fillStyle = cols[p.c];
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, 3, 0, 6.28);
          ctx!.fill();
        }
        if (frame % 3 === 0) {
          cents.forEach((c, ci) => {
            let sx = 0;
            let sy = 0;
            let n = 0;
            for (const p of pts)
              if (p.c === ci) {
                sx += p.x;
                sy += p.y;
                n++;
              }
            if (n) {
              c.x += (sx / n - c.x) * 0.18;
              c.y += (sy / n - c.y) * 0.18;
            }
          });
          iter++;
        }
        cents.forEach((c) => {
          ctx!.fillStyle = '#fff';
          ctx!.strokeStyle = GLOW;
          ctx!.lineWidth = 2;
          ctx!.beginPath();
          ctx!.arc(c.x, c.y, 7, 0, 6.28);
          ctx!.fill();
          ctx!.stroke();
          ctx!.strokeStyle = 'rgba(255,23,68,0.3)';
          ctx!.beginPath();
          ctx!.arc(c.x, c.y, 13 + Math.sin(frame * 0.06) * 2, 0, 6.28);
          ctx!.stroke();
        });
        if (readout) readout.innerHTML = `iteration <b>${iter}</b>`;
        if (frame % 360 === 0) {
          cents.forEach((c) => {
            c.x = Math.random() * w;
            c.y = Math.random() * h;
          });
          iter = 0;
        }
      } else if (algo === 'descent') {
        ctx!.strokeStyle = 'rgba(255,255,255,0.16)';
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const y = surf(x);
          x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
        }
        ctx!.stroke();
        ctx!.lineTo(w, h);
        ctx!.lineTo(0, h);
        ctx!.closePath();
        ctx!.fillStyle = 'rgba(196,30,58,0.05)';
        ctx!.fill();

        ball.x -= dsurf(ball.x) * 0.9 * 6;
        ball.x = Math.max(6, Math.min(w - 6, ball.x));
        ball.y = surf(ball.x);
        trail.push({ x: ball.x, y: ball.y });
        if (trail.length > 60) trail.shift();
        ctx!.strokeStyle = 'rgba(255,23,68,0.5)';
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        trail.forEach((t, i) => (i ? ctx!.lineTo(t.x, t.y) : ctx!.moveTo(t.x, t.y)));
        ctx!.stroke();
        ctx!.fillStyle = GLOW;
        ctx!.shadowColor = GLOW;
        ctx!.shadowBlur = 18;
        ctx!.beginPath();
        ctx!.arc(ball.x, ball.y, 7, 0, 6.28);
        ctx!.fill();
        ctx!.shadowBlur = 0;
        const grad = Math.abs(dsurf(ball.x));
        if (readout) readout.innerHTML = `∥∇loss∥ <b>${grad.toFixed(3)}</b>`;
        if (grad < 0.02 || frame % 420 === 0) {
          ball.x = w * (0.1 + Math.random() * 0.2);
          trail = [];
        }
      } else if (net) {
        if (frame % 8 === 0 && net.pulses.length < 40)
          net.pulses.push({ e: (Math.random() * net.edges.length) | 0, t: 0 });
        net.edges.forEach(([ai, bi]) => {
          const a = net!.nodes[ai];
          const b = net!.nodes[bi];
          ctx!.strokeStyle = 'rgba(196,30,58,0.12)';
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        });
        for (let i = net.pulses.length - 1; i >= 0; i--) {
          const p = net.pulses[i];
          p.t += 0.03;
          if (p.t >= 1) {
            net.pulses.splice(i, 1);
            continue;
          }
          const [ai, bi] = net.edges[p.e];
          const a = net.nodes[ai];
          const b = net.nodes[bi];
          const x = a.x + (b.x - a.x) * p.t;
          const y = a.y + (b.y - a.y) * p.t;
          ctx!.fillStyle = GLOW;
          ctx!.beginPath();
          ctx!.arc(x, y, 3, 0, 6.28);
          ctx!.fill();
        }
        net.nodes.forEach((n) => {
          ctx!.fillStyle = '#111';
          ctx!.strokeStyle = BLOOD;
          ctx!.lineWidth = 1.5;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, 8, 0, 6.28);
          ctx!.fill();
          ctx!.stroke();
        });
        if (readout) readout.innerHTML = `forward pass <b style="color:${GLOW}">active</b>`;
      }
    }

    let raf = 0;
    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }
    if (reduce) {
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      fit();
      init();
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [algo, reduce]);

  const badge = ALGOS.find((a) => a.id === algo)?.badge ?? '';

  return (
    <section className="max-w-6xl mx-auto px-6 pt-4 pb-2">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="font-display text-xl font-bold text-blood tabular-nums">01</span>
        <h2 className="font-display text-xl md:text-2xl font-bold text-fg tracking-tight">
          Featured algorithm
        </h2>
        <span className="hidden sm:inline text-[11px] font-medium text-fg/40 tracking-wide">
          — running live
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {ALGOS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAlgo(a.id)}
            className={`text-xs font-medium px-3.5 py-2 rounded-full border transition-colors ${
              algo === a.id
                ? 'bg-blood border-blood text-white'
                : 'bg-void-800/50 border-void-600 text-fg/60 hover:text-fg hover:border-void-500'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="relative rounded-2xl border border-white/10 overflow-hidden bg-[#0b0b0b]">
        <span className="absolute top-3.5 left-3.5 z-10 text-[10px] font-mono uppercase tracking-[0.14em] text-white/40 border border-white/10 rounded-md px-2.5 py-1.5 bg-black/50 backdrop-blur-sm">
          {badge}
        </span>
        <div
          ref={readoutRef}
          className="absolute top-3.5 right-3.5 z-10 text-xs font-mono text-white/60 border border-white/10 rounded-lg px-3 py-2 bg-black/50 backdrop-blur-sm text-right [&_b]:text-white"
        />
        <canvas ref={canvasRef} className="block w-full h-[300px] md:h-[360px]" aria-hidden />
      </div>
    </section>
  );
}
