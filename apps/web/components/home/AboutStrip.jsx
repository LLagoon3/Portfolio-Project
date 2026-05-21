import Reveal from '../primitives/Reveal';
import Eyebrow from '../primitives/Eyebrow';
import StatCounter from '../primitives/StatCounter';
import PillButton from '../primitives/PillButton';

// stat[] 필드가 API 에 없어 임시 하드코딩. 후속 PR 에서 about.stats[] 도입 시 교체.
const STATS = [
	{ end: 8, suffix: '', accent: '+', label: 'Years' },
	{ end: 14, suffix: '', accent: null, label: 'Shipped' },
	{ end: 99.98, decimals: 2, suffix: '', accent: '%', label: 'Avg Uptime' },
];

export default function AboutStrip({ bioFirst }) {
	const text =
		bioFirst ||
		'백엔드와 운영 인프라를 중심으로 일합니다. 잘 짠 코드가 아니라 잘 굴러가는 시스템을 만드는 일에 집중하고, 야간 알람이 사라진 새벽이 가장 큰 보상이라고 믿습니다.';

	return (
		<section
			id="about"
			className="py-24 lg:py-32 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<div className="grid grid-cols-12 gap-6 lg:gap-12">
				<Reveal className="col-span-12 lg:col-span-5">
					<Eyebrow className="mb-4">— About</Eyebrow>
					<h2
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
							letterSpacing: '-0.04em',
							lineHeight: 1,
						}}
					>
						코드를 쓰지만,
						<br />
						<span style={{ color: 'var(--indigo-soft)', fontStyle: 'italic' }}>
							팀의 시간을
						</span>
						<br />
						벌어줍니다.
					</h2>
				</Reveal>
				<Reveal delay={0.16} className="col-span-12 lg:col-span-7">
					<p
						className="leading-relaxed"
						style={{
							color: 'var(--paper-dim)',
							fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
							maxWidth: '56ch',
						}}
					>
						{text}
					</p>

					<div className="grid grid-cols-3 gap-6 lg:gap-10 mt-10">
						{STATS.map((stat) => (
							<div
								key={stat.label}
								className="pt-[1.4rem]"
								style={{ borderTop: '1px solid var(--line-strong)' }}
							>
								<div
									className="font-general-semibold"
									style={{
										fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
										letterSpacing: '-0.04em',
										lineHeight: 1,
									}}
								>
									<StatCounter
										end={stat.end}
										decimals={stat.decimals || 0}
										suffix={stat.suffix}
										accentSuffix={stat.accent}
									/>
								</div>
								<Eyebrow className="mt-3">{stat.label}</Eyebrow>
							</div>
						))}
					</div>

					<div className="mt-10">
						<PillButton variant="ghost" as="link" href="/about" ariaLabel="About 더 보기">
							<span>더 알아보기</span>
							<svg
								className="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden="true"
							>
								<path d="M5 12h14M13 6l6 6-6 6" />
							</svg>
						</PillButton>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
