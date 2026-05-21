const colors = require('tailwindcss/colors');

module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				// Light colors
				'primary-light': '#F7F8FC',
				'secondary-light': '#FFFFFF',
				'ternary-light': '#f6f7f8',

				// Dark colors
				'primary-dark': '#0D2438',
				'secondary-dark': '#102D44',
				'ternary-dark': '#1E3851',

				// Bold redesign palette (5-page redesign series, issue #70)
				// 대부분의 토글 색상은 CSS 변수로 globals.css 에서 swap 함.
				// tailwind 토큰은 기본 다크 값만 노출 — utility class 로 직접 쓸 일이 있을 때만 사용.
				ink: '#070E17',
				paper: '#fbfaf7',

				// Extended v3 color
				gray: colors.neutral,
			},
			screens: {
				// Bold 시안의 Contact 링크 380px 이하 숨김 패턴 (xs:inline)
				xs: '380px',
			},
			keyframes: {
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(8px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
			animation: {
				'fade-in-up': 'fade-in-up 0.3s ease-out',
			},
			container: {
				padding: {
					DEFAULT: '1rem',
					sm: '2rem',
					lg: '5rem',
					xl: '6rem',
					'2xl': '8rem',
				},
			},
		},
	},
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
