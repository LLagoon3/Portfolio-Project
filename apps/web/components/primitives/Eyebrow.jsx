// 11px uppercase 메타 라벨. 섹션 상단의 "— Selected Work, 2026" 류.
export default function Eyebrow({ children, className = '', style }) {
	return (
		<div
			className={`font-general-medium text-[11px] uppercase ${className}`}
			style={{
				letterSpacing: '0.22em',
				color: 'color-mix(in oklab, var(--paper) 55%, transparent)',
				...style,
			}}
		>
			{children}
		</div>
	);
}
