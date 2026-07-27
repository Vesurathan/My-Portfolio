'use client';

import { useRef } from 'react';

/** Wrap an element to make it lean toward the cursor, then spring back. */
export default function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  function move(e: React.MouseEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  }
  function leave() {
    const el = ref.current;
    if (el) el.style.transform = '';
  }

  return (
    <span
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`inline-block transition-transform duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] will-change-transform ${className ?? ''}`}
    >
      {children}
    </span>
  );
}
