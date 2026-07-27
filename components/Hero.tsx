'use client';

import { motion } from 'framer-motion';
import PlasmaBackground from '@/components/fx/PlasmaBackground';
import ScrambleText from '@/components/fx/ScrambleText';
import Magnetic from '@/components/fx/Magnetic';

/** One word, revealed letter-by-letter from behind a mask. */
function KineticWord({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <span className="inline-block">
        {text.split('').map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: delay + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#090909]"
    >
      {/* signature: WebGL plasma */}
      <PlasmaBackground className="absolute inset-0 w-full h-full z-0 opacity-90" />
      <div className="absolute inset-0 z-[1] bg-grid opacity-40" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent,rgba(9,9,9,0.55)_100%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <p className="text-blood font-medium text-sm uppercase tracking-[0.3em] mb-4">
          <ScrambleText text="AI · Data Engineering · Big Data · Computer Vision" />
        </p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
          <KineticWord text="Data." delay={0.1} />
          <span className="block overflow-hidden">
            <motion.span
              className="block gradient-text"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              Models.
            </motion.span>
          </span>
          <KineticWord text="Vision." delay={0.6} />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95 }}
          className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10"
        >
          Building intelligent systems—from pipelines and analytics to ML models and computer vision.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Magnetic strength={0.35}>
            <a
              href="#projects"
              data-cursor
              className="inline-block px-8 py-4 bg-blood text-white font-semibold rounded-sm hover:bg-blood-600 transition-colors shadow-blood-glow-sm hover:shadow-blood-glow"
            >
              View Work
            </a>
          </Magnetic>
          <Magnetic strength={0.35}>
            <a
              href="#contact"
              data-cursor
              className="inline-block px-8 py-4 border border-white/20 text-white font-semibold rounded-sm hover:border-blood hover:text-blood transition-colors"
            >
              Get in Touch
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a href="#about" className="block text-white/50 hover:text-blood transition-colors" aria-label="Scroll to about">
          <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
