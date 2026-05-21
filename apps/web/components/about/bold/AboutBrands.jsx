import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';

// 시안의 'Companies' 섹션을 라군의 신입 컨텍스트에 맞게 'Tech Stack' 으로 의미 재정의.
// 후속 PR 에서 백엔드 keywords[] 또는 stacks[] 필드 도입 시 동적화.
const STACKS = [
	'NestJS',
	'Express',
	'TypeScript',
	'MySQL',
	'MongoDB',
	'Redis',
	'Docker',
	'Grafana / Loki',
];

export default function AboutBrands() {
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
						실제로 다뤄본 도구들
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
					CORE · {String(STACKS.length).padStart(2, '0')}
				</div>
			</Reveal>

			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
				{STACKS.map((label, idx) => (
					<Reveal key={label} delay={(idx % 4) * 0.06}>
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
