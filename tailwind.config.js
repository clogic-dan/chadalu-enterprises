/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          gold: '#C8922A',
          dark: '#080808',
          cream: '#F2EBD9',
        },
        accent: {
          green: '#2E9E6B',
          red: '#B83030',
          orange: '#D45F12',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Barlow', 'sans-serif'],
        condensed: ['Barlow Condensed', 'sans-serif'],
      },
    },
  },
  plugins: [],
}