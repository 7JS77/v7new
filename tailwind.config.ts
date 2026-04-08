import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C8A96E',
          light: '#E2C99A',
          dark: '#8B7040',
          xsubtle: 'rgba(200,169,110,0.07)',
          subtle: 'rgba(200,169,110,0.12)',
          muted: 'rgba(200,169,110,0.25)',
        },
        ink: {
          DEFAULT: '#0A0B0D',
          2: '#111318',
          3: '#181C22',
          4: '#1E2330',
          5: '#252B38',
        },
        text: {
          primary: '#E8E4DC',
          secondary: '#9B9689',
          tertiary: '#5C5A55',
          muted: '#3E3C39',
        },
        success: {
          DEFAULT: '#3DAA72',
          bg: 'rgba(61,170,114,0.12)',
        },
        error: {
          DEFAULT: '#C05050',
          bg: 'rgba(192,80,80,0.12)',
        },
        warning: {
          DEFAULT: '#E8A830',
          bg: 'rgba(232,168,48,0.08)',
        },
        info: '#5A9BC8',
        border: {
          DEFAULT: 'rgba(200,169,110,0.13)',
          subtle: 'rgba(255,255,255,0.06)',
          muted: 'rgba(255,255,255,0.08)',
          emphasis: 'rgba(200,169,110,0.3)',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'Times New Roman', 'serif'],
        body: ['var(--font-syne)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': '0.64rem',
        'sm': '0.8rem',
        'base': '1rem',
        'lg': '1.25rem',
        'xl': '1.563rem',
        '2xl': '1.953rem',
        '3xl': '2.441rem',
        '4xl': '3.052rem',
        '5xl': '3.815rem',
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(200,169,110,0.15)',
        'glow-gold-strong': '0 0 30px rgba(200,169,110,0.25)',
        'sm': '0 1px 2px rgba(0,0,0,0.3)',
        'md': '0 4px 6px rgba(0,0,0,0.4)',
        'lg': '0 10px 15px rgba(0,0,0,0.5)',
        'xl': '0 20px 25px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        'sm': '2px',
        'md': '4px',
        'lg': '8px',
        'xl': '12px',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
        'slower': '600ms',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'ticker': 'ticker 60s linear infinite',
        'fade-in': 'fadeIn 0.65s ease-out forwards',
        'slide-up': 'slideUp 0.65s ease-out forwards',
        'spin-slow': 'spin 0.7s linear infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.3)' },
        },
        'ticker': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slideUp': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};

export default config;
