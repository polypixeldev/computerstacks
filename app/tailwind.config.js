/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./pages/**/*.tsx', './components/**/*.tsx'],
	theme: {
		extend: {
			colors: {
				'gray-1': '#4c4c63',
				'gray-2': '#454554',
				'gray-3': '#3b3b4f',
				'gray-4': '#23272a',
				'head-1': '#0278d9',
				'head-2': '#0271cc',
				'head-3': '#0259a0',
				'head-4': '#0265b5',
				card: '#6c6c8c',
				share: '#585873',
				'input-light': '#788cce',
				button: 'rgba(120, 140, 206, 0.5)',
			},
			fontFamily: {
				dosis: ['var(--font-dosis)', 'sans-serif'],
				'zilla-slab': ['var(--font-zilla-slab)', 'sans-serif'],
				'open-sans': ['var(--font-open-sans)', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
