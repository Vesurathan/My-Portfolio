'use client';

import { motion } from 'framer-motion';

const SKILL_GROUPS = [
  {
    title: 'AI & ML',
    items: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'LLMs & NLP'],
  },
  {
    title: 'Data Engineering & Big Data',
    items: ['Apache Spark', 'Hadoop', 'SQL', 'ETL/ELT', 'Airflow', 'Kafka'],
  },
  {
    title: 'Computer Vision',
    items: ['OpenCV', 'CNN / Vision Transformers', 'Object detection', 'Image segmentation', 'Feature extraction'],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 bg-void relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-blood font-display text-2xl font-bold">02</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-fg">
            Skills
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-blood/50 to-transparent max-w-[200px]" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {SKILL_GROUPS.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIndex * 0.1 }}
              className="group relative p-8 bg-void-800/50 border border-void-600 rounded-sm hover:border-blood/30 transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-blood/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm" />
              <h3 className="font-display text-xl font-bold text-blood mb-6 relative">
                {group.title}
              </h3>
              <ul className="space-y-3 relative">
                {group.items.map((skill, i) => (
                  <motion.li
                    key={skill}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: groupIndex * 0.1 + i * 0.03 }}
                    className="text-fg/80 hover:text-fg transition-colors"
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
