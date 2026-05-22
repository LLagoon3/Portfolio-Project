import Link from 'next/link';
import Reveal from '../../primitives/Reveal';
import WordReveal from '../../primitives/WordReveal';
import Eyebrow from '../../primitives/Eyebrow';
import StatCounter from '../../primitives/StatCounter';

export default function BoldProjectsHero({ totalCount, categoryCount, yearCount }) {
	return (
		<section className="pt-28 lg:pt-40 pb-16 lg:pb-20">
			{/* 상단 breadcrumb */}
			<Reveal className="flex items-center gap-3 mb-10">
				<Link
					href="/"
					className="bold-interactive flex items-center gap-1.5 transition"
					style={{
						fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
						fontSize: '0.75rem',
						color: 'var(--paper-faint)',
					}}
				>
					<svg
						className="w-3 h-3"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden="true"
					>
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
					홈
				</Link>
				<span className="w-6 h-px" style={{ background: 'var(--line-strong)' }} />
				<Eyebrow>All Projects — 2026</Eyebrow>
			</Reveal>

			{/* 거대 타이틀 */}
			<WordReveal
				className="font-general-semibold"
				style={{
					fontSize: 'clamp(2.6rem, 11vw, 12rem)',
					letterSpacing: '-0.04em',
					lineHeight: 1.0,
				}}
				items={[{ text: '모든' }, { br: true }, { text: '작업.', accent: true }]}
			/>

			{/* tagline */}
			<Reveal
				as="p"
				delay={0.24}
				className="mt-12 lg:mt-16 max-w-3xl font-general-semibold"
				style={{
					fontSize: 'clamp(1.4rem, 2.2vw, 2.4rem)',
					lineHeight: 1.2,
					letterSpacing: '-0.02em',
				}}
			>
				직접 만들거나 함께 만든 것들. 결정의 기록.
			</Reveal>

			{/* stats — Total / Categories / Years */}
			<div
				className="mt-14 lg:mt-20 grid grid-cols-3 gap-6 lg:gap-12 pt-8 lg:pt-10 border-t"
				style={{ borderColor: 'var(--line-strong)' }}
			>
				<StatItem label="Total" value={totalCount} delay={0.0} />
				<StatItem label="Categories" value={categoryCount} delay={0.08} />
				<StatItem label="Years" value={yearCount} delay={0.16} />
			</div>
		</section>
	);
}

function StatItem({ label, value, delay }) {
	return (
		<Reveal delay={delay}>
			<div
				className="font-general-semibold"
				style={{
					fontSize: 'clamp(2rem, 5vw, 4rem)',
					letterSpacing: '-0.05em',
					lineHeight: 1,
					background:
						'linear-gradient(180deg, var(--paper) 0%, color-mix(in oklab, var(--paper) 55%, transparent) 100%)',
					WebkitBackgroundClip: 'text',
					backgroundClip: 'text',
					color: 'transparent',
				}}
			>
				<StatCounter end={Number(value) || 0} />
			</div>
			<Eyebrow className="mt-3">{label}</Eyebrow>
		</Reveal>
	);
}
