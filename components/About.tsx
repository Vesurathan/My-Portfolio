'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// NOTE: grounded in known context — please correct any specifics (name, degree,
// university, location) that aren't right; they were inferred, not confirmed.
const LEAD = "I'm Vesurathan — I build systems that see, learn, and scale.";

const BIO = [
  "An AI & computer-vision engineer with a foundation in data engineering and big-data analytics. I like the full arc of a problem: pulling raw, messy data through pipelines, training models that understand it, and shipping something that actually works end to end.",
  "Right now I'm completing an MSc in Artificial Intelligence & Machine Learning at the University of East London. My dissertation goes beyond classification — it's an agentic, retrieval-grounded advisor that detects plant diseases from leaf images and recommends confidence-gated treatments, so the model doesn't just predict, it reasons about what to do next.",
];

const FACTS = [
  { k: 'Role', v: 'AI / Computer Vision Engineer' },
  { k: 'Currently', v: 'MSc AI & ML — University of East London' },
  { k: 'Focus', v: 'Computer Vision · Data Engineering · Big Data' },
  { k: 'Open to', v: 'Roles & research collaboration' },
];

const CHECKS = [
  'Machine learning & deep learning',
  'Data pipelines & ETL (Spark, Hadoop, Airflow)',
  'Computer vision & image understanding',
  'LLM agents & retrieval-augmented systems',
];

function MaskLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const BRACKETS = [
  'top-3 left-3 border-t-2 border-l-2',
  'top-3 right-3 border-t-2 border-r-2',
  'bottom-3 left-3 border-b-2 border-l-2',
  'bottom-3 right-3 border-b-2 border-r-2',
];

/** Portrait with a CV-flavoured treatment: cursor tilt, scan line, focus
 *  brackets, ambient glow — on top of the reveal wipe. */
function Portrait() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  function move(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(py - 0.5) * -8}deg`);
    el.style.setProperty('--ry', `${(px - 0.5) * 10}deg`);
  }
  function leave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }

  return (
    <div className="relative [perspective:1000px]" onMouseMove={move} onMouseLeave={leave}>
      {/* ambient glow */}
      <motion.div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-full bg-blood/20 blur-3xl"
        animate={reduce ? undefined : { opacity: [0.4, 0.7, 0.4], scale: [0.96, 1.04, 0.96] }}
        transition={reduce ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* offset frame */}
      <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-blood/30 rounded-sm -z-10" aria-hidden />

      <div
        ref={ref}
        className="relative aspect-[4/5] bg-void-700 border border-void-600 rounded-sm overflow-hidden flex items-center justify-center [transform-style:preserve-3d] transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: 'rotateX(var(--rx,0)) rotateY(var(--ry,0))' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blood/20 to-transparent" />
        <span className="relative font-display text-7xl font-bold tracking-widest text-fg/25 select-none">V</span>

        {/* scan line */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blood-glow to-transparent"
            style={{ boxShadow: '0 0 14px #ff1744' }}
            initial={{ top: '0%', opacity: 0 }}
            animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut', times: [0, 0.1, 0.9, 1] }}
          />
        )}

        {/* focus brackets */}
        {BRACKETS.map((c, i) => (
          <motion.span
            key={i}
            aria-hidden
            className={`absolute w-6 h-6 border-blood ${c}`}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        {/* reveal wipe */}
        <motion.div
          className="absolute inset-0 bg-blood origin-left"
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute inset-0 bg-void origin-right"
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

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
          <h2 className="font-display text-4xl md:text-5xl font-bold text-fg">About</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-blood/50 to-transparent max-w-[200px]" />
        </motion.div>

        <div className="grid md:grid-cols-5 gap-12 md:gap-16 items-start">
          {/* signature: CV-flavoured animated portrait */}
          <div className="relative md:col-span-2">
            <Portrait />

            {/* quick facts */}
            <dl className="mt-8 space-y-3">
              {FACTS.map((f, i) => (
                <motion.div
                  key={f.k}
                  className="flex flex-col border-l-2 border-blood/40 pl-3"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <dt className="text-[10px] font-mono uppercase tracking-[0.22em] text-fg/40">{f.k}</dt>
                  <dd className="text-sm text-fg/85 font-medium">{f.v}</dd>
                </motion.div>
              ))}
            </dl>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-fg mb-6 leading-tight">
              <MaskLine>{LEAD}</MaskLine>
            </h3>

            <div className="space-y-5">
              {BIO.map((p, i) => (
                <motion.p
                  key={i}
                  className="text-fg/75 text-lg leading-relaxed"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* signature: self-drawing connector down the checklist */}
            <motion.ul
              className="relative pl-1 mt-8"
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, margin: '-60px' }}
            >
              <motion.span
                aria-hidden
                className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-blood to-transparent origin-top"
                variants={{ hidden: { scaleY: 0 }, shown: { scaleY: 1 } }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              />
              {CHECKS.map((item, i) => (
                <motion.li
                  key={item}
                  className="relative flex items-center gap-4 py-2 text-fg/90"
                  variants={{ hidden: { opacity: 0, x: -10 }, shown: { opacity: 1, x: 0 } }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="w-2.5 h-2.5 bg-blood rounded-full shrink-0 shadow-blood-glow-sm" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
