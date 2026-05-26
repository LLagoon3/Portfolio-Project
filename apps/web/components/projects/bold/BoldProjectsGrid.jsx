import Reveal from '../../primitives/Reveal';
import BoldProjectCard from './BoldProjectCard';

export default function BoldProjectsGrid({ projects = [] }) {
	if (!projects.length) return <EmptyState />;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 py-12 lg:py-16">
			{projects.map((p, idx) => (
				<BoldProjectCard key={p.id} project={p} delay={(idx % 6) * 0.06} />
			))}
		</div>
	);
}

function EmptyState() {
	return (
		<Reveal>
			<div
				className="my-12 lg:my-16 py-16 rounded-[18px] text-center"
				style={{
					border: '1px dashed var(--line-strong)',
					color: 'var(--paper-dim)',
				}}
			>
				<div
					className="text-xs uppercase mb-2"
					style={{
						fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
						letterSpacing: '0.14em',
					}}
				>
					No results
				</div>
				<div className="text-base">조건에 맞는 프로젝트가 없어요.</div>
			</div>
		</Reveal>
	);
}
