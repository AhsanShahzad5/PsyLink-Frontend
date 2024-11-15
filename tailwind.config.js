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
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
}

