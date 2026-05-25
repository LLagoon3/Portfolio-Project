import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';

// stacks 가 빈 배열이면 섹션 미렌더.
export default function AboutBrands({ stacks = [] }) {
	if (!stacks.length) return null;

	return (
		<section
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<Reveal className="flex items-end justify-between mb-10 lg:mb-14">
				<div>
					<Eyebrow className="mb-3">— Tech Stack</Eyebrow>
					<h2
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)',
							letterSpacing: '-0.04em',
							lineHeight: 0.88,
						}}
					>
						문제를 해결하며 사용한{' '}
						<span
							style={{
								display: 'inline-block',
								color: 'var(--indigo-soft)',
								fontStyle: 'italic',
								paddingRight: '0.1em',
							}}
						>
							기술들
						</span>
						<span style={{ color: 'var(--indigo-soft)' }}>.</span>
					</h2>
				</div>
				<div
					className="hidden md:block text-xs"
					style={{
						fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
						color: 'var(--paper-faint)',
					}}
				>
					CORE · {String(stacks.length).padStart(2, '0')}
				</div>
			</Reveal>

			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
				{stacks.map((label, idx) => (
					<Reveal key={`${label}-${idx}`} delay={(idx % 4) * 0.06}>
						<div
							className="bold-interactive grid place-items-center rounded-[12px] transition-all"
							style={{
								aspectRatio: '5 / 2',
								border: '1px solid var(--line)',
								transitionProperty: 'border-color, background',
								transitionDuration: '0.3s',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.borderColor = 'var(--line-strong)';
								e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
								const lbl = e.currentTarget.querySelector('span');
								if (lbl) lbl.style.color = 'var(--paper)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.borderColor = 'var(--line)';
								e.currentTarget.style.background = 'transparent';
								const lbl = e.currentTarget.querySelector('span');
								if (lbl) lbl.style.color = 'var(--paper-faint)';
							}}
						>
							<span
								className="font-general-semibold transition-colors"
								style={{
									fontSize: 'clamp(1rem, 1.4vw, 1.4rem)',
									letterSpacing: '0.04em',
									color: 'var(--paper-faint)',
								}}
							>
								{label}
							</span>
						</div>
					</Reveal>
				))}
			</div>
		</section>
	);
}
