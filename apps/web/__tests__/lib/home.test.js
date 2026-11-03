import {
	ABOUT_SUMMARY_FALLBACK,
	HOME_PROJECT_LIMIT,
	pickAboutSummary,
	selectHomeProjects,
} from '../../lib/home';

const projects = Array.from({ length: 8 }, (_, i) => ({
	id: i + 1,
	url: `p-${i + 1}`,
	title: `Project ${i + 1}`,
	category: i === 6 ? 'Open Source' : 'Backend',
}));

describe('selectHomeProjects', () => {
	it('검색어가 없으면 API 순서 그대로 앞의 6개와 원래 번호를 반환', () => {
		const result = selectHomeProjects(projects, '');
		expect(HOME_PROJECT_LIMIT).toBe(6);
		expect(result.map((r) => r.project.id)).toEqual([1, 2, 3, 4, 5, 6]);
		expect(result.map((r) => r.number)).toEqual([1, 2, 3, 4, 5, 6]);
	});

	it('검색은 전체 목록의 제목/카테고리에서 대소문자 무시로 찾고 원래 번호를 유지', () => {
		const result = selectHomeProjects(projects, '  open SOURCE ');
		expect(result).toEqual([{ project: projects[6], number: 7 }]);
		expect(selectHomeProjects(projects, 'project 3').map((r) => r.number)).toEqual([3]);
	});

	it('일치 항목이 많아도 limit 까지만 반환', () => {
		expect(selectHomeProjects(projects, 'backend')).toHaveLength(6);
		expect(selectHomeProjects(projects, 'backend', 2)).toHaveLength(2);
	});

	it('배열이 아니거나 빈 값이 섞여도 안전하게 처리', () => {
		expect(selectHomeProjects(null, 'x')).toEqual([]);
		expect(selectHomeProjects([null, { title: 'A' }], 'a')).toEqual([
			{ project: { title: 'A' }, number: 1 },
		]);
		expect(selectHomeProjects([{ title: 'A' }], 'zzz')).toEqual([]);
	});
});

describe('pickAboutSummary', () => {
	it('제목과 겹치는 첫 단락 대신 두 번째 설명 단락을 사용', () => {
		expect(pickAboutSummary(['한 줄 소개', '설명 단락', '성과 단락'])).toBe('설명 단락');
	});

	it('마크다운 제목 줄과 굵게 표시를 걷어낸 평문으로 반환', () => {
		expect(
			pickAboutSummary(['## 소개\n한 줄', '## 2. 설명\n**성능**과 정합성을\n함께 봅니다.']),
		).toBe('성능과 정합성을 함께 봅니다.');
	});

	it('설명 단락이 없으면 공개 소개 문장으로 대체', () => {
		expect(pickAboutSummary(null)).toBe(ABOUT_SUMMARY_FALLBACK);
		expect(pickAboutSummary([])).toBe(ABOUT_SUMMARY_FALLBACK);
		expect(pickAboutSummary(['한 줄 소개'])).toBe(ABOUT_SUMMARY_FALLBACK);
		expect(pickAboutSummary(['한 줄 소개', '   ', null])).toBe(ABOUT_SUMMARY_FALLBACK);
	});
});
