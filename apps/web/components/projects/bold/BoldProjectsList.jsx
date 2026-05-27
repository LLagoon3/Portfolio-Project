import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from '../../primitives/Reveal';
import useReducedMotion from '../../../hooks/useReducedMotion';

// newest/oldest 모드일 때만 연도 그룹 헤더 노출. az/cat 모드면 그룹 안 묶고 일렬.
const GROUPED_MODES = new Set(['newest', 'oldest']);

export default function BoldProjectsList({ projects = [], sort = 'newest' }) {
	const reduced = useReducedMotion();
	const containerRef = useRef(null);
	const [hover, setHover] = useState(null); // { x, y, img, title }

	if (!projects.length) {
		return (
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
		);
	}

	const grouped = GROUPED_MODES.has(sort)
		? groupByYear(projects)
		: [{ year: null, items: projects }];

	const handleMove = (e, p) => {
		if (reduced) return;
		if (typeof window === 'undefined' || window.innerWidth < 768) return;
		const rect = containerRef.current?.getBoundingClientRect();
		if (!rect) return;
		setHover({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
			img: p.img,
			title: p.title,
		});
	};

	const handleLeave = () => setHover(null);

	let runningIndex = 0;

	return (
		<div
			ref={containerRef}
			className="relative py-12 lg:py-16"
			onMouseLeave={handleLeave}
		>
			{grouped.map((group) => (
				<div key={group.year ?? 'all'} className="mb-10 lg:mb-14 last:mb-0">
					{group.year && (
						<Reveal>
							<div
								className="flex items-baseline gap-4 pb-4 mb-2 border-b"
								style={{ borderColor: 'var(--line-strong)' }}
							>
								<span
									className="font-general-semibold"
									style={{
										fontSize: 'clamp(2rem, 4vw, 3rem)',
										letterSpacing: '-0.04em',
										lineHeight: 1,
									}}
								>
									{group.year}
								</span>
								<span
									className="text-xs uppercase"
									style={{
										fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
										letterSpacing: '0.14em',
										color: 'var(--paper-faint)',
									}}
								>
									{String(group.items.length).padStart(2, '0')} project{group.items.length === 1 ? '' : 's'}
								</span>
							</div>
						</Reveal>
					)}

					{group.items.map((p) => {
						runningIndex += 1;
						return (
							<Reveal key={p.id}>
								<Link
									href={`/projects/${p.url}`}
									aria-label={p.title}
									className="bold-interactive group block"
									onMouseMove={(e) => handleMove(e, p)}
								>
									<div
										className="grid items-center gap-4 py-5 lg:py-6 border-b transition-colors"
										style={{
											borderColor: 'var(--line)',
											gridTemplateColumns: 'minmax(40px, 60px) 1fr auto auto 40px',
										}}
									>
										<span
											className="text-xs"
											style={{
												fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
												letterSpacing: '0.12em',
												color: 'var(--paper-faint)',
											}}
										>
											{String(runningIndex).padStart(2, '0')}
										</span>
										<span
											className="font-general-semibold transition-transform duration-300 group-hover:translate-x-2"
											style={{
												fontSize: 'clamp(1.3rem, 2.2vw, 2.2rem)',
												letterSpacing: '-0.02em',
												lineHeight: 1.1,
												wordBreak: 'keep-all',
											}}
										>
											{p.title}
										</span>
										<span
											className="hidden md:inline text-xs uppercase whitespace-nowrap"
											style={{
												fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
												letterSpacing: '0.12em',
												color: 'var(--paper-dim)',
											}}
										>
											{p.category}
										</span>
										<span
											className="hidden md:inline text-xs whitespace-nowrap"
											style={{
												fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
												letterSpacing: '0.12em',
												color: 'var(--paper-faint)',
											}}
										>
											{p.year ?? '—'}
										</span>
										<span
											className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-transform duration-300 group-hover:rotate-[-45deg]"
											style={{
												border: '1px solid var(--line-strong)',
												color: 'var(--paper)',
											}}
											aria-hidden="true"
										>
											<svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
												<path d="M5 12h14M13 6l6 6-6 6" />
											</svg>
										</span>
									</div>
								</Link>
							</Reveal>
						);
					})}
				</div>
			))}

			{/* mousemove 따라다니는 썸네일 (>=768px 만, reduced-motion 비활성) */}
			{hover && (
				<div
					className="hidden md:block pointer-events-none absolute z-10 overflow-hidden rounded-[14px]"
					style={{
						left: hover.x + 24,
						top: hover.y - 90,
						width: 240,
						height: 180,
						border: '1px solid var(--line-strong)',
						boxShadow: '0 20px 60px -20px rgba(0,0,0,0.6)',
						background: 'var(--ink)',
					}}
					aria-hidden="true"
				>
					{hover.img && (
						<Image
							src={hover.img}
							alt=""
							fill
							sizes="240px"
							style={{ objectFit: 'cover' }}
						/>
					)}
				</div>
			)}
		</div>
	);
}

function groupByYear(projects) {
	const map = new Map();
	for (const p of projects) {
		const k = p.year ?? '—';
		if (!map.has(k)) map.set(k, []);
		map.get(k).push(p);
	}
	return Array.from(map.entries()).map(([year, items]) => ({ year, items }));
}
