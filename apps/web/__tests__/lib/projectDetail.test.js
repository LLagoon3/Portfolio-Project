import {
	RELATED_LIMIT,
	buildGallery,
	buildImpact,
	buildLinks,
	buildMoreProjects,
	buildStackGroups,
	parseProcessSteps,
	pickCoverImage,
	pickQuote,
} from '../../lib/projectDetail';

// localeCompare() 는 실행 환경 기본 로케일을 따른다. 서버(en) 정렬을 고정해 기대 순서를 명확히 한다.
const nativeLocaleCompare = String.prototype.localeCompare;
function useDefaultCollation(locale) {
	// eslint-disable-next-line no-extend-native
	String.prototype.localeCompare = function localeCompare(that) {
		return nativeLocaleCompare.call(this, that, locale);
	};
}

beforeEach(() => useDefaultCollation('en'));
afterEach(() => {
	String.prototype.localeCompare = nativeLocaleCompare; // eslint-disable-line no-extend-native
});

describe('parseProcessSteps', () => {
	it('본문이 있는 항목만 순서대로 남기고 kind / title 은 trim, 빈 title 은 메모', () => {
		expect(
			parseProcessSteps([
				{ id: 1, kind: ' CONTEXT ', title: ' 제목 ', details: '  본문  ' },
				{ id: 2, kind: 'SKIP', title: '빈 본문', details: '   ' },
				{ id: 3, kind: '', title: '', details: '- 목록' },
				{ id: 4, details: null },
			]),
		).toEqual([
			{ key: 1, kind: 'CONTEXT', title: '제목', body: '본문' },
			{ key: 3, kind: null, title: '메모', body: '- 목록' },
		]);
	});

	it('배열이 아니면 빈 배열', () => {
		expect(parseProcessSteps(undefined)).toEqual([]);
		expect(parseProcessSteps(null)).toEqual([]);
	});
});

describe('buildGallery / pickCoverImage', () => {
	const project = {
		title: '사내 운영 자동화 MCP 플랫폼',
		ProjectImages: [
			{ id: 1, title: '대표', img: '/uploads/cover.jpg' },
			{ id: 2, title: '사내 운영 자동화 MCP 플랫폼', img: '/uploads/a.jpg' },
			{ id: 3, title: 'Grafana 대시보드', img: '/uploads/b.jpg' },
			{ id: 4, title: '', img: '/uploads/c.jpg' },
			{ id: 5, title: '경로 없음', img: '' },
		],
	};

	it('첫 이미지는 표지, 나머지는 갤러리 (경로 없는 항목 제외)', () => {
		expect(pickCoverImage(project)).toBe('/uploads/cover.jpg');
		expect(buildGallery(project).map((image) => image.src)).toEqual([
			'/uploads/a.jpg',
			'/uploads/b.jpg',
			'/uploads/c.jpg',
		]);
	});

	it('프로젝트 제목과 같거나 빈 이미지 제목은 캡션 없이 "<제목> 화면 n" 으로 부름', () => {
		expect(buildGallery(project).map(({ caption, name }) => [caption, name])).toEqual([
			['', '사내 운영 자동화 MCP 플랫폼 화면 1'],
			['Grafana 대시보드', 'Grafana 대시보드'],
			['', '사내 운영 자동화 MCP 플랫폼 화면 3'],
		]);
	});

	it('이미지가 없거나 표지 하나뿐이면 갤러리는 비어 있음', () => {
		expect(pickCoverImage({ ProjectImages: [] })).toBe('');
		expect(buildGallery({ ProjectImages: [] })).toEqual([]);
		expect(buildGallery({ title: 'x', ProjectImages: [{ img: '/uploads/only.jpg' }] })).toEqual([]);
		expect(buildGallery({})).toEqual([]);
	});
});

describe('buildStackGroups', () => {
	it('그룹이 하나뿐이고 admin 기본 제목이면 제목을 숨김', () => {
		expect(buildStackGroups([{ title: 'Tools & Technologies', techs: ['Node.js', ' ', 'NestJS'] }])).toEqual([
			{ key: 'Tools & Technologies-0', title: '', techs: ['Node.js', 'NestJS'] },
		]);
	});

	it('구체적인 제목, 여러 그룹의 제목은 유지하고 빈 그룹은 제외', () => {
		expect(buildStackGroups([{ id: 7, title: 'Backend', techs: ['NestJS'] }])[0].title).toBe('Backend');
		expect(
			buildStackGroups([
				{ title: 'Tools & Technologies', techs: ['Docker'] },
				{ title: 'Empty', techs: [] },
				{ title: 'Data', techs: ['MSSQL'] },
			]).map((group) => [group.title, group.techs]),
		).toEqual([
			['Tools & Technologies', ['Docker']],
			['Data', ['MSSQL']],
		]);
		expect(buildStackGroups(undefined)).toEqual([]);
	});
});

