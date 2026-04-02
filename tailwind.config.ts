import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blood: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          DEFAULT: '#c41e3a',
          glow: '#ff1744',
        },
        void: {
          950: '#0a0a0a',
          900: '#0d0d0d',
          800: '#121212',
          700: '#1a1a1a',
          600: '#222222',
          500: '#2a2a2a',
          DEFAULT: '#0a0a0a',
        },
      },
      fontFamily: {
        display: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        body: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.85', filter: 'brightness(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(to right, rgba(196, 30, 58, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(196, 30, 58, 0.03) 1px, transparent 1px)`,
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
      boxShadow: {
        'blood-glow': '0 0 40px -8px rgba(196, 30, 58, 0.5)',
        'blood-glow-sm': '0 0 20px -4px rgba(196, 30, 58, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
