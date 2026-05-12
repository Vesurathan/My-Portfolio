'use client';

import { motion } from 'framer-motion';

const SOCIAL_LINKS = [
  { href: 'https://github.com', label: 'GitHub' },
  { href: 'https://linkedin.com', label: 'LinkedIn' },
  { href: 'https://twitter.com', label: 'Twitter' },
];

export default function Footer() {
  return (
    <footer className="border-t border-void-600 bg-void-900/50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-fg/60"
          >
            © {new Date().getFullYear()} Ashura Corps
          </motion.p>
          <div className="flex gap-8">
            {SOCIAL_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="text-sm text-fg/70 hover:text-blood transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
