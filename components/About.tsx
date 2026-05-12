'use client';

import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-void-900/30 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-blood font-display text-2xl font-bold">01</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-fg">
            About
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-blood/50 to-transparent max-w-[200px]" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] bg-void-700 border border-void-600 rounded-sm overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blood/20 to-transparent" />
              <span className="relative text-fg/20 font-display text-6xl tracking-widest">YOU</span>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-blood/30 rounded-sm -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-fg/80 text-lg leading-relaxed mb-6">
              I focus on AI, data engineering, big data analytics, and computer vision—turning
              raw data into models and systems that see, learn, and scale.
            </p>
            <p className="text-fg/80 text-lg leading-relaxed mb-8">
              From ETL pipelines and distributed processing to deep learning and image understanding,
              I&apos;m building the skills to design and deploy data-driven solutions end to end.
            </p>
            <ul className="space-y-3">
              {['Machine learning & deep learning', 'Data pipelines & ETL', 'Big data (Spark, Hadoop)', 'Computer vision & image analysis'].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-3 text-fg/90"
                >
                  <span className="w-2 h-2 bg-blood rounded-full shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
