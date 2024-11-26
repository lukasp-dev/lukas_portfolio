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
          200: '#1A1A1A',
          300: '#262626',
          400: '#333333',
          500: '#404040',
          600: '#4D4D4D',
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