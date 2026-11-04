import styles from './Projects.module.css';

// /projects 전용 18px / 1.5px 선 아이콘. 장식용이라 항상 스크린리더에서 숨긴다.
const PATHS = {
	arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
	arrowUp: <path d="M12 19V5m-6 6 6-6 6 6" />,
	chevronDown: <path d="m6 9 6 6 6-6" />,
	moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
	menu: <path d="M4 7h16M4 12h16M4 17h16" />,
	search: (
		<>
			<circle cx="10.5" cy="10.5" r="6.5" />
			<path d="m16 16 4.5 4.5" />
		</>
	),
	sliders: <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />,
	grid: (
		<>
			<rect x="3" y="3" width="7" height="7" rx="1" />
			<rect x="14" y="3" width="7" height="7" rx="1" />
			<rect x="14" y="14" width="7" height="7" rx="1" />
			<rect x="3" y="14" width="7" height="7" rx="1" />
		</>
	),
	list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
};

export default function ProjectsIcon({ name, className = '' }) {
	return (
		<svg
			className={`${styles.icon} ${className}`.trim()}
			viewBox="0 0 24 24"
			aria-hidden="true"
			focusable="false"
		>
			{PATHS[name]}
		</svg>
	);
}