describe('buildImpact / buildLinks / pickQuote', () => {
	it('결과 값 / 라벨 / 보조 설명을 그대로 두고 완전히 빈 항목만 제외', () => {
		expect(
			buildImpact([
				{ id: 1, label: '재고 조회', value: '-64.4%', sub: 'median 1,381.3ms → 492.0ms' },
				{ id: 2, label: '', value: '', sub: '설명만' },
				{ id: 3, label: 'Tests', value: 'Yes', sub: null },
			]),
		).toEqual([
			{ key: 1, value: '-64.4%', label: '재고 조회', sub: 'median 1,381.3ms → 492.0ms' },
			{ key: 3, value: 'Yes', label: 'Tests', sub: '' },
		]);
	});

	it('링크는 URL 이 있는 항목만, 라벨이 없으면 URL 로 표시', () => {
		expect(
			buildLinks([
				{ id: 1, label: 'Repository', url: 'https://github.com/x' },
				{ id: 2, label: '', url: 'https://example.com' },
				{ id: 3, label: '빈 URL', url: '' },
			]),
		).toEqual([
			{ key: 1, url: 'https://github.com/x', label: 'Repository' },
			{ key: 2, url: 'https://example.com', label: 'https://example.com' },
		]);
	});

	it('회고는 본문이 있을 때만', () => {
		expect(pickQuote({ text: ' 회고 ', author: '프로젝트 회고' })).toEqual({ text: '회고', author: '프로젝트 회고' });
		expect(pickQuote({ text: '본문', author: null })).toEqual({ text: '본문', author: '' });
		expect(pickQuote({ text: '  ' })).toBeNull();
		expect(pickQuote(null)).toBeNull();
	});
});

describe('buildMoreProjects', () => {
	// /api/projects 응답 순서(id 오름차순) 그대로.
	const list = [
		['internal-operations-mcp-platform', '사내 운영 자동화 MCP 플랫폼', 'MCP / Operations Automation', '2026.04 – 진행 중'],
		['classup-pre-consultation', '클래스업 - 사전 상담 기능', 'Backend', '2025.10 – 2025.12'],
		['custom-web-framework', '커스텀 웹 프레임워크', 'Low-level', '2025.03 – 2025.06'],
		['daiso-mcp-contribution', 'DAISO MCP 오픈소스 기여', 'Open Source Contribution', '2026.05'],
		['openclaw-contribution', 'OpenClaw 오픈소스 기여', 'Open Source Contribution', '2026.05'],
		['agent-messenger-contribution', 'agent-messenger 오픈소스 기여', 'Open Source Contribution', '2026.06'],
		['manufacturing-pop-monitoring', '제조 공정 POP 모니터링 시스템', 'Backend / Manufacturing / Performance', '2026.01 – 2026.08'],
	].map(([url, title, category, headerPublishDate], i) => ({ id: i + 1, url, title, category, img: '', headerPublishDate }));
	// en 기본 로케일의 목록 최신순:
	// agent-messenger, DAISO, OpenClaw, 사내 MCP, 제조 POP, 커스텀 웹, 클래스업
	const project = (url) => list.find((p) => p.url === url);
	const rows = (url) => buildMoreProjects(project(url), list).map((row) => [row.relation, row.url]);

	it('같은 카테고리(API 순서) 다음에 목록 최신순의 이전 / 다음을 붙이고 중복은 제외', () => {
		expect(rows('openclaw-contribution')).toEqual([
			['related', 'daiso-mcp-contribution'],
			['related', 'agent-messenger-contribution'],
			['next', 'internal-operations-mcp-platform'],
		]);
		expect(rows('manufacturing-pop-monitoring')).toEqual([
			['previous', 'internal-operations-mcp-platform'],
			['next', 'custom-web-framework'],
		]);
	});

	it('목록 처음 / 끝은 한쪽 이웃만', () => {
		expect(rows('agent-messenger-contribution')).toEqual([
			['related', 'daiso-mcp-contribution'],
			['related', 'openclaw-contribution'],
		]);
		expect(rows('classup-pre-consultation')).toEqual([['previous', 'custom-web-framework']]);
	});

	it('행에는 화면에 필요한 값만 담고 연도는 parseYear 로 계산', () => {
		expect(buildMoreProjects(project('manufacturing-pop-monitoring'), list)[0]).toEqual({
			relation: 'previous',
			url: 'internal-operations-mcp-platform',
			title: '사내 운영 자동화 MCP 플랫폼',
			category: 'MCP / Operations Automation',
			year: '2026',
		});
	});

	it(`같은 카테고리는 최대 ${RELATED_LIMIT}개`, () => {
		const many = Array.from({ length: 7 }, (_, i) => ({
			url: `p${i}`,
			title: `Project ${i}`,
			category: 'Same',
			headerPublishDate: '2020.01',
		}));
		const result = buildMoreProjects(many[0], many);
		expect(result.filter((row) => row.relation === 'related')).toHaveLength(RELATED_LIMIT);
		// 이웃(p1)은 이미 같은 카테고리로 나왔으므로 반복하지 않는다.
		expect(result.map((row) => row.url)).toEqual(['p1', 'p2', 'p3', 'p4']);
	});

	it('목록이 비었거나 현재 프로젝트가 목록에 없으면 같은 카테고리만 / 빈 배열', () => {
		expect(buildMoreProjects(project('openclaw-contribution'), [])).toEqual([]);
		expect(buildMoreProjects(project('openclaw-contribution'), null)).toEqual([]);
		const missing = { url: 'hidden', title: '숨김', category: 'Backend' };
		expect(buildMoreProjects(missing, list).map((row) => [row.relation, row.url])).toEqual([
			['related', 'classup-pre-consultation'],
		]);
		expect(buildMoreProjects({ url: 'x', title: 'x' }, list)).toEqual([]);
	});
});
