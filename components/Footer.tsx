'use client';

import SocialLinks from '@/components/SocialLinks';

export default function Footer() {
  return (
    <footer className="border-t border-void-600 bg-void-900/50 overflow-hidden">
      {/* signature: kinetic marquee */}
      <div className="marquee-mask border-b border-void-600 py-8 overflow-hidden">
        <div className="marquee-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-5xl md:text-7xl font-bold tracking-tight text-fg/[0.07] flex items-center gap-7 pr-7"
            >
              LET&apos;S BUILD <span className="text-blood">—</span> ASHURA <span className="text-blood">—</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-fg/60">© {new Date().getFullYear()} Vesurathan · ASHURA</p>
          <div className="flex items-center gap-6">
            <SocialLinks />
            <a
              href="#hero"
              data-cursor
              aria-label="Back to top"
              className="group inline-flex items-center gap-2 text-sm text-fg/70 hover:text-blood transition-colors"
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">↑</span>
              Top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
