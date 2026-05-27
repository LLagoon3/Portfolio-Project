import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';
import StatCounter from '../../primitives/StatCounter';

// stats 가 빈 배열이면 섹션 자체 미렌더 (page 가 깨지지 않게). 어드민 입력 전 케이스.
// StatCounterOrText 가 value 가 number 일 때 카운트업, 단위 섞이면 plain 처리.
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
						<span
							style={{
								display: 'inline-block',
								color: 'var(--indigo-soft)',
								fontStyle: 'italic',
								paddingRight: '0.1em',
							}}
						>
							수치로
						</span>{' '}
						남긴 결과
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
									// lineHeight 1.0 은 background-clip:text 마스크가 line box 와
									// 동일해져 '%' 등 글리프 하단 끝이 잘리는 경계. 1.15 로 여유.
									lineHeight: 1.15,
									background:
										'linear-gradient(180deg, var(--paper) 0%, color-mix(in oklab, var(--paper) 55%, transparent) 100%)',
									WebkitBackgroundClip: 'text',
									backgroundClip: 'text',
									color: 'transparent',
								}}
							>
								<StatCounter value={stat.value} />
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
