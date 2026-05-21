import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';

// 라군 profile.md 의 핵심 강점 4개. 후속 PR 에서 /api/about.principles[] 도입.
const PRINCIPLES = [
	{
		title: '원인을 끝까지 파고든다',
		body: '문제가 생기면 겉으로 드러난 증상보다, 왜 이런 문제가 발생했는지부터 확인합니다. 다음에 또 안 일어나도록.',
	},
	{
		title: '운영을 고려한 백엔드 시야',
		body: 'API 개발에만 머물지 않고 로그, 성능, 데이터 흐름, 장애 대응, 운영 효율까지 함께 봅니다.',
	},
	{
		title: '실시간성과 성능 최적화',
		body: 'Redis, 캐시, 큐, 인덱스, 페이지네이션. 백엔드에서 자주 마주치는 성능 문제를 실제 프로젝트에서 다뤘습니다.',
	},
	{
		title: '원리를 이해하고 쓴다',
		body: '커스텀 웹 프레임워크 프로젝트에서 Node.js net 모듈 위 HTTP 파싱, Router, Middleware 까지 직접 구현. 내부 동작 원리를 이해하려 합니다.',
	},
];

export default function AboutPrinciples() {
	return (
		<section
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<div className="grid grid-cols-12 gap-6 lg:gap-12 mb-10 lg:mb-14">
				<Reveal className="col-span-12 lg:col-span-5">
					<Eyebrow className="mb-3">— Principles</Eyebrow>
					<h2
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
							letterSpacing: '-0.04em',
							lineHeight: 1,
						}}
					>
						작업을 이끄는
						<br />
						<span
							style={{
								display: 'inline-block',
								color: 'var(--indigo-soft)',
								fontStyle: 'italic',
								paddingRight: '0.1em',
							}}
						>
							네 가지 원칙.
						</span>
					</h2>
				</Reveal>
				<Reveal delay={0.16} className="col-span-12 lg:col-span-7 lg:pt-8">
					<p
						className="leading-relaxed max-w-xl"
						style={{ color: 'var(--paper-dim)' }}
					>
						기술은 결국 서비스를 더 잘 굴러가게 만드는 도구라고 생각합니다.
						아래는 어떤 코드를 쓸지 고민할 때 기준으로 삼는 네 가지 원칙입니다.
					</p>
				</Reveal>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
				{PRINCIPLES.map((p, idx) => (
					<Reveal key={p.title} delay={idx * 0.08}>
						<div
							className="bold-interactive rounded-[18px] p-6 transition-all"
							style={{
								border: '1px solid var(--line)',
								background: 'rgba(255,255,255,0.02)',
								transitionProperty: 'border-color, transform',
								transitionDuration: '0.4s',
								transitionTimingFunction: 'cubic-bezier(0.2,0.7,0.2,1)',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'translateY(-4px)';
								e.currentTarget.style.borderColor = 'var(--line-strong)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'translateY(0)';
								e.currentTarget.style.borderColor = 'var(--line)';
							}}
						>
							<div
								className="mb-4 text-xs"
								style={{
									fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
									letterSpacing: '0.12em',
									color: 'var(--indigo-soft)',
								}}
							>
								{String(idx + 1).padStart(2, '0')}
							</div>
							<div className="font-general-semibold text-xl lg:text-2xl mb-3">
								{p.title}
							</div>
							<p
								className="text-sm leading-relaxed"
								style={{ color: 'var(--paper-dim)' }}
							>
								{p.body}
							</p>
						</div>
					</Reveal>
				))}
			</div>
		</section>
	);
}
