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
        brand: {
          black: '#000000',
          dark: '#080808',
          card: '#080808',
          accent: '#dc2626',
          'accent-hover': '#ef4444',
          border: 'rgba(255, 255, 255, 0.1)',
        },
      },
      fontFamily: {
        heading: ['var(--font-bebas)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(220, 38, 38, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(220, 38, 38, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
