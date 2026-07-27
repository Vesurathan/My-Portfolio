'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const BLOOD = '#c41e3a';
const GLOW = '#ff1744';

type Family = { name: string; col: string; kids: string[] };

const FAMILIES: Family[] = [
  {
    name: 'Supervised',
    col: BLOOD,
    kids: ['Linear Reg', 'Logistic', 'SVM', 'KNN', 'Decision Tree', 'Random Forest', 'Boosting', 'MLP'],
  },
  { name: 'Unsupervised', col: '#c9c9c9', kids: ['K-Means', 'DBSCAN', 'PCA', 't-SNE', 'GMM', 'Hierarchical'] },
  { name: 'Reinforcement', col: GLOW, kids: ['Q-Learning', 'SARSA', 'DQN', 'PPO', 'Actor-Critic'] },
];

type Node = {
  name: string;
  col: string;
  x: number;
  y: number;
  hx: number;
  hy: number;
  r: number;
  lvl: number;
  parent: Node | null;
  ph: number;
};

/** Concept 02 — the 3 ML families as a living, explorable node-graph. */
export default function TaxonomyConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const readoutRef = useRef<HTMLDivElement | null>(null);
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
    let nodes: Node[] = [];
    let mx = -999;
    let my = -999;

    function build() {
      w = cv!.clientWidth;
      h = cv!.clientHeight;
      cv!.width = w * dpr;
      cv!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = [];
      const cx = w / 2;
      const cy = h / 2;
      const root: Node = { name: 'Machine Learning', col: '#fff', x: cx, y: cy, hx: cx, hy: cy, r: 9, lvl: 0, parent: null, ph: 0 };
      nodes.push(root);
      const groups = FAMILIES.length;
      FAMILIES.forEach((g, gi) => {
        const ang = ((-90 + gi * (360 / groups)) * Math.PI) / 180;
        const gr = Math.min(w, h) * 0.24;
        const gx = cx + Math.cos(ang) * gr;
        const gy = cy + Math.sin(ang) * gr;
        const gn: Node = { name: g.name, col: g.col, x: gx, y: gy, hx: gx, hy: gy, r: 6.5, lvl: 1, parent: root, ph: 0 };
        nodes.push(gn);
        g.kids.forEach((k, ki) => {
          const spread = 1.5;
          const a2 = ang + (ki - (g.kids.length - 1) / 2) * (spread / g.kids.length);
          const kr = Math.min(w, h) * 0.24 + 64 + (ki % 2) * 22;
          const kx = cx + Math.cos(a2) * kr;
          const ky = cy + Math.sin(a2) * kr;
          nodes.push({ name: k, col: g.col, x: kx, y: ky, hx: kx, hy: ky, r: 3.4, lvl: 2, parent: gn, ph: Math.random() * 6.28 });
        });
      });
    }
    build();

    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => {
      mx = my = -999;
    };
    cv.addEventListener('mousemove', onMove);
    cv.addEventListener('mouseleave', onLeave);

    let t = 0;
    function draw() {
      t += 0.01;
      ctx!.clearRect(0, 0, w, h);

      let hover: Node | null = null;
      let hd = 22;
      for (const n of nodes) {
        const d = Math.hypot(n.x - mx, n.y - my);
        if (d < hd) {
          hd = d;
          hover = n;
        }
      }
      const active = new Set<Node>();
      if (hover) {
        let c: Node | null = hover;
        while (c) {
          active.add(c);
          c = c.parent;
        }
        nodes.forEach((n) => {
          if (n.parent && active.has(n.parent)) active.add(n);
        });
      }

      nodes.forEach((n) => {
        if (n.lvl === 2) {
          n.x = n.hx + Math.sin(t + n.ph) * 4;
          n.y = n.hy + Math.cos(t * 0.9 + n.ph) * 4;
        }
      });

      nodes.forEach((n) => {
        if (!n.parent) return;
        const on = !!hover && active.has(n) && active.has(n.parent);
        ctx!.strokeStyle = on ? 'rgba(255,23,68,0.55)' : 'rgba(196,30,58,0.10)';
        ctx!.lineWidth = on ? 1.6 : 1;
        ctx!.beginPath();
        ctx!.moveTo(n.parent.x, n.parent.y);
        ctx!.lineTo(n.x, n.y);
        ctx!.stroke();
      });

      nodes.forEach((n) => {
        const on = !!hover && active.has(n);
        const dim = !!hover && !on;
        ctx!.globalAlpha = dim ? 0.28 : 1;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r * (on ? 1.3 : 1), 0, 6.28);
        ctx!.fillStyle = n.lvl === 0 ? '#fff' : n.col;
        ctx!.fill();
        if (n.lvl < 2) {
          ctx!.strokeStyle = n.col;
          ctx!.lineWidth = 1.4;
          ctx!.stroke();
        }
        if (on || n.lvl < 2) {
          ctx!.fillStyle = n.lvl === 0 ? '#fff' : dim ? '#666' : '#e6e6e6';
          ctx!.font = (n.lvl === 0 ? '700 13px ' : '600 ' + (n.lvl === 1 ? '12px ' : '10px ')) + 'ui-sans-serif,system-ui,sans-serif';
          ctx!.textAlign = 'center';
          ctx!.fillText(n.name, n.x, n.y - n.r - 6);
        }
        ctx!.globalAlpha = 1;
      });

      if (readout) {
        readout.innerHTML = hover
          ? `<b>${hover.name}</b><br><span style="color:${GLOW}">${
              hover.lvl === 0 ? 'root taxonomy' : hover.lvl === 1 ? 'family' : 'model'
            }</span>`
          : `<b>Machine Learning</b><br><span style="color:${GLOW}">30 models · 3 families</span>`;
      }
    }

    let raf = 0;
    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }
    if (reduce) draw();
    else raf = requestAnimationFrame(loop);

    const onResize = () => build();
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
        <span className="font-display text-xl font-bold text-blood tabular-nums">02</span>
        <h2 className="font-display text-xl md:text-2xl font-bold text-fg tracking-tight">
          Taxonomy constellation
        </h2>
      </div>
      <p className="text-sm text-fg/50 mb-5 max-w-xl">
        Every model, mapped by family. Hover a node to light up its branch.
      </p>
      <div className="relative rounded-2xl border border-white/10 overflow-hidden bg-[#0b0b0b]">
        <span className="absolute top-3.5 left-3.5 z-10 text-[10px] font-mono uppercase tracking-[0.14em] text-white/40 border border-white/10 rounded-md px-2.5 py-1.5 bg-black/50 backdrop-blur-sm">
          hover a node · it floats
        </span>
        <div
          ref={readoutRef}
          className="absolute top-3.5 right-3.5 z-10 text-xs font-mono text-white/60 border border-white/10 rounded-lg px-3 py-2 bg-black/50 backdrop-blur-sm text-right leading-relaxed [&_b]:text-white"
        />
        <canvas ref={canvasRef} className="block w-full h-[380px] md:h-[440px]" aria-hidden />
      </div>
    </section>
  );
}
