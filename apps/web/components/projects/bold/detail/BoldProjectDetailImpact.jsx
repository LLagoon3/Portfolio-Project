import Reveal from '../../../primitives/Reveal';
import Eyebrow from '../../../primitives/Eyebrow';
import StatCounter from '../../../primitives/StatCounter';

// stats 빈 배열이면 섹션 자체 미렌더 (Phase 1 동일 동작 호환).
// AboutCounters 패턴 동일 — value 가 순수 숫자면 카운트업, 단위 섞이면 plain.
export default function BoldProjectDetailImpact({ stats = [] }) {
	if (!stats.length) return null;

	return (
		<section
			id="impact"
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<Reveal className="flex items-end justify-between mb-10 lg:mb-14">
				<div>
					<Eyebrow className="mb-3">— Impact</Eyebrow>
					<h2
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
							letterSpacing: '-0.04em',
							lineHeight: 1.15,
						}}
					>
						숫자로 남긴 결과
						<span style={{ color: 'var(--indigo-soft)' }}>.</span>
					</h2>
				</div>
			</Reveal>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
				{stats.map((stat, idx) => (
					<Reveal key={`${stat.id ?? stat.label}-${idx}`} delay={idx * 0.08}>
						<div
							className="pt-[1.4rem]"
							style={{ borderTop: '1px solid var(--line-strong)' }}
						>
							<div
								className="font-general-semibold"
								style={{
									fontSize: 'clamp(3rem, 7vw, 5.5rem)',
									letterSpacing: '-0.05em',
									lineHeight: 1,
									background:
										'linear-gradient(180deg, var(--paper) 0%, color-mix(in oklab, var(--paper) 55%, transparent) 100%)',
									WebkitBackgroundClip: 'text',
									backgroundClip: 'text',
									color: 'transparent',
								}}
							>
								<StatCounterOrText value={stat.value} />
							</div>
							<Eyebrow className="mt-3">{stat.label}</Eyebrow>
							{stat.sub && (
								<div
									className="text-sm mt-1"
									style={{ color: 'var(--paper-dim)' }}
								>
									{stat.sub}
								</div>
							)}
						</div>
					</Reveal>
				))}
			</div>
		</section>
	);
}

// AboutCounters 의 StatCounterOrText 와 동일 — 순수 숫자면 카운트업, 단위 섞이면 plain.
function StatCounterOrText({ value }) {
	const str = String(value ?? '');
	if (/^-?\d+(?:\.\d+)?$/.test(str)) {
		const numeric = parseFloat(str);
		const decimals = str.includes('.') ? str.split('.')[1].length : 0;
		return <StatCounter end={numeric} decimals={decimals} />;
	}
	return <span>{str}</span>;
}
