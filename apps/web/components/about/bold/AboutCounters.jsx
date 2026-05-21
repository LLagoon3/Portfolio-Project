import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';
import StatCounter from '../../primitives/StatCounter';

// 후속 PR 에서 /api/about.stats[] 도입 시 props 로 교체. 현재는 라군 profile.md
// 기반 하드코딩 — 신입이라 'Years of experience' 같은 시안 placeholder 는 부적합.
const STATS = [
	{
		end: 6,
		label: 'Shipped Projects',
		sub: '운영 / 외주 / 팀 프로젝트',
	},
	{
		end: 333,
		suffix: 'ms',
		label: 'API Response',
		sub: '베팅덕 — Redis 큐 적용 후 (1441ms 에서 단축)',
	},
	{
		end: 77,
		suffix: '%',
		label: 'Query Cut',
		sub: '클래스업 — MongoDB 복합 인덱싱',
	},
	{
		end: 0,
		suffix: '건',
		label: '야간 호출',
		sub: '최근 운영 기간',
	},
];

export default function AboutCounters() {
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
				<div
					className="hidden md:block text-xs"
					style={{
						fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
						color: 'var(--paper-faint)',
					}}
				>
					UPDATED 2026.05
				</div>
			</Reveal>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
				{STATS.map((stat, idx) => (
					<Reveal key={stat.label} delay={idx * 0.08}>
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
								<StatCounter end={stat.end} suffix={stat.suffix} />
							</div>
							<Eyebrow className="mt-3">{stat.label}</Eyebrow>
							<div
								className="text-sm mt-1"
								style={{ color: 'var(--paper-dim)' }}
							>
								{stat.sub}
							</div>
						</div>
					</Reveal>
				))}
			</div>
		</section>
	);
}
