'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A blood-glow ring that follows the pointer and expands over interactive
 * elements. Only enabled on fine-pointer, motion-allowing devices; falls back
 * to the native cursor everywhere else.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.body.classList.add('cursor-none');

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const interactive = t?.closest('a, button, [data-cursor], input, textarea, select');
      ringRef.current?.classList.toggle('cursor-big', !!interactive);
    };
    const leave = () => {
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('mouseover', over);
    document.addEventListener('mouseleave', leave);

    const loop = () => {
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      if (ringRef.current) ringRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('mouseover', over);
      document.removeEventListener('mouseleave', leave);
      document.body.classList.remove('cursor-none');
    };
  }, []);

  if (!enabled) return null;
  return <div ref={ringRef} className="cursor-ring" aria-hidden />;
}
