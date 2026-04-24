/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black': {
          200: '#110e1a',
          300: '#1c1828',
          400: '#262234',
          500: '#302c40',
          600: '#3a364c',
        },
        'amber': {
          gold: '#c8a820',
          warm: '#d4813a',
          glow: '#e8c040',
        },
        'gray': {
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        'generalsans': ['General Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}