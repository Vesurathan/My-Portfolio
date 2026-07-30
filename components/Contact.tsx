'use client';

import { motion } from 'framer-motion';
import FlowField from '@/components/fx/FlowField';
import Magnetic from '@/components/fx/Magnetic';
import SocialLinks from '@/components/SocialLinks';

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 md:py-40 bg-[#090909] overflow-hidden">
      {/* signature: flow-field particles */}
      <FlowField className="absolute inset-0 w-full h-full z-0 opacity-70" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,transparent,rgba(9,9,9,0.7)_100%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-blood font-display text-2xl font-bold">05</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Contact</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-blood/50 to-transparent max-w-[200px]" />
        </motion.div>

        <div className="max-w-2xl">
          <h3 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                Let&apos;s build something
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block gradient-text"
                initial={{ y: '110%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                that sees.
              </motion.span>
            </span>
          </h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="text-white/70 text-lg mb-10"
          >
            Have a project in mind or want to collaborate? Drop a line.
          </motion.p>
          <Magnetic strength={0.3}>
            <a
              href="mailto:vesurathan@gmail.com"
              data-cursor
              className="inline-flex items-center gap-3 px-8 py-4 bg-blood text-white font-semibold rounded-sm hover:bg-blood-600 transition-colors shadow-blood-glow-sm hover:shadow-blood-glow"
            >
              vesurathan@gmail.com
              <span className="text-white/80">→</span>
            </a>
          </Magnetic>

          <div className="mt-8 flex items-center gap-4 flex-wrap">
            <span className="text-white/40 text-sm">or find me on</span>
            <SocialLinks light />
          </div>
        </div>
      </div>
    </section>
  );
}
