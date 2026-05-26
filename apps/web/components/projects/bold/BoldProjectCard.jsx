import Image from 'next/image';
import Link from 'next/link';
import Reveal from '../../primitives/Reveal';

// 4:5 프로젝트 카드 — BoldProjectsGrid (목록) + BoldProjectDetailRelated (Next Up)
// 두 곳 공통 사용. year 가 없으면 카테고리 뒤 ' · year' 미표시.
export default function BoldProjectCard({ project, delay = 0 }) {
	const p = project;
	return (
		<Reveal delay={delay}>
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
					{/* 하단 어둠 veil */}
					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							background:
								'linear-gradient(180deg, transparent 45%, rgba(7,14,23,0.85) 100%)',
						}}
						aria-hidden="true"
					/>
					{/* 우상단 화살표 */}
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
					{/* 좌하단 메타 */}
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
							{p.year ? ` · ${p.year}` : ''}
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
	);
}
