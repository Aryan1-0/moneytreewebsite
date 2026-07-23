/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette pulled from the tree island artwork
        night: {
          950: '#050b0a',
          900: '#08130f',
          800: '#0c1a15',
          700: '#12241d',
        },
        // Brand palette
        //   Primary #8EE65A · Secondary #69C248 · Dark #2D7A3F · Glow #B8FF86
        moss: {
          50: '#f3fde9',
          100: '#e3fbcd',
          200: '#c9f6a2',
          300: '#B8FF86', // Glow
          400: '#8EE65A', // Primary brand green
          500: '#69C248', // Secondary green
          600: '#4f9e3b',
          700: '#2D7A3F', // Dark green
          800: '#245f32',
          900: '#1a4726',
        },
        glow: '#B8FF86',
        ember: '#f5b544',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.6)', opacity: '0.8' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.6s cubic-bezier(0.2, 0.7, 0.3, 1) infinite',
        shimmer: 'shimmer 2.5s infinite',
        'fade-up': 'fade-up 0.7s ease-out both',
      },
    },
  },
  plugins: [],
}
