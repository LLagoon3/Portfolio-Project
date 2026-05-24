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
						수치로 남긴 결과
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

// value 가 순수 숫자 / 소수 ('333' / '99.98') 면 react-countup 으로 카운트업.
// 단위·기호가 섞이면 ('333ms' / '8+ Years' / '1108ms saved' 등) admin 이 입력한
// 형식을 그대로 보존해서 plain 으로 노출. 카운트업 + 단위 조합은 admin 의 의도
// 형식을 깰 수 있고 (예: '333ms saved' 면 saved 까지 suffix 로 들어가 어색),
// 단위 분리·합성 휴리스틱은 케이스마다 비결정적이라 보수적으로 처리.
function StatCounterOrText({ value }) {
	const str = String(value ?? '');
	if (/^-?\d+(?:\.\d+)?$/.test(str)) {
		const numeric = parseFloat(str);
		const decimals = str.includes('.') ? str.split('.')[1].length : 0;
		return <StatCounter end={numeric} decimals={decimals} />;
	}
	return <span>{str}</span>;
}
