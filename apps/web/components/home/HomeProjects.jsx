import { useMemo, useState } from 'react';
import Reveal from '../primitives/Reveal';
import Eyebrow from '../primitives/Eyebrow';
import Chip from '../primitives/Chip';
import PillButton from '../primitives/PillButton';
import HomeProjectCard from './HomeProjectCard';

const ALL = 'All';

export default function HomeProjects({ projects = [], displayLimit }) {
	const [activeCat, setActiveCat] = useState(ALL);
	const [search, setSearch] = useState('');

	const categories = useMemo(() => {
		const set = Array.from(
			new Set(projects.map((p) => p.category).filter(Boolean))
		).sort();
		return [ALL, ...set];
	}, [projects]);

	const chipCount = (cat) =>
		cat === ALL ? projects.length : projects.filter((p) => p.category === cat).length;

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return projects.filter((p) => {
			const okCat = activeCat === ALL || p.category === activeCat;
			const okSearch =
				!q ||
				(p.title && p.title.toLowerCase().includes(q)) ||
				(p.category && p.category.toLowerCase().includes(q));
			return okCat && okSearch;
		});
	}, [projects, activeCat, search]);

	// grid 만 displayLimit 적용 — TOTAL / 카테고리 chip / 결과 카운트는 전체 기준.
	const displayed = displayLimit ? filtered.slice(0, displayLimit) : filtered;

	const total = projects.length;
	const padTotal = String(total).padStart(2, '0');

	return (
		<section id="work" className="py-24 lg:py-32">
			{/* 헤더 */}
			<Reveal className="flex items-end justify-between mb-10 lg:mb-14">
				<div>
					<Eyebrow className="mb-4">— Selected Work</Eyebrow>
					<h2
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(2.6rem, 6vw, 5.2rem)',
							letterSpacing: '-0.04em',
							lineHeight: 0.88,
						}}
					>
						Projects
						<span style={{ color: 'var(--indigo-soft)' }}>.</span>
					</h2>
				</div>
				<div className="hidden md:flex items-end gap-3 text-right">
					<div className="text-xs" style={{
						fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
						color: 'var(--paper-faint)',
					}}>
						TOTAL
					</div>
					<div className="font-general-semibold text-2xl">{padTotal}</div>
				</div>
			</Reveal>

			{/* 칩 + 검색 */}
			<Reveal
				delay={0.08}
				className="mb-8 lg:mb-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between"
			>
				<div className="flex flex-wrap gap-2">
					{categories.map((cat) => (
						<Chip
							key={cat}
							label={cat}
							count={chipCount(cat)}
							active={cat === activeCat}
							onClick={() => setActiveCat(cat)}
						/>
					))}
				</div>
				<div className="relative w-full sm:w-auto">
					<svg
						className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						style={{ color: 'var(--paper-faint)' }}
						aria-hidden="true"
					>
						<circle cx="11" cy="11" r="7" />
						<path d="M21 21l-4.3-4.3" />
					</svg>
					<input
						type="search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="프로젝트 검색"
						aria-label="프로젝트 검색"
						className="w-full sm:w-72 pl-10 pr-4 py-2.5 rounded-full text-sm font-general-medium bg-transparent focus:outline-none transition-all"
						style={{
							border: '1px solid var(--line-strong)',
							color: 'var(--paper)',
						}}
					/>
				</div>
			</Reveal>

			{/* 결과 카운트 — 표시 중 / 필터 통과 / 전체 */}
			<Reveal
				delay={0.16}
				className="text-xs mb-6"
				style={{
					fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
					color: 'var(--paper-faint)',
				}}
			>
				<span>{String(displayed.length).padStart(2, '0')}</span>
				{displayLimit && filtered.length > displayLimit ? (
					<> / {String(filtered.length).padStart(2, '0')} (HIGHLIGHTS OF {padTotal})</>
				) : (
					<> / {padTotal} PROJECTS</>
				)}
			</Reveal>

			{/* 그리드 또는 빈 상태 */}
			{filtered.length === 0 ? (
				<div
					className="rounded-[18px] p-12 text-center"
					style={{ border: '1px dashed var(--line-strong)', color: 'var(--paper)' }}
				>
					<Eyebrow className="mb-3">— No matches</Eyebrow>
					<div className="font-general-semibold text-2xl mb-3">검색 결과 없음</div>
					<p className="text-sm" style={{ color: 'var(--paper-dim)' }}>
						다른 카테고리나 키워드로 시도해보세요.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
					{displayed.map((project, idx) => (
						<HomeProjectCard
							key={project.id ?? project.url}
							index={idx}
							project={project}
						/>
					))}
				</div>
			)}

			{/* 하단 CTA — 내부 라우팅이라 as="link" (Next Link) */}
			<div className="mt-14 lg:mt-20 flex justify-center">
				<PillButton variant="cta" as="link" href="/projects" ariaLabel="모든 프로젝트 보기">
					<span>모든 프로젝트 보기</span>
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
		</section>
	);
}
