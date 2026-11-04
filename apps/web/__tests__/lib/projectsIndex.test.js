import {
	DEFAULT_SETTINGS,
	applyFilters,
	buildCategories,
	decorateProjects,
	padNumber,
	sortProjectsForIndex,
	summarizeSettings,
} from '../../lib/projectsIndex';

// 같은 연도 안의 제목 비교가 스크립트(한글/라틴)에 따라 갈리지 않도록 한 가지 문자 체계로 구성한다.
const raw = [
	{ id: 1, title: 'Delta', category: 'Backend', headerPublishDate: '2025.03 – 2025.06' },
	{ id: 2, title: 'alpha', category: 'Realtime', headerPublishDate: '2026.01 – 진행 중' },
	{ id: 3, title: 'Charlie', category: 'Backend', headerPublishDate: 'TBD' },
	{ id: 4, title: 'Bravo', category: 'Low-level', headerPublishDate: '2025.10' },
	{ id: 5, title: 'Echo', category: 'Realtime', headerPublishDate: '2024.01 – 2024.05' },
];

const ids = (list) => list.map((p) => p.id);
const defaults = { category: 'all', search: '', sort: 'newest' };

describe('sortProjectsForIndex', () => {
	it('연도 내림차순 → 같은 연도는 제목순, 연도가 없으면 마지막', () => {
		expect(ids(sortProjectsForIndex(raw))).toEqual([2, 4, 1, 5, 3]);
	});

	it('원본 배열을 바꾸지 않고 API 필드를 그대로 유지', () => {
		const copy = raw.map((p) => ({ ...p }));
		const sorted = sortProjectsForIndex(raw);
		expect(raw).toEqual(copy);
		expect(sorted[0]).toBe(raw[1]);
		expect(sorted[0]).not.toHaveProperty('year');
	});
});

describe('decorateProjects', () => {
	it('props 순서대로 1부터 번호를 붙이고 parseYear 로 연도를 계산', () => {
		const decorated = decorateProjects(sortProjectsForIndex(raw));
		expect(decorated.map((p) => [p.id, p.number, p.year])).toEqual([
			[2, 1, '2026'],
			[4, 2, '2025'],
			[1, 3, '2025'],
			[5, 4, '2024'],
			[3, 5, ''],
		]);
	});
});

describe('applyFilters', () => {
	const decorated = decorateProjects(sortProjectsForIndex(raw));

	it('기본값은 서버가 정한 최신순 번호 순서를 그대로 사용', () => {
		expect(ids(applyFilters(decorated, defaults))).toEqual([2, 4, 1, 5, 3]);
	});

	it('오래된순 / 이름순 / 카테고리순은 기존 localeCompare 규칙을 따름', () => {
		expect(ids(applyFilters(decorated, { ...defaults, sort: 'oldest' }))).toEqual([3, 5, 4, 1, 2]);
		expect(ids(applyFilters(decorated, { ...defaults, sort: 'az' }))).toEqual([2, 4, 3, 1, 5]);
		expect(ids(applyFilters(decorated, { ...defaults, sort: 'cat' }))).toEqual([3, 1, 4, 2, 5]);
	});

	it('카테고리는 정확히 일치하는 항목만 남김', () => {
		expect(ids(applyFilters(decorated, { ...defaults, category: 'Backend' }))).toEqual([1, 3]);
	});

	it('검색은 제목/카테고리만 대소문자 없이 부분 일치 (앞뒤 공백 무시)', () => {
		expect(ids(applyFilters(decorated, { ...defaults, search: '  ALPHA ' }))).toEqual([2]);
		expect(ids(applyFilters(decorated, { ...defaults, search: 'real' }))).toEqual([2, 5]);
		// 연도/기간/ID 는 검색 대상이 아니다
		expect(applyFilters(decorated, { ...defaults, search: '2025' })).toEqual([]);
		expect(applyFilters(decorated, { ...defaults, search: 'TBD' })).toEqual([]);
	});

	it('검색 + 카테고리 + 정렬을 함께 적용해도 번호는 유지', () => {
		const result = applyFilters(decorated, { category: 'Realtime', search: 'o', sort: 'az' });
		expect(result.map((p) => [p.id, p.number])).toEqual([[5, 4]]);
	});

	it('입력 배열을 바꾸지 않음', () => {
		const before = ids(decorated);
		applyFilters(decorated, { ...defaults, sort: 'az' });
		expect(ids(decorated)).toEqual(before);
	});
});

describe('buildCategories', () => {
	it('중복을 제거한 카테고리 이름 목록 (이름순, 개수 없음)', () => {
		expect(buildCategories(decorateProjects(raw))).toEqual(['Backend', 'Low-level', 'Realtime']);
	});
});

describe('summarizeSettings', () => {
	it('기본값이면 빈 문자열', () => {
		expect(summarizeSettings(DEFAULT_SETTINGS)).toBe('');
	});

	it('기본값이 아닌 설정만 카테고리 · 정렬 · 보기 순서로 요약', () => {
		expect(summarizeSettings({ category: 'Backend', sort: 'newest', view: 'grid' })).toBe('Backend');
		expect(summarizeSettings({ category: 'all', sort: 'az', view: 'list' })).toBe('이름순 · 목록 보기');
		expect(summarizeSettings({ category: 'Realtime', sort: 'cat', view: 'list' })).toBe(
			'Realtime · 카테고리순 · 목록 보기',
		);
		expect(summarizeSettings({ category: 'all', sort: 'oldest', view: 'grid' })).toBe('오래된순');
	});
});

it('padNumber 는 두 자리로 맞춤', () => {
	expect(padNumber(3)).toBe('03');
	expect(padNumber(12)).toBe('12');
});
