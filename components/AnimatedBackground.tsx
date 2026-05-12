'use client';

import { useEffect, useRef, useState } from 'react';

type OrbPos = { x: number; y: number; vx: number; vy: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Spring physics constants for realistic fluid mass and damping */
const SPRING_TENSION = [0.035, 0.05] as const;
const SPRING_FRICTION = [0.82, 0.78] as const;

/** Smoothed pointer speed limiters */
const IDLE_BLEND_LOW = 2.5;
const IDLE_BLEND_HIGH = 26;

export default function AnimatedBackground() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const orbs = useRef<OrbPos[]>([
    { x: 0, y: 0, vx: 0, vy: 0 },
    { x: 0, y: 0, vx: 0, vy: 0 },
  ]);
  const ptrSmoothed = useRef(0);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([null, null]);
  const stretch = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReduce = () => setReduceMotion(mq.matches);
    syncReduce();
    mq.addEventListener('change', syncReduce);
    return () => mq.removeEventListener('change', syncReduce);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mouse.current = { x: cx, y: cy };
    prevMouse.current = { x: cx, y: cy };
    orbs.current[0] = { x: cx, y: cy, vx: 0, vy: 0 };
    orbs.current[1] = { x: cx, y: cy, vx: 0, vy: 0 };
    ptrSmoothed.current = 0;
    stretch.current = 0;
    setReady(true);

    const onPointer = (e: PointerEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });

    let rafId = 0;
    const tick = () => {
      const tx = mouse.current.x;
      const ty = mouse.current.y;
      const pm = prevMouse.current;
      const dmx = tx - pm.x;
      const dmy = ty - pm.y;
      const ptrSpd = Math.hypot(dmx, dmy);
      prevMouse.current = { x: tx, y: ty };

      ptrSmoothed.current = lerp(ptrSmoothed.current, ptrSpd, 0.16);
      const idleMag =
        1 - smoothstep(IDLE_BLEND_LOW, IDLE_BLEND_HIGH, ptrSmoothed.current);

      const flick = Math.min(ptrSpd * 0.0058, 0.32);
      stretch.current = lerp(stretch.current, flick, 0.28);
      stretch.current *= 0.88;

      const t = performance.now() * 0.001;

      orbs.current.forEach((o, i) => {
        const tension = SPRING_TENSION[i];
        const friction = SPRING_FRICTION[i];
        
        o.vx = (o.vx + (tx - o.x) * tension) * friction;
        o.vy = (o.vy + (ty - o.y) * tension) * friction;
        o.x += o.vx;
        o.y += o.vy;

        const phase = i * 1.7;
        const idleX =
          idleMag *
          (Math.sin(t * 0.092 + phase) * 14 +
            Math.sin(t * 0.055 + 0.35) * 7 +
            Math.cos(t * 0.042 + phase * 0.5) * 4.5);
        const idleY =
          idleMag *
          (Math.cos(t * 0.086 + phase * 0.82) * 12 +
            Math.cos(t * 0.052 + 0.2) * 6 +
            Math.sin(t * 0.045 + 1.1) * Math.cos(t * 0.038 + phase) * 4);
        const rx = o.x + idleX;
        const ry = o.y + idleY;

        const sm = stretch.current * (i === 0 ? 0.55 : 1);
        const pulse = 1 + sm * 0.16;
        const shapeMag = 0.14 + 0.86 * idleMag;
        const q = Math.sin(t * 0.34 + phase);
        const rad = 0.024 * Math.sin(t * 0.26 + phase * 0.9);
        const sag = 0.012 * Math.sin(t * 0.18 + phase * 0.55);
        const sx = pulse * (1 + shapeMag * (rad + 0.036 * q + sag));
        const sy = pulse * (1 + shapeMag * (rad - 0.032 * q - sag * 0.75));

        const el = wrapRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${rx}px,${ry}px,0) scale(${sx},${sy})`;
        }
      });

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.4]">
           <div className="absolute rounded-full bg-blood-glow mix-blend-screen filter blur-[50px] w-[200px] h-[200px] -left-[100px] -top-[100px] opacity-60" />
        </div>
      </div>
    );
  }

  const baseBlobClasses = "absolute rounded-full filter mix-blend-screen will-change-transform";

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      {/* Background ambient vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_88%_72%_at_50%_44%,transparent_0%,rgba(10,10,10,0.65)_100%)]" aria-hidden />

      <div className="absolute inset-0">
        {/* Layer 0 (Heavier, trailing background fluid) */}
        <div
          ref={(el) => { wrapRefs.current[0] = el; }}
          className="absolute left-0 top-0 will-change-transform opacity-0 transition-opacity duration-1000"
          style={{ opacity: ready ? 0.6 : 0 }}
        >
          {/* Deep red blobs */}
          <div className={`${baseBlobClasses} bg-blood-800 blur-[60px] w-[300px] h-[250px] -left-[150px] -top-[125px] animate-orb-orbit-slow`} />
          <div className={`${baseBlobClasses} bg-blood-700 blur-[45px] w-[250px] h-[250px] -left-[125px] -top-[125px] animate-orb-drift-1`} />
          <div className={`${baseBlobClasses} bg-blood-900 blur-[70px] w-[250px] h-[300px] -left-[125px] -top-[150px] animate-orb-drift-3`} />
        </div>

        {/* Layer 1 (Lighter, glowing fluid mesh) */}
        <div
          ref={(el) => { wrapRefs.current[1] = el; }}
          className="absolute left-0 top-0 will-change-transform opacity-0 transition-opacity duration-1000"
          style={{ opacity: ready ? 0.7 : 0 }}
        >
          {/* Neon/Glowing red blobs */}
          <div className={`${baseBlobClasses} bg-blood-glow blur-[40px] w-[180px] h-[180px] -left-[90px] -top-[90px] animate-orb-orbit-fast`} />
          <div className={`${baseBlobClasses} bg-blood blur-[50px] w-[200px] h-[150px] -left-[100px] -top-[75px] animate-orb-drift-2`} />
          <div className={`${baseBlobClasses} bg-blood-500 blur-[35px] w-[130px] h-[130px] -left-[65px] -top-[65px] animate-orb-luminate`} />
        </div>
      </div>
    </div>
  );
}
