/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0f1729',
          800: '#1a2744',
          700: '#1e3a5f',
        },
      },
    },
  },
  plugins: [],
}
