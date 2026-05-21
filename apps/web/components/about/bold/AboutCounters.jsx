import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';
import StatCounter from '../../primitives/StatCounter';

// stats 가 빈 배열이면 섹션 자체 미렌더 (page 가 깨지지 않게). 어드민 입력 전 케이스.
// StatCounter 는 value 가 number 일 때 카운트업, string 일 때는 그대로 노출.
export default function AboutCounters({ stats = [] }) {
	if (!stats.length) return null;

	return (
		<section
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<Reveal className="flex items-end justify-between mb-10 lg:mb-14">
				<div>
					<Eyebrow className="mb-3">— In numbers</Eyebrow>
					<h2
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(2rem, 4vw, 3.4rem)',
							letterSpacing: '-0.04em',
							lineHeight: 0.88,
						}}
					>
						측정된 흔적
						<span style={{ color: 'var(--indigo-soft)' }}>.</span>
					</h2>
				</div>
			</Reveal>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
				{stats.map((stat, idx) => (
					<Reveal key={`${stat.label}-${idx}`} delay={idx * 0.08}>
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

// value 가 순수 숫자(또는 '333' / '99.98' 같은 숫자 문자열) 면 카운트업,
// 'ms' 같은 단위가 섞여 있으면 그대로 노출 (count up 으로 의미 안 맞는 케이스).
function StatCounterOrText({ value }) {
	const str = String(value ?? '');
	const match = str.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
	if (match) {
		const numeric = parseFloat(match[1]);
		const suffix = match[2];
		const decimals = match[1].includes('.')
			? match[1].split('.')[1].length
			: 0;
		return (
			<StatCounter end={numeric} suffix={suffix} decimals={decimals} />
		);
	}
	return <span>{str}</span>;
}
