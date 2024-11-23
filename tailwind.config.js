/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: '#02968A',
				primaryHover: '#026b62',
				secondary: '#D3EDEB',
				base: '#FFFFFF'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				outfit: ['Outfit', 'sans-serif'], // Add Outfit font
				syne: ['Syne', 'sans-serif'],   
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
	plugins: [require("tailwind-scrollbar-hide")],
}

// module.exports = {
// 	content: ["./src/**/*.{js,jsx,ts,tsx}"],
// 	plugins: [require("tailwind-scrollbar-hide")],
//   };

