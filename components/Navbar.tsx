'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

/** Hash links must be root-relative so they work from /ml/, /projects/*, etc. */
const NAV_LINKS = [
  { href: '/#hero', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#projects', label: 'Projects' },
  { href: '/ml/', label: 'ML Models' },
  { href: '/#education-experience', label: 'Education & Experience' },
  { href: '/#contact', label: 'Contact' },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMounted(true), []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? 'bg-void/95 backdrop-blur-md border-b border-void-600' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between min-h-[4.5rem]">
        <Link
          href="/#hero"
          className="font-display text-xl font-bold tracking-tight text-fg hover:text-blood transition-colors"
        >
          ASHURA
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link
                  href={link.href}
                  className="text-sm font-medium text-fg/80 hover:text-blood glow-line py-2"
                >
                  {link.label}
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle theme"
            className="p-2 rounded-md border border-void-600 bg-void-900/40 text-fg/80 hover:text-blood hover:border-blood/30 transition-colors"
            onClick={() => {
              if (!mounted) return;
              setTheme(theme === 'light' ? 'dark' : 'light');
            }}
          >
            <span className="sr-only">Toggle theme</span>
            {mounted && theme === 'light' ? (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m0-11.314L7.05 7.05m9.9 9.9 1.414 1.414M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                />
              </svg>
            )}
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden p-2 text-fg/90 hover:text-blood"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-void-900 border-t border-void-600 max-h-[min(70vh,calc(100dvh-4.5rem))] overflow-y-auto"
          >
            <ul className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block text-fg/80 hover:text-blood py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="w-full text-left text-fg/80 hover:text-blood py-2"
                  onClick={() => {
                    setMobileOpen(false);
                    if (!mounted) return;
                    setTheme(theme === 'light' ? 'dark' : 'light');
                  }}
                >
                  Theme: {mounted ? (theme === 'light' ? 'Light' : 'Dark') : '…'}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
