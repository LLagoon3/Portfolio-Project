import Reveal from '../../../primitives/Reveal';
import Eyebrow from '../../../primitives/Eyebrow';
import PillButton from '../../../primitives/PillButton';
import BoldProjectCard from '../BoldProjectCard';

export default function BoldProjectDetailRelated({ projects = [] }) {
	if (!projects.length) return null;

	const visible = projects.slice(0, 3);

	return (
		<section
			id="related"
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<Reveal className="flex items-end justify-between mb-10 lg:mb-12 gap-4 flex-wrap">
				<div>
					<Eyebrow className="mb-3">— Next Up</Eyebrow>
					<h2
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
							letterSpacing: '-0.04em',
							lineHeight: 1.15,
						}}
					>
						다른 프로젝트도 보기
						<span style={{ color: 'var(--indigo-soft)' }}>.</span>
					</h2>
				</div>
				<PillButton href="/projects" variant="ghost" ariaLabel="모든 프로젝트 보기">
					<span>모든 프로젝트</span>
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
			</Reveal>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
				{visible.map((p, idx) => (
					<BoldProjectCard key={p.id} project={p} delay={idx * 0.06} />
				))}
			</div>
		</section>
	);
}
