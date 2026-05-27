import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';

// principles 가 빈 배열이면 섹션 미렌더.
export default function AboutPrinciples({ principles = [] }) {
	if (!principles.length) return null;

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
							{principles.length}가지 원칙.
						</span>
					</h2>
				</Reveal>
				<Reveal delay={0.16} className="col-span-12 lg:col-span-7 lg:pt-8">
					<p
						className="leading-relaxed max-w-xl"
						style={{ color: 'var(--paper-dim)' }}
					>
						기술은 결국 서비스를 더 잘 굴러가게 만드는 도구라고 생각합니다.
						아래는 어떤 코드를 쓸지 고민할 때 기준으로 삼는 원칙들입니다.
					</p>
				</Reveal>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
				{principles.map((p, idx) => (
					<Reveal key={`${p.title}-${idx}`} delay={idx * 0.08}>
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
