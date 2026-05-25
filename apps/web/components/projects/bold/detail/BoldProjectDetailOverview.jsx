import Reveal from '../../../primitives/Reveal';
import Eyebrow from '../../../primitives/Eyebrow';

export default function BoldProjectDetailOverview({ body }) {
	if (!body) return null;

	return (
		<section
			id="overview"
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<div className="grid grid-cols-12 gap-6 lg:gap-12">
				<Reveal className="col-span-12 lg:col-span-4">
					<div className="lg:sticky lg:top-32">
						<Eyebrow className="mb-3">— Overview</Eyebrow>
						<h2
							className="font-general-semibold"
							style={{
								fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
								letterSpacing: '-0.04em',
								lineHeight: 1.15,
							}}
						>
							이 프로젝트는
							<span style={{ color: 'var(--indigo-soft)' }}>.</span>
						</h2>
					</div>
				</Reveal>
				<Reveal delay={0.08} className="col-span-12 lg:col-span-8">
					<p
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(1.4rem, 2.2vw, 2.4rem)',
							lineHeight: 1.4,
							letterSpacing: '-0.02em',
							color: 'var(--paper)',
							wordBreak: 'keep-all',
						}}
					>
						{body}
					</p>
				</Reveal>
			</div>
		</section>
	);
}
