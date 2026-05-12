'use client';

import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-void relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-blood font-display text-2xl font-bold">05</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-fg">
            Contact
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-blood/50 to-transparent max-w-[200px]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <p className="text-fg/80 text-lg mb-10">
            Have a project in mind or want to collaborate? Drop a line.
          </p>
          <a
            href="mailto:vesurathan@gmail.com"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blood text-white font-semibold rounded-sm hover:bg-blood-600 transition-colors shadow-blood-glow-sm hover:shadow-blood-glow"
          >
            vesurathan@gmail.com
            <span className="text-white/80">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
