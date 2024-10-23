/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#02968A',
        'secondary': '#D3EDEB',
        'base': '#FFFFFF'
      },
    },
  },
  plugins: [],
}

