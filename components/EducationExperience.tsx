'use client';

import { motion } from 'framer-motion';

const EDUCATION = [
  {
    period: '2020 – 2024',
    title: 'B.Tech / M.Tech in Computer Science',
    org: 'University Name',
    description: 'Focus on AI, machine learning, and data systems.',
  },
  {
    period: '2018 – 2020',
    title: 'Higher Secondary',
    org: 'School Name',
    description: 'Science stream with emphasis on mathematics.',
  },
];

const EXPERIENCE = [
  {
    period: '2023 – Present',
    title: 'Data / ML Intern or Role',
    org: 'Company or Lab',
    description: 'Building pipelines and models for production.',
  },
  {
    period: '2022 – 2023',
    title: 'Research or Project Assistant',
    org: 'Institution',
    description: 'Work on computer vision and big data projects.',
  },
];

type NodeType = 'education' | 'experience';

const TREE_NODES: Array<
  {
    type: NodeType;
    period: string;
    title: string;
    org: string;
    description: string;
  }
> = [
  ...EDUCATION.map((e) => ({ ...e, type: 'education' as const })),
  ...EXPERIENCE.map((e) => ({ ...e, type: 'experience' as const })),
];

function TreeRow({
  period,
  title,
  org,
  description,
  type,
  index,
  isLast,
}: {
  period: string;
  title: string;
  org: string;
  description: string;
  type: NodeType;
  index: number;
  isLast: boolean;
}) {
  const isEducation = type === 'education';

  const card = (
    <div
      className={
        isEducation
          ? 'relative overflow-hidden rounded-xl border border-void-600 border-l-[3px] border-l-blood bg-void-900/60 transition-all duration-300 ease-out hover:border-blood/30 hover:bg-void-800/80 hover:shadow-[0_0_30px_-8px_rgba(196,30,58,0.15)] w-full'
          : 'relative overflow-hidden rounded-xl border border-void-600 border-r-[3px] border-r-blood-glow bg-void-900/60 transition-all duration-300 ease-out hover:border-blood/30 hover:bg-void-800/80 hover:shadow-[0_0_30px_-8px_rgba(196,30,58,0.15)] w-full'
      }
    >
      <div className="p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className={`
              text-[10px] font-bold uppercase tracking-[0.2em]
              ${isEducation ? 'text-blood' : 'text-blood-glow'}
            `}
          >
            {type === 'education' ? 'Education' : 'Experience'}
          </span>
          <span className="text-white/30">·</span>
          <span className="text-[11px] font-medium text-white/50 tracking-wide">
            {period}
          </span>
        </div>
        <h3 className="font-display text-base md:text-lg font-bold text-white leading-tight mb-1">
          {title}
        </h3>
        <p className="text-sm text-white/45 font-medium mb-2">{org}</p>
        <p className="text-sm text-white/65 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col md:flex-row items-stretch gap-4 md:gap-0 min-h-0"
    >
      {/* Left: Education card or spacer + branch line */}
      <div className="flex-1 hidden md:flex items-center justify-end min-w-0 order-1">
        {isEducation ? (
          <>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full max-w-[300px] lg:max-w-[340px] shrink-0"
            >
              {card}
            </motion.div>
            <div
              className="w-6 lg:w-8 h-px shrink-0 bg-gradient-to-r from-blood/40 to-blood/70"
              aria-hidden
            />
          </>
        ) : (
          <div className="w-full max-w-[300px] lg:max-w-[340px] shrink-0" />
        )}
      </div>

      {/* Center: Trunk + node */}
      <div className="flex flex-col items-center shrink-0 order-2 w-4 md:w-6 mx-auto md:mx-0">
        <div
          className="w-px flex-1 min-h-[14px] bg-gradient-to-b from-transparent via-blood/30 to-blood/50"
          aria-hidden
        />
        <div className="relative flex items-center justify-center shrink-0">
          <div
            className="absolute w-4 h-4 rounded-full bg-blood/20"
            aria-hidden
          />
          <div
            className={`
              w-2.5 h-2.5 rounded-full border-2 bg-void
              relative z-10
              ${isEducation ? 'border-blood' : 'border-blood-glow'}
              shadow-[0_0_12px_2px_rgba(196,30,58,0.25)]
            `}
          />
        </div>
        {!isLast ? (
          <div
            className="w-px flex-1 min-h-[14px] bg-gradient-to-b from-blood/50 via-blood/30 to-transparent"
            aria-hidden
          />
        ) : (
          <div className="flex-1 min-h-[14px]" />
        )}
      </div>

      {/* Mobile: card under node */}
      <div className="flex-1 md:hidden order-3 px-2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {card}
        </motion.div>
      </div>

      {/* Right: Experience card or spacer + branch line */}
      <div className="flex-1 hidden md:flex items-center justify-start min-w-0 order-3">
        {!isEducation ? (
          <>
            <div
              className="w-6 lg:w-8 h-px shrink-0 bg-gradient-to-l from-blood/40 to-blood/70"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full max-w-[300px] lg:max-w-[340px] shrink-0"
            >
              {card}
            </motion.div>
          </>
        ) : (
          <div className="w-full max-w-[300px] lg:max-w-[340px] shrink-0" />
        )}
      </div>
    </motion.div>
  );
}

export default function EducationExperience() {
  return (
    <section
      id="education-experience"
      className="min-h-screen flex flex-col justify-center py-14 md:py-20 bg-void relative overflow-hidden"
    >
      {/* Subtle background shape */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        aria-hidden
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-blood blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-8 w-full flex-1 flex flex-col min-h-0 justify-center relative">
        {/* Section header */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="mb-8 md:mb-10 shrink-0"
        >
          <p className="text-blood font-display text-sm font-bold tracking-[0.35em] uppercase mb-2">
            Journey
          </p>
          <div className="flex items-baseline gap-4">
            <span className="text-blood font-display text-2xl md:text-3xl font-bold tabular-nums">
              04
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-white tracking-tight">
              Education & Experience
            </h2>
          </div>
          <div className="mt-3 h-px w-16 bg-gradient-to-r from-blood/60 to-transparent" />
        </motion.header>

        {/* Tree container with subtle border */}
        <div className="relative rounded-2xl border border-void-600/80 bg-void-950/50 p-6 md:p-8 lg:p-10 backdrop-blur-sm">
          <div className="flex flex-col">
            {TREE_NODES.map((node, index) => (
              <TreeRow
                key={`${node.type}-${node.period}-${node.title}`}
                period={node.period}
                title={node.title}
                org={node.org}
                description={node.description}
                type={node.type}
                index={index}
                isLast={index === TREE_NODES.length - 1}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-void-600/60">
            <span className="flex items-center gap-2 text-xs font-medium text-white/50 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blood/80" />
              Education
            </span>
            <span className="flex items-center gap-2 text-xs font-medium text-white/50 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blood-glow/80" />
              Experience
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
