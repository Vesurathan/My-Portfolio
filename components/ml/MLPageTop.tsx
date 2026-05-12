'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MLPageTop() {
  return (
    <div className="border-b border-void-600 bg-void-900/60 sticky top-[4.5rem] z-[90] backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          href="/#hero"
          className="inline-flex items-center gap-2 text-sm font-medium text-fg/70 hover:text-blood transition-colors"
        >
          <motion.span aria-hidden animate={{ x: [0, -3, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}>
            ←
          </motion.span>
          Home
        </Link>
        <div className="flex items-center gap-2" aria-hidden>
          {[
            { className: 'bg-blood/75' },
            { className: 'bg-fg/30' },
            { className: 'bg-blood-glow/75' },
          ].map((dot, i) => (
            <motion.span
              key={i}
              className={`w-2 h-2 rounded-full ${dot.className}`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.45, 1, 0.45],
              }}
              transition={{
                duration: 2.4 + i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.18,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
