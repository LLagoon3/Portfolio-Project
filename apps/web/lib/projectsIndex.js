// /projects 목록 화면 전용 순수 헬퍼. 필터/정렬 정책을 컴포넌트와 분리해 테스트한다.
import { parseYear } from './projects';

export const DEFAULT_SETTINGS = Object.freeze({
	category: 'all',
	sort: 'newest',
	view: 'grid',
});

export const SORT_OPTIONS = [
	{ value: 'newest', label: '최신순' },
	{ value: 'oldest', label: '오래된순' },
	{ value: 'az', label: '이름순' },
	{ value: 'cat', label: '카테고리순' },
];

export const VIEW_OPTIONS = [
	{ value: 'grid', label: '그리드', icon: 'grid' },
	{ value: 'list', label: '목록', icon: 'list' },
];

// 기존 최신순 규칙: 연도 내림차순 → 같은 연도는 제목 localeCompare.
function compareNewest(a, b) {
	return (b.year || '').localeCompare(a.year || '') || a.title.localeCompare(b.title);
}

// getServerSideProps 에서 한 번만 호출해 props 를 기본(최신순) 순서로 내려 보낸다.
// localeCompare 는 실행 환경의 기본 로케일을 따르므로, 브라우저에서 다시 정렬하면
// 서버 HTML 과 순서/번호가 달라져 hydration 이 어긋날 수 있다.
export function sortProjectsForIndex(projects) {
	return [...projects]
		.map((project) => ({ project, title: project.title, year: parseYear(project.headerPublishDate) }))
		.sort(compareNewest)
		.map(({ project }) => project);
}

// props 순서(= 서버가 정한 최신순)를 1부터 시작하는 고정 번호로 붙인다.
// 필터·정렬을 바꿔도 각 프로젝트의 번호는 그대로 유지된다.
export function decorateProjects(projects) {
	return projects.map((project, index) => ({
		...project,
		year: parseYear(project.headerPublishDate),
		number: index + 1,
	}));
}

// 기존 /projects 정책: 카테고리 일치 + 제목/카테고리 부분 일치 검색, 4가지 정렬.
export function applyFilters(projects, { category, search, sort }) {
	const q = search.trim().toLowerCase();
	const list = projects.filter((p) => {
		if (category !== 'all' && p.category !== category) return false;
		if (!q) return true;
		return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
	});

	switch (sort) {
		case 'oldest':
			return list.sort(
				(a, b) => (a.year || '').localeCompare(b.year || '') || a.title.localeCompare(b.title),
			);
		case 'az':
			return list.sort((a, b) => a.title.localeCompare(b.title));
		case 'cat':
			return list.sort(
				(a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title),
			);
		case 'newest':
		default:
			// 서버에서 이미 최신순으로 정렬된 순서(number)를 그대로 쓴다.
			return list.sort((a, b) => a.number - b.number);
	}
}

// 카테고리 선택지: 중복 제거 후 이름순. 개수는 화면에 표시하지 않는다.
export function buildCategories(projects) {
	return Array.from(new Set(projects.map((p) => p.category))).sort((a, b) => a.localeCompare(b));
}

// 보기 설정이 닫혀 있을 때 버튼 옆에 보여 줄 기본값이 아닌 설정 요약.
export function summarizeSettings({ category, sort, view }) {
	const parts = [];
	if (category !== DEFAULT_SETTINGS.category) parts.push(category);
	if (sort !== DEFAULT_SETTINGS.sort) {
		parts.push(SORT_OPTIONS.find((option) => option.value === sort)?.label ?? sort);
	}
	if (view !== DEFAULT_SETTINGS.view) parts.push('목록 보기');
	return parts.join(' · ');
}

export function padNumber(number) {
	return String(number).padStart(2, '0');
}
