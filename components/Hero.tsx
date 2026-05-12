'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid bg-void"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blood/5 via-transparent to-void" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blood/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blood/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-blood font-medium text-sm uppercase tracking-[0.3em] mb-4"
        >
          AI · Data Engineering · Big Data · Computer Vision
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-fg mb-6"
        >
          <span className="block">Data.</span>
          <span className="gradient-text">Models.</span>
          <span className="block">Vision.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg sm:text-xl text-fg/70 max-w-2xl mx-auto mb-10"
        >
          Building intelligent systems—from pipelines and analytics to ML models and computer vision.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#projects"
            className="px-8 py-4 bg-blood text-white font-semibold rounded-sm hover:bg-blood-600 transition-colors shadow-blood-glow-sm hover:shadow-blood-glow"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="px-8 py-4 border border-white/20 text-fg font-semibold rounded-sm hover:border-blood hover:text-blood transition-colors"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="block text-fg/50 hover:text-blood transition-colors" aria-label="Scroll to about">
          <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
