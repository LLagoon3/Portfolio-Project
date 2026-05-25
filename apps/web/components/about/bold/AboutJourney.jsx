import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';

// journey 가 빈 배열이면 섹션 미렌더.
export default function AboutJourney({ journey = [] }) {
	if (!journey.length) return null;

	return (
		<section
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<Reveal className="flex items-end justify-between mb-10 lg:mb-14">
				<div>
					<Eyebrow className="mb-3">— Journey</Eyebrow>
					<h2
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
							letterSpacing: '-0.04em',
							lineHeight: 0.88,
						}}
					>
						문제를 해결해 온{' '}
						<span
							style={{
								display: 'inline-block',
								color: 'var(--indigo-soft)',
								fontStyle: 'italic',
								paddingRight: '0.1em',
							}}
						>
							과정
						</span>
						<span style={{ color: 'var(--indigo-soft)' }}>.</span>
					</h2>
				</div>
			</Reveal>

			<div>
				{journey.map((row, idx) => (
					<Reveal
						key={`${row.year}-${row.title}-${idx}`}
						delay={idx * 0.06}
						className="bold-tl-row py-[1.8rem] border-t"
						style={{ borderColor: 'var(--line)' }}
					>
						<div
							className="text-xs"
							style={{
								fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
								letterSpacing: '0.1em',
								color: 'var(--indigo-soft)',
								paddingTop: '0.4rem',
							}}
						>
							{row.year}
						</div>
						<div>
							<div
								className="font-general-semibold mb-[0.35rem]"
								style={{
									fontSize: 'clamp(1.1rem, 1.6vw, 1.5rem)',
									letterSpacing: '-0.02em',
								}}
							>
								{row.title}
							</div>
							{row.role && (
								<div
									className="font-general-medium text-[13px] mb-3"
									style={{ color: 'var(--paper-dim)' }}
								>
									{row.role}
								</div>
							)}
							<div
								className="leading-relaxed"
								style={{ color: 'var(--paper-dim)', maxWidth: '60ch' }}
							>
								{row.body}
							</div>
						</div>
					</Reveal>
				))}
				{/* 마지막 row 아래 보더 */}
				<div style={{ borderBottom: '1px solid var(--line)' }} />
			</div>
		</section>
	);
}
