import useReducedMotion from '../../hooks/useReducedMotion';

// 무한 슬라이드. children 을 2배 복제하고 0 → -50% 평행이동.
// reduced-motion 시 애니메이션 정지(글로벌 reduce 룰이 0.001ms 로 만들어줌).
export default function Marquee({ items = [], duration = 36, className = '' }) {
	const reduced = useReducedMotion();
	const tracks = reduced ? [items] : [items, items];

	return (
		<div
			className={`overflow-hidden relative py-[22px] ${className}`}
			style={{
				borderTop: '1px solid var(--line)',
				borderBottom: '1px solid var(--line)',
				maskImage:
					'linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%)',
				WebkitMaskImage:
					'linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%)',
			}}
		>
			<div
				className="flex gap-14 w-max"
				style={{
					animation: reduced
						? 'none'
						: `bold-marquee ${duration}s linear infinite`,
				}}
			>
				{tracks.flatMap((set, setIdx) =>
					set.map((label, idx) => (
						<span
							key={`${setIdx}-${idx}`}
							className="font-general-semibold whitespace-nowrap inline-flex items-center gap-14"
							style={{
								fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
								letterSpacing: '-0.02em',
								color: 'color-mix(in oklab, var(--paper) 70%, transparent)',
							}}
						>
							{label}
							<span
								aria-hidden="true"
								style={{
									color: 'var(--indigo-soft)',
									fontSize: '1.2rem',
								}}
							>
								·
							</span>
						</span>
					))
				)}
			</div>
		</div>
	);
}
