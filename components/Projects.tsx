'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { projects, CATEGORY_META, type Project, type ProjectCategory } from '@/lib/projects';

type Filter = 'all' | ProjectCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'research', label: 'Research' },
  { id: 'web', label: 'Websites' },
  { id: 'app', label: 'Applications' },
  { id: 'company', label: 'Company' },
];

function LinkIcon({ type }: { type: 'live' | 'code' | 'demo' | 'paper' }) {
  const cls = 'w-3.5 h-3.5';
  if (type === 'code')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 3 4 3m8-6l4 3-4 3M14 5l-4 14" />
      </svg>
    );
  if (type === 'paper')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z M15 3v5h5 M8 13h8 M8 17h5" />
      </svg>
    );
  // live / demo → external arrow
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5 M19 5l-8 8 M19 13v5a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h5" />
    </svg>
  );
}

function ProjectImage({ src, alt, title }: { src: string; alt: string; title: string }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className="absolute inset-0 bg-void-700 flex items-center justify-center">
        <span className="text-fg/20 font-display text-3xl tracking-widest">{title.split(' ')[0]}</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      sizes="(max-width: 768px) 100vw, 45vw"
      unoptimized
      onError={() => setError(true)}
    />
  );
}

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const meta = CATEGORY_META[project.category];

  function move(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <div
        ref={ref}
        onMouseMove={move}
        className="group relative h-full flex flex-col overflow-hidden bg-void-800/30 border border-void-600 rounded-lg hover:border-blood/40 transition-colors duration-300 hover:shadow-blood-glow-sm"
      >
        <div
          className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'radial-gradient(340px circle at var(--mx,50%) var(--my,50%), rgba(255,23,68,0.1), transparent 60%)' }}
        />

        {/* image */}
        <Link href={`/projects/${project.slug}/`} data-cursor className="relative block aspect-[16/10] overflow-hidden shrink-0">
          <ProjectImage src={project.image} alt={project.title} title={project.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-void-900/70 via-transparent to-transparent" />
          <span className={`absolute top-3 left-3 z-10 inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-sm ${meta.badge}`}>
            {meta.label}
          </span>
        </Link>

        {/* body */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-xl font-bold text-fg group-hover:text-blood transition-colors mb-2">
            <Link href={`/projects/${project.slug}/`} data-cursor>{project.title}</Link>
          </h3>
          <p className="text-sm text-fg/65 leading-relaxed mb-4 line-clamp-3">{project.shortDescription}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-[11px] font-medium bg-void-600 text-fg/75 rounded border border-void-500">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-void-600/60">
            <div className="flex items-center gap-3">
              {project.links?.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  data-cursor
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-fg/60 hover:text-blood transition-colors"
                >
                  <LinkIcon type={l.type} />
                  {l.label}
                </a>
              ))}
            </div>
            <Link
              href={`/projects/${project.slug}/`}
              data-cursor
              className="inline-flex items-center gap-1.5 text-blood text-sm font-medium group-hover:gap-2.5 transition-all shrink-0"
            >
              View <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, []);

  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-24 md:py-32 bg-void-900/30 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="text-blood font-display text-2xl font-bold">03</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-fg">Projects</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-blood/50 to-transparent max-w-[200px]" />
        </motion.div>

        {/* filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {FILTERS.map((f) => {
            const n = counts[f.id] ?? 0;
            if (f.id !== 'all' && n === 0) return null;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                data-cursor
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  filter === f.id
                    ? 'bg-blood border-blood text-white'
                    : 'bg-void-800/40 border-void-600 text-fg/65 hover:text-fg hover:border-void-500'
                }`}
              >
                {f.label}
                <span className={`text-xs tabular-nums ${filter === f.id ? 'text-white/70' : 'text-fg/35'}`}>{n}</span>
              </button>
            );
          })}
        </motion.div>

        {/* grid */}
        <motion.div layout className="grid sm:grid-cols-2 gap-6 md:gap-7">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
