import Image from 'next/image';
import Link from 'next/link';
import Reveal from '../../../primitives/Reveal';
import Eyebrow from '../../../primitives/Eyebrow';
import PillButton from '../../../primitives/PillButton';

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
					<Reveal key={p.id} delay={idx * 0.06}>
						<Link
							href={`/projects/${p.url}`}
							aria-label={p.title}
							className="bold-interactive block group"
						>
							<div
								className="relative overflow-hidden rounded-[18px]"
								style={{
									border: '1px solid var(--line-strong)',
									aspectRatio: '4 / 5',
									background:
										'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(99,102,241,0.04))',
								}}
							>
								{p.img && (
									<Image
										src={p.img}
										alt={p.title}
										fill
										sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
										className="transition-transform duration-700 group-hover:scale-105"
										style={{ objectFit: 'cover' }}
									/>
								)}
								<div
									className="absolute inset-0 pointer-events-none"
									style={{
										background:
											'linear-gradient(180deg, transparent 45%, rgba(7,14,23,0.85) 100%)',
									}}
									aria-hidden="true"
								/>
								<div
									className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-[-45deg]"
									style={{
										background: 'rgba(255,255,255,0.12)',
										backdropFilter: 'blur(6px)',
										border: '1px solid rgba(255,255,255,0.18)',
									}}
									aria-hidden="true"
								>
									<svg
										className="w-4 h-4"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										style={{ color: '#ffffff' }}
									>
										<path d="M5 12h14M13 6l6 6-6 6" />
									</svg>
								</div>
								<div className="absolute left-5 right-5 bottom-5 z-[2]">
									<div
										className="text-[10px] uppercase mb-2"
										style={{
											fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
											letterSpacing: '0.14em',
											color: 'rgba(255,255,255,0.7)',
										}}
									>
										{p.category}
									</div>
									<div
										className="font-general-semibold leading-tight"
										style={{
											fontSize: 'clamp(1.1rem, 1.6vw, 1.5rem)',
											letterSpacing: '-0.02em',
											color: '#ffffff',
											wordBreak: 'keep-all',
										}}
									>
										{p.title}
									</div>
								</div>
							</div>
						</Link>
					</Reveal>
				))}
			</div>
		</section>
	);
}
