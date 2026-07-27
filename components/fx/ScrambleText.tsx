'use client';

import { useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHKLMNPRSTUVXYZ0123456789#/·';

/** Decrypt/scramble text — runs on mount or when scrolled into view. */
export default function ScrambleText({
  text,
  className,
  trigger = 'mount',
}: {
  text: string;
  className?: string;
  trigger?: 'mount' | 'inview';
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = text;
      return;
    }

    let fr = 0;
    let id = 0;
    const run = () => {
      id = window.setInterval(() => {
        let out = '';
        for (let i = 0; i < text.length; i++) {
          const c = text[i];
          out += c === ' ' || c === '·' || c === '.' ? c : i < fr / 2 ? c : CHARS[(Math.random() * CHARS.length) | 0];
        }
        el.textContent = out;
        fr++;
        if (fr / 2 > text.length) {
          clearInterval(id);
          el.textContent = text;
        }
      }, 28);
    };

    if (trigger === 'inview') {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      });
      io.observe(el);
      return () => {
        io.disconnect();
        clearInterval(id);
      };
    }

    run();
    return () => clearInterval(id);
  }, [text, trigger]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
