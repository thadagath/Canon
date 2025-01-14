/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00FF9D',
        secondary: '#00D1FF',
        'accent-blue': '#0066FF',
        background: '#0A0B0E',
        'background-light': '#12131A',
        'background-lighter': '#1A1C23',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0AEC0',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 255, 157, 0.5)',
        'neon-strong': '0 0 30px rgba(0, 255, 157, 0.7)',
        'neon-blue': '0 0 20px rgba(0, 102, 255, 0.5)',
        'neon-blue-strong': '0 0 30px rgba(0, 102, 255, 0.7)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 255, 157, 0.5), 0 0 20px rgba(0, 255, 157, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 157, 0.7), 0 0 30px rgba(0, 255, 157, 0.5)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(0, 255, 157, 0.5)' },
          '50%': { opacity: '0.5', boxShadow: '0 0 10px rgba(0, 255, 157, 0.3)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, rgba(0, 255, 157, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 157, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
    },
  },
  plugins: [],
}
