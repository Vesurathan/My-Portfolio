'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

const SKILL_GROUPS = [
  {
    title: 'AI & ML',
    tag: 'modelling',
    items: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'LLMs & NLP', 'Hugging Face'],
  },
  {
    title: 'Data Engineering & Big Data',
    tag: 'pipelines',
    items: ['Apache Spark', 'Hadoop', 'SQL', 'ETL / ELT', 'Airflow', 'Kafka'],
  },
  {
    title: 'Computer Vision',
    tag: 'perception',
    items: ['OpenCV', 'CNN / ViT', 'Object detection', 'Segmentation', 'Feature extraction', 'ONNX'],
  },
];

const MARQUEE = [
  'Python', 'PyTorch', 'TensorFlow', 'Spark', 'Kafka', 'OpenCV', 'Airflow',
  'SQL', 'Hadoop', 'CUDA', 'Docker', 'ONNX', 'Vision Transformers', 'RAG', 'Pandas',
];

const chipList = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
} as const;

const chip = {
  hidden: { opacity: 0, y: 12, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 480, damping: 26 } },
} as const;

function SkillCard({ group, groupIndex }: { group: (typeof SKILL_GROUPS)[number]; groupIndex: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  function move(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={move}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: groupIndex * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative p-8 bg-void-800/50 border border-void-600 rounded-sm hover:border-blood/40 transition-colors duration-300 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(240px circle at var(--mx,50%) var(--my,50%), rgba(255,23,68,0.14), transparent 60%)',
        }}
      />
      <div className="relative mb-6">
        <span className="block text-[10px] font-mono uppercase tracking-[0.25em] text-fg/35 mb-1">
          {String(groupIndex + 1).padStart(2, '0')} · {group.tag}
        </span>
        <h3 className="font-display text-xl font-bold text-blood">{group.title}</h3>
      </div>

      {/* signature: skills as cascading interactive chips — no percentages */}
      <motion.ul
        className="relative flex flex-wrap gap-2.5"
        variants={chipList}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        {group.items.map((skill) => (
          <motion.li
            key={skill}
            variants={chip}
            className="group/chip inline-flex items-center gap-2 rounded-lg border border-void-500 bg-void-700/40 px-3.5 py-2 text-sm font-medium text-fg/85 cursor-default transition-all duration-200 hover:-translate-y-0.5 hover:border-blood/60 hover:text-blood hover:bg-void-700/70 hover:shadow-blood-glow-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blood/50 transition-colors group-hover/chip:bg-blood" />
            {skill}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

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
          <h2 className="font-display text-4xl md:text-5xl font-bold text-fg">Skills</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-blood/50 to-transparent max-w-[200px]" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {SKILL_GROUPS.map((group, groupIndex) => (
            <SkillCard key={group.title} group={group} groupIndex={groupIndex} />
          ))}
        </div>
      </div>

      {/* kinetic tech marquee */}
      <div className="marquee-mask mt-16 border-y border-void-600 py-5 overflow-hidden">
        <div className="marquee-track gap-8">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="font-display text-2xl font-bold tracking-tight text-fg/25 flex items-center gap-8">
              {t}
              <span className="text-blood">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
