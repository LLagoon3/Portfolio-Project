import { useMemo, useState } from 'react';
import BoldLayout from '../../components/layout/bold/BoldLayout';
import PagesMetaHead from '../../components/PagesMetaHead';
import BoldProjectsHero from '../../components/projects/bold/BoldProjectsHero';
import BoldProjectsMarquee from '../../components/projects/bold/BoldProjectsMarquee';
import BoldProjectsControls from '../../components/projects/bold/BoldProjectsControls';
import BoldProjectsGrid from '../../components/projects/bold/BoldProjectsGrid';
import BoldProjectsList from '../../components/projects/bold/BoldProjectsList';
import BoldProjectsCTA from '../../components/projects/bold/BoldProjectsCTA';
import { parseYear } from '../../lib/projects';

const API_BASE_URL = process.env.API_INTERNAL_URL || 'http://localhost:7341';

function ProjectsIndex({ projects }) {
	const decorated = useMemo(
		() => projects.map((p) => ({ ...p, year: parseYear(p.headerPublishDate) })),
		[projects],
	);

	const [category, setCategory] = useState('all');
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('newest');
	const [view, setView] = useState('grid');

	const categories = useMemo(() => buildCategories(decorated), [decorated]);

	const visible = useMemo(
		() => applyFilters(decorated, { category, search, sort }),
		[decorated, category, search, sort],
	);

	const totalCount = decorated.length;
	const categoryCount = useMemo(
		() => new Set(decorated.map((p) => p.category)).size,
		[decorated],
	);
	const yearCount = useMemo(
		() => new Set(decorated.map((p) => p.year).filter(Boolean)).size,
		[decorated],
	);

	return (
		<>
			<PagesMetaHead title="Projects" />

			<div className="container mx-auto px-6 lg:px-10">
				<BoldProjectsHero
					totalCount={totalCount}
					categoryCount={categoryCount}
					yearCount={yearCount}
				/>

				<BoldProjectsMarquee />

				<BoldProjectsControls
					categories={categories}
					activeCategory={category}
					onCategoryChange={setCategory}
					search={search}
					onSearchChange={setSearch}
					sort={sort}
					onSortChange={setSort}
					view={view}
					onViewChange={setView}
				/>

				{/* 결과 카운트 — 시안의 inline 모노스페이스 */}
				<div
					className="mt-6 text-xs uppercase"
					style={{
						fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
						letterSpacing: '0.14em',
						color: 'var(--paper-faint)',
					}}
				>
					{String(visible.length).padStart(2, '0')} / {String(totalCount).padStart(2, '0')} PROJECTS
				</div>

				{view === 'grid' ? (
					<BoldProjectsGrid projects={visible} />
				) : (
					<BoldProjectsList projects={visible} sort={sort} />
				)}

				<BoldProjectsCTA />
			</div>
		</>
	);
}

ProjectsIndex.getLayout = (page) => <BoldLayout>{page}</BoldLayout>;

function buildCategories(projects) {
	const counts = new Map();
	for (const p of projects) {
		counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
	}
	const list = Array.from(counts.entries())
		.sort((a, b) => a[0].localeCompare(b[0]))
		.map(([key, count]) => ({ key, label: key, count }));
	return [{ key: 'all', label: 'All', count: projects.length }, ...list];
}

function applyFilters(projects, { category, search, sort }) {
	const q = search.trim().toLowerCase();
	let list = projects.filter((p) => {
		if (category !== 'all' && p.category !== category) return false;
		if (!q) return true;
		return (
			p.title.toLowerCase().includes(q) ||
			p.category.toLowerCase().includes(q)
		);
	});

	switch (sort) {
		case 'oldest':
			list = list.sort((a, b) => (a.year || '').localeCompare(b.year || '') || a.title.localeCompare(b.title));
			break;
		case 'az':
			list = list.sort((a, b) => a.title.localeCompare(b.title));
			break;
		case 'cat':
			list = list.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
			break;
		case 'newest':
		default:
			list = list.sort((a, b) => (b.year || '').localeCompare(a.year || '') || a.title.localeCompare(b.title));
			break;
	}
	return list;
}

export async function getServerSideProps() {
	try {
		const res = await fetch(`${API_BASE_URL}/api/projects`);
		if (res.status === 404) {
			// 목록 API 가 404 를 돌려주는 건 비정상이지만, 방어적으로 빈 배열 fallback
			return { props: { projects: [] } };
		}
		if (!res.ok) {
			// 5xx 등 비정상 응답은 시스템 장애이므로 감추지 않고 Next.js 에러 페이지로 드러낸다
			throw new Error(`[projects] API returned ${res.status}`);
		}
		const body = await res.json();
		return { props: { projects: body?.data ?? [] } };
	} catch (err) {
		console.error('[projects] fetch failed', err);
		throw err;
	}
}

export default ProjectsIndex;
