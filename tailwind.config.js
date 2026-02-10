/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uber-black': '#000000',
        'uber-white': '#FFFFFF',
        'uber-green': '#05A357',
        'uber-dark-green': '#04803F',
        'uber-light-gray': '#F6F6F6',
        'uber-gray': '#E2E2E2',
        'uber-dark-gray': '#545454',
      },
      borderRadius: {
        'uber': '8px',
      },
      boxShadow: {
        'uber': '0 2px 8px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}