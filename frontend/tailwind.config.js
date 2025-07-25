/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				InterR: ['InterR'],
				InterB: ['InterB'],
			},
			colors: {
				'white-opacity': 'rgba(250, 250, 250, 0.4)',
			},
		},
	},
	plugins: [],
};
