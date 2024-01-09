/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,ts,tsx,js,jsx}'],
	theme: {
		extend: {},
		borderRadius: {
			none: '0',
			sm: '0.125rem',
			DEFAULT: '0.25rem',
			DEFAULT: '4px',
			md: '0.375rem',
			lg: '0.5rem',
			full: '9999px',
			large: '10px',
		},
		screens: {
			'2xl': { max: '1535px' },
			// => @media (max-width: 1535px) { ... }

			xl: { max: '1279px' },
			// => @media (max-width: 1279px) { ... }

			lg: { max: '1030px' },
			// => @media (max-width: 1023px) { ... }

			md: { max: '767px' },
			// => @media (max-width: 767px) { ... }

			sm: { max: '460px' },
			// => @media (max-width: 639px) { ... }
			xs: { max: '320px' },
		},
	},
	fontFamily: {
		new: ['SF Pro Text'],
		sans: [
			'ui-sans-serif',
			'system-ui',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'"Noto Sans"',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
			'"Noto Color Emoji"',
		],
		serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
		mono: [
			'ui-monospace',
			'SFMono-Regular',
			'Menlo',
			'Monaco',
			'Consolas',
			'"Liberation Mono"',
			'"Courier New"',
			'monospace',
		],
	},
	fontWeight: {
		thin: '100',
		extralight: '200',
		light: '300',
		normal: '400',
		medium: '500',
		semibold: '600',
		bold: '700',
		extrabold: '800',
		black: '900',
	},
	screens: {
		'2xl': { max: '1535px' },
		// => @media (max-width: 1535px) { ... }

		xl: { max: '1279px' },
		// => @media (max-width: 1279px) { ... }

		lg: { max: '1023px' },
		// => @media (max-width: 1023px) { ... }

		md: { max: '767px' },
		// => @media (max-width: 767px) { ... }

		sm: { max: '639px' },
		// => @media (max-width: 639px) { ... }
	},
	colors: {
		transparent: 'transparent',
		current: 'currentColor',
		white: '#ffffff',
		purple: '#3f3cbb',
		midnight: '#121063',
		metal: '#565584',
		tahiti: '#3ab7bf',
		silver: '#ecebff',
		'bubble-gum': '#ff77e9',
		bermuda: '#78dcca',
		sidebar: '#ccc',
		gray: '#808080'
	},
	plugins: [],
};
