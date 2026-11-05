/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crt: {
          bg: '#08080a',
          surface: '#0e0e12',
          card: '#131318',
          cardHover: '#181820',
          border: '#22222a',
          borderLight: '#33333e',
          amber: {
            DEFAULT: '#ff5e00',
            glow: '#ff9d00',
            dim: '#995c00',
            text: '#ffb24d',
            subtle: 'rgba(255, 94, 0, 0.1)',
          },
          phosphor: '#f5ede0',
          muted: '#8b8a91',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-amber': '0 0 25px -5px rgba(255, 94, 0, 0.45)',
        'glow-amber-lg': '0 0 45px -5px rgba(255, 94, 0, 0.6)',
        'glow-subtle': '0 0 15px -3px rgba(255, 157, 0, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
