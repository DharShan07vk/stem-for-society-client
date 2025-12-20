/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
export default {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {},
		fontFamily: {
        instrument: ['"Instrument Serif"', 'serif'],
      },
	},
	plugins: [],
}
