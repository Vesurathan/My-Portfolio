'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { projects } from '@/lib/projects';

type Project = (typeof projects)[number];

function ProjectImage({ src, alt, title }: { src: string; alt: string; title: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="absolute inset-0 bg-void-700 flex items-center justify-center border-r border-void-600">
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
      sizes="(max-width: 768px) 100vw, 42vw"
      unoptimized
      onError={() => setError(true)}
    />
  );
}

/** Signature: cursor spotlight + subtle 3D tilt on each project card. */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  function move(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--rx', `${(py - 0.5) * -3}deg`);
      el.style.setProperty('--ry', `${(px - 0.5) * 4}deg`);
    }
  }
  function leave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="[perspective:1200px]"
    >
      <Link
        ref={ref}
        href={`/projects/${project.slug}/`}
        onMouseMove={move}
        onMouseLeave={leave}
        data-cursor
        style={{ transform: 'rotateX(var(--rx,0)) rotateY(var(--ry,0))' }}
        className="group relative block overflow-hidden bg-void-800/30 border border-void-600 rounded-sm hover:border-blood/40 transition-[border-color,box-shadow,transform] duration-300 hover:shadow-blood-glow-sm will-change-transform"
      >
        {/* cursor spotlight */}
        <div
          className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(340px circle at var(--mx,50%) var(--my,50%), rgba(255,23,68,0.12), transparent 60%)',
          }}
        />
        <div className="flex flex-col md:flex-row min-h-0">
          <div className="relative w-full md:w-[42%] lg:w-[38%] aspect-[16/10] md:aspect-auto md:min-h-[240px] shrink-0 overflow-hidden">
            {project.image ? (
              <ProjectImage src={project.image} alt={project.title} title={project.title} />
            ) : (
              <div className="absolute inset-0 bg-void-700 flex items-center justify-center">
                <span className="text-fg/20 font-display text-4xl tracking-widest">Project</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-void-800/80 via-void-800/20 to-transparent md:from-transparent md:via-transparent md:to-transparent md:group-hover:from-void-800/40 transition-colors duration-300 pointer-events-none" />
          </div>
          <div className="flex flex-1 flex-col justify-center p-6 md:p-8 lg:p-10">
            <h3 className="font-display text-2xl font-bold text-fg group-hover:text-blood transition-colors mb-2">
              {project.title}
            </h3>
            <p className="text-fg/70 mb-4 max-w-2xl">{project.shortDescription}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-void-600 text-fg/80 rounded border border-void-500"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="mt-4 inline-flex items-center gap-2 text-blood text-sm font-medium group-hover:gap-3 transition-all">
              View project
              <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32 bg-void-900/30 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-blood font-display text-2xl font-bold">03</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-fg">Projects</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-blood/50 to-transparent max-w-[200px]" />
        </motion.div>

        <div className="space-y-10">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
