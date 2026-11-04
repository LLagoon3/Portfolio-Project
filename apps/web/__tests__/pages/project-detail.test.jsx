import '@testing-library/jest-dom';
import { StrictMode } from 'react';
// jsdom 에는 TextEncoder 가 없어 Node 용 서버 렌더러를 직접 쓴다.
import { renderToString } from 'react-dom/server.node';
import { hydrateRoot } from 'react-dom/client';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import ReactMarkdown from 'react-markdown';
import ProjectDetailPage, { getServerSideProps } from '../../pages/projects/[url]';
import { MarkdownLink } from '../../components/projects/minimal/detail/ProjectDetailMarkdown';
import { act, byText, cleanup, click, render } from '../helpers/render';

// react-markdown 은 ESM 전용이라 Jest(CommonJS) 에서 직접 불러올 수 없다. 본문 전달과
// 컴포넌트 매핑(링크 / 제목 수준)만 확인하고, 실제 Markdown 결과는 브라우저 검증에서 본다.
jest.mock('react-markdown', () => {
	const React = require('react');
	return {
		__esModule: true,
		default: jest.fn(({ children }) => React.createElement('div', { 'data-markdown': '' }, children)),
	};
});

// /api/projects/<slug> 응답 모양 (POP 프로젝트 기반, 링크 / 다중 기술 그룹 / Markdown 을 보강).
const pop = {
	id: 10,
	title: '제조 공정 POP 모니터링 시스템',
	url: 'manufacturing-pop-monitoring',
	category: 'Backend / Manufacturing / Performance',
	img: '/uploads/list-cover.jpg',
	heroAccentWord: '시스템',
	heroRole: '백엔드 · 단독 담당',
	heroClient: '현대에버다임',
	ProjectHeader: { title: '제조 공정 POP 모니터링 시스템', publishDate: '2026.01 – 2026.08' },
	ProjectImages: [
		{ id: 145, title: 'POP 모니터링 대표 화면', img: '/uploads/cover.jpg' },
		{ id: 146, title: '생산현황 종합 모니터링', img: '/uploads/g1.jpg' },
		{ id: 147, title: '제조 공정 POP 모니터링 시스템', img: '/uploads/g2.jpg' },
		{ id: 148, title: '호기별 진도현황', img: '/uploads/g3.jpg' },
	],
	ProjectInfo: {
		ObjectivesDetails: '첫 단락 개요입니다.\n\n둘째 단락은 개요에 나오지 않습니다.',
		Technologies: [
			{ title: 'Backend', techs: ['Node.js', 'NestJS'] },
			{ title: 'Ops', techs: ['Docker Compose'] },
			{ title: '빈 그룹', techs: [] },
		],
		ProjectDetails: [
			{ id: 1, kind: 'CONTEXT', title: 'MES 데이터를 지표로 변환', details: '현장 데이터를 재구성했습니다.' },
			{ id: 2, kind: '', title: '', details: '- 목록 항목\n- [링크](https://example.com/a)' },
			{ id: 3, kind: 'EMPTY', title: '빈 본문', details: '  ' },
			{
				id: 4,
				kind: 'PERFORMANCE',
				title: '저장 프로시저 이관',
				details: '이 수치는 전체 API가 아니라 해당 재고 조회에 한정된 실측 결과입니다.',
			},
		],
		Impact: [
			{ id: 97, label: '재고 조회', value: '-64.4%', sub: 'median 1,381.3ms → 492.0ms' },
			{ id: 98, label: '독립 쿼리', value: '-52.2%', sub: 'median 1,495.8ms → 714.3ms' },
		],
		Quote: { text: '결과 동등성을 먼저 검증했습니다.', author: '프로젝트 회고' },
		Links: [{ id: 1, label: 'Repository', url: 'https://github.com/LLagoon3/example' }],
	},
};

// 다른 프로젝트 계산용 /api/projects 응답 (id 오름차순).
const list = [
	['internal-operations-mcp-platform', '사내 운영 자동화 MCP 플랫폼', 'MCP / Operations Automation', '2026.04 – 진행 중'],
	['custom-web-framework', '커스텀 웹 프레임워크', 'Low-level', '2025.03 – 2025.06'],
	['perf-tuning', '성능 튜닝', 'Backend / Manufacturing / Performance', '2024.01'],
	['manufacturing-pop-monitoring', '제조 공정 POP 모니터링 시스템', 'Backend / Manufacturing / Performance', '2026.01 – 2026.08'],
	['agent-messenger-contribution', 'agent-messenger 오픈소스 기여', 'Open Source Contribution', '2026.06'],
].map(([url, title, category, headerPublishDate], i) => ({ id: i + 1, url, title, category, img: '', headerPublishDate }));

const nativeLocaleCompare = String.prototype.localeCompare;
function useDefaultCollation(locale) {
	// eslint-disable-next-line no-extend-native
	String.prototype.localeCompare = function localeCompare(that) {
		return nativeLocaleCompare.call(this, that, locale);
	};
}

const json = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => data });

// URL 별로 응답을 고른다. detail / list 는 응답 객체 또는 Error(=네트워크 실패).
function mockApi({ detail = json({ data: pop }), projects = json({ data: list }) } = {}) {
	const respond = (value) => (value instanceof Error ? Promise.reject(value) : Promise.resolve(value));
	global.fetch = jest.fn((url) => respond(/\/api\/projects$/.test(url) ? projects : detail));
}

async function loadProps(options) {
	mockApi(options);
	return getServerSideProps({ query: { url: 'manufacturing-pop-monitoring' } });
}

let router;
function makeRouter() {
	return {
		pathname: '/projects/[url]',
		route: '/projects/[url]',
		asPath: '/projects/manufacturing-pop-monitoring',
		basePath: '',
		query: { url: 'manufacturing-pop-monitoring' },
		isReady: true,
		isLocaleDomain: false,
		push: jest.fn(() => Promise.resolve(true)),
		replace: jest.fn(() => Promise.resolve(true)),
		prefetch: jest.fn(() => Promise.resolve()),
		beforePopState: jest.fn(),
		events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
	};
}

function page(pageProps) {
	return (
		<RouterContext.Provider value={router}>
			{ProjectDetailPage.getLayout(<ProjectDetailPage {...pageProps} />)}
		</RouterContext.Provider>
	);
}

const renderPage = (pageProps) => render(page(pageProps));
const sectionIds = (container) => Array.from(container.querySelectorAll('main section[id]')).map((s) => s.id);
const tocLinks = (container) =>
	Array.from(container.querySelectorAll('nav[aria-labelledby="project-toc-label"] a')).map((a) => [
		a.getAttribute('href'),
		a.textContent,
	]);

// jsdom 에 modal dialog 동작이 없으면 최소한으로 흉내 낸다 (open 속성 + close 이벤트).
const dialogProto = HTMLDialogElement.prototype;
const originalDialog = { showModal: dialogProto.showModal, close: dialogProto.close };
beforeAll(() => {
	dialogProto.showModal = function showModal() {
		this.setAttribute('open', '');
	};
	dialogProto.close = function close() {
		if (!this.hasAttribute('open')) return;
		this.removeAttribute('open');
		this.dispatchEvent(new Event('close'));
	};
});
afterAll(() => {
	Object.assign(dialogProto, originalDialog);
});

// 모바일 메뉴 폭 판단(matchMedia)을 흉내 낸다. set(false) 는 데스크톱 폭으로 넓어진 것.
function mockViewport(mobile) {
	const listeners = new Set();
	const query = {
		matches: mobile,
		addEventListener: (type, fn) => listeners.add(fn),
		removeEventListener: (type, fn) => listeners.delete(fn),
	};
	window.matchMedia = jest.fn(() => query);
	return {
		set(matches) {
			query.matches = matches;
			act(() => listeners.forEach((fn) => fn({ matches })));
		},
	};
}

let props;

beforeEach(async () => {
	useDefaultCollation('en');
	localStorage.clear();
	document.documentElement.className = '';
	document.documentElement.removeAttribute('style');
	jest.spyOn(console, 'error').mockImplementation(() => {});
	router = makeRouter();
	({ props } = await loadProps());
});

afterEach(() => {
	cleanup();
	String.prototype.localeCompare = nativeLocaleCompare; // eslint-disable-line no-extend-native
	jest.restoreAllMocks();
	delete global.fetch;
	delete window.matchMedia;
});

describe('getServerSideProps', () => {
	it('상세와 목록을 함께 요청하고 다른 프로젝트를 서버에서 계산', async () => {
		const urls = global.fetch.mock.calls.map(([url]) => url);
		expect(urls).toEqual(
			expect.arrayContaining([
				expect.stringMatching(/\/api\/projects\/manufacturing-pop-monitoring$/),
				expect.stringMatching(/\/api\/projects$/),
			]),
		);
		expect(props.project).toEqual(pop);
		// 같은 카테고리(API 순서) → en 최신순 이웃: agent-messenger, 사내 MCP, 제조 POP, 커스텀 웹, 성능 튜닝
		expect(props.moreProjects).toEqual([
			{ relation: 'related', url: 'perf-tuning', title: '성능 튜닝', category: pop.category, year: '2024' },
			{
				relation: 'previous',
				url: 'internal-operations-mcp-platform',
				title: '사내 운영 자동화 MCP 플랫폼',
				category: 'MCP / Operations Automation',
				year: '2026',
			},
			{ relation: 'next', url: 'custom-web-framework', title: '커스텀 웹 프레임워크', category: 'Low-level', year: '2025' },
		]);
		expect(console.error).not.toHaveBeenCalled();
	});

	it('슬러그는 경로 조각으로 인코딩해 요청', async () => {
		mockApi();
		await getServerSideProps({ query: { url: 'a b?c' } });
		expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/projects\/a%20b%3Fc$/));
	});

	it('404 와 data 없는 응답은 notFound', async () => {
		await expect(loadProps({ detail: json({ message: 'not found' }, 404) })).resolves.toEqual({ notFound: true });
		await expect(loadProps({ detail: json({}) })).resolves.toEqual({ notFound: true });
	});

	it('상세 API 5xx / 네트워크 오류는 404 로 감추지 않고 에러로 드러냄', async () => {
		await expect(loadProps({ detail: json({}, 503) })).rejects.toThrow('[project detail] API returned 503');
		await expect(loadProps({ detail: new Error('ECONNREFUSED') })).rejects.toThrow('ECONNREFUSED');
		expect(console.error).toHaveBeenCalledWith('[project detail] fetch failed', expect.any(Error));
	});

	it.each([
		['5xx', json({}, 500)],
		['네트워크 오류', new Error('ECONNRESET')],
		['잘못된 JSON', { ok: true, status: 200, json: async () => JSON.parse('{') }],
	])('목록 API %s 는 상세를 막지 않고 다른 프로젝트만 비움', async (_, projects) => {
		const result = await loadProps({ projects });
		expect(result).toEqual({ props: { project: pop, moreProjects: [] } });
		expect(console.error).toHaveBeenCalledWith('[project detail] fetch project list failed', expect.any(Error));
	});

	it('목록 data 가 배열이 아니면 다른 프로젝트 없이 렌더', async () => {
		await expect(loadProps({ projects: json({ data: null }) })).resolves.toEqual({
			props: { project: pop, moreProjects: [] },
		});
	});
});

describe('레이아웃', () => {
	it('목록과 같은 정적 레이아웃: Projects 는 표시만 하고 aria-current 는 없음', () => {
		expect(ProjectDetailPage.minimalShell).toBe(true);
		const { container } = renderPage(props);
		const nav = container.querySelector('nav[aria-label="주 메뉴"]');
		const links = Array.from(nav.querySelectorAll('a'));
		expect(links.map((a) => a.getAttribute('href'))).toEqual(['/projects', '/about', '/contact']);
		expect(container.querySelector('header [aria-current]')).toBeNull();
		expect(links[0].className).toMatch(/isSection/);
		expect(container.querySelector('#projects-mobile-nav a').className).toMatch(/isSection/);
		expect(byText(container, 'a', '본문으로 바로 가기')).toHaveAttribute('href', '#main');
		expect(container.querySelector('footer')).toHaveTextContent('함께할 기회를 기다립니다');
		expect(container.querySelector('.bold-root, .bold-grain, .bold-interactive')).toBeNull();
	});

	it('데스크톱 폭이 되면 모바일 메뉴를 닫고 포커스를 데스크톱 Projects 표시 링크로 (aria-current 없음)', () => {
		const viewport = mockViewport(true);
		const { container } = renderPage(props);
		const mobileNav = container.querySelector('#projects-mobile-nav');
		click(container.querySelector('button[aria-controls="projects-mobile-nav"]'));
		act(() => byText(mobileNav, 'a', 'Projects').focus());
		viewport.set(false);
		expect(mobileNav).toHaveAttribute('hidden');
		const desktopProjects = byText(container.querySelector('nav[aria-label="주 메뉴"]'), 'a', 'Projects');
		expect(document.activeElement).toBe(desktopProjects);
		expect(desktopProjects.className).toMatch(/isSection/);
		expect(container.querySelector('header [aria-current]')).toBeNull();
	});
});

describe('본문', () => {
	it('사실 목록 / 링크 / 표지: 있는 값만, 외부 링크는 새 탭 안내', () => {
		const { container } = renderPage(props);
		expect(container.querySelectorAll('h1')).toHaveLength(1);
		expect(container.querySelector('h1')).toHaveTextContent('제조 공정 POP 모니터링 시스템');
		expect(byText(container, 'a', '프로젝트 목록')).toHaveAttribute('href', '/projects');

		const facts = Array.from(container.querySelectorAll('dl dt')).slice(0, 5);
		expect(facts.map((dt) => [dt.textContent, dt.nextElementSibling.textContent])).toEqual([
			['클라이언트', '현대에버다임'],
			['역할', '백엔드 · 단독 담당'],
			['기간', '2026.01 – 2026.08'],
			['카테고리', 'Backend / Manufacturing / Performance'],
			['링크', 'Repository (새 탭)'],
		]);
		const link = byText(container, 'a', 'Repository (새 탭)');
		expect(link).toHaveAttribute('href', 'https://github.com/LLagoon3/example');
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');

		const cover = container.querySelector('figure img[alt="제조 공정 POP 모니터링 시스템 표지 이미지"]');
		expect(decodeURIComponent(cover.getAttribute('src'))).toContain('/uploads/cover.jpg');
		// 강조 단어 / eyebrow / 카운터 같은 장식은 없다.
		['Selected Work', 'SELECTED', '— Overview', 'Next Up', '모든 프로젝트'].forEach((text) =>
			expect(container.textContent).not.toContain(text),
		);
	});

	it('섹션은 개요 → 화면 → 과정 → 결과 → 기술 → 회고 → 다른 프로젝트, 목차가 같은 섹션을 가리킴', () => {
		const { container } = renderPage(props);
		expect(sectionIds(container)).toEqual(['overview', 'gallery', 'process', 'impact', 'stack', 'quote', 'more']);
		expect(tocLinks(container)).toEqual([
			['#overview', '개요'],
			['#gallery', '화면'],
			['#process', '과정'],
			['#impact', '결과'],
			['#stack', '기술'],
			['#quote', '회고'],
			['#more', '다른 프로젝트'],
		]);
		// 서버 HTML(첫 렌더)의 현재 섹션은 첫 섹션. jsdom 은 문서 높이가 0 이라 마운트 후에는
		// '문서 끝' 규칙에 따라 마지막 섹션이 현재 섹션이 된다.
		const server = document.createElement('div');
		server.innerHTML = renderToString(page(props));
		expect(server.querySelectorAll('[aria-current="true"]')).toHaveLength(1);
		expect(server.querySelector('nav[aria-labelledby="project-toc-label"] a[aria-current="true"]')).toHaveTextContent('개요');
		expect(container.querySelector('nav[aria-labelledby="project-toc-label"] a[aria-current="true"]')).toHaveTextContent(
			'다른 프로젝트',
		);
		// 회고 제목은 작성자 표기와 겹치지 않게 보조기기용으로만 둔다.
		expect(container.querySelector('#quote-title').className).toMatch(/srOnly/);
		expect(container.querySelector('#overview-title')).toHaveTextContent('개요');
	});

	it('개요는 첫 단락만, 과정은 본문 있는 단계 전부를 Markdown 으로 (빈 kind/title 은 메모)', () => {
		const { container } = renderPage(props);
		expect(container.querySelector('#overview p')).toHaveTextContent(/^첫 단락 개요입니다\.$/);
		expect(container.textContent).not.toContain('둘째 단락');

		const steps = Array.from(container.querySelectorAll('#process li article'));
		expect(steps.map((step) => step.querySelector('h3').textContent)).toEqual([
			'MES 데이터를 지표로 변환',
			'메모',
			'저장 프로시저 이관',
		]);
		expect(steps.map((step) => step.querySelector('h3').previousElementSibling?.textContent ?? null)).toEqual([
			'CONTEXT',
			null,
			'PERFORMANCE',
		]);
		expect(ReactMarkdown.mock.calls.map(([{ children }]) => children)).toEqual(
			expect.arrayContaining([
				'현장 데이터를 재구성했습니다.',
				'- 목록 항목\n- [링크](https://example.com/a)',
				'이 수치는 전체 API가 아니라 해당 재고 조회에 한정된 실측 결과입니다.',
			]),
		);
		expect(steps[2]).toHaveTextContent('이 수치는 전체 API가 아니라 해당 재고 조회에 한정된 실측 결과입니다.');
	});

	it('Markdown 링크는 외부면 새 탭 + 안전한 rel, 제목은 h4 로 낮춤', () => {
		renderPage(props);
		const { components } = ReactMarkdown.mock.calls[0][0];
		expect(components.a).toBe(MarkdownLink);
		const { container } = render(
			<div>
				<MarkdownLink href="https://example.com/a" node={{}}>
					외부
				</MarkdownLink>
				<MarkdownLink href="#impact">내부</MarkdownLink>
				{components.h1({ node: {}, children: '제목' })}
				{components.h2({ children: '제목2' })}
			</div>,
		);
		const external = byText(container, 'a', '외부 (새 탭)');
		expect(external).toHaveAttribute('target', '_blank');
		expect(external).toHaveAttribute('rel', 'noopener noreferrer');
		expect(external).not.toHaveAttribute('node');
		const internal = byText(container, 'a', '내부');
		expect(internal).not.toHaveAttribute('target');
		expect(container.querySelectorAll('h4')).toHaveLength(2);
		expect(container.querySelector('h1, h2')).toBeNull();
	});

	it('결과 / 기술 / 회고 / 다른 프로젝트를 API 값 그대로', () => {
		const { container } = renderPage(props);
		const stats = Array.from(container.querySelectorAll('#impact dl > div')).map((stat) =>
			Array.from(stat.children).map((el) => el.textContent),
		);
		expect(stats).toEqual([
			['재고 조회', '-64.4%', 'median 1,381.3ms → 492.0ms'],
			['독립 쿼리', '-52.2%', 'median 1,495.8ms → 714.3ms'],
		]);

		const groups = Array.from(container.querySelectorAll('#stack h3')).map((h) => h.textContent);
		expect(groups).toEqual(['Backend', 'Ops']);
		expect(Array.from(container.querySelectorAll('#stack li')).map((li) => li.textContent)).toEqual([
			'Node.js',
			'NestJS',
			'Docker Compose',
		]);

		expect(container.querySelector('#quote blockquote')).toHaveTextContent('결과 동등성을 먼저 검증했습니다.');
		expect(container.querySelector('#quote figcaption')).toHaveTextContent('프로젝트 회고');

		const more = Array.from(container.querySelectorAll('#more a')).map((a) => [
			a.getAttribute('href'),
			Array.from(a.querySelectorAll('span')).map((s) => s.textContent),
		]);
		expect(more).toEqual([
			['/projects/perf-tuning', ['같은 카테고리', '성능 튜닝', 'Backend / Manufacturing / Performance', '2024']],
			['/projects/internal-operations-mcp-platform', ['이전 프로젝트', '사내 운영 자동화 MCP 플랫폼', 'MCP / Operations Automation', '2026']],
			['/projects/custom-web-framework', ['다음 프로젝트', '커스텀 웹 프레임워크', 'Low-level', '2025']],
		]);
		click(container.querySelector('#more a[href="/projects/custom-web-framework"]'));
		expect(router.push).toHaveBeenLastCalledWith(
			'/projects/custom-web-framework',
			'/projects/custom-web-framework',
			expect.any(Object),
		);
	});

	it('기술 그룹이 하나뿐이고 기본 제목이면 제목을 숨김', () => {
		const project = {
			...pop,
			ProjectInfo: { ...pop.ProjectInfo, Technologies: [{ title: 'Tools & Technologies', techs: ['Jest'] }] },
		};
		const { container } = renderPage({ project, moreProjects: [] });
		expect(container.querySelector('#stack h3')).toBeNull();
		expect(container.querySelector('#stack li')).toHaveTextContent('Jest');
	});

	it('없는 값은 빈 섹션 / 목차 / 사실 행 없이 생략', () => {
		const project = {
			title: '최소 프로젝트',
			url: 'minimal',
			category: '',
			heroClient: null,
			heroRole: null,
			ProjectHeader: { publishDate: '' },
			ProjectImages: [],
			ProjectInfo: { ObjectivesDetails: '', Technologies: [], ProjectDetails: [], Impact: [], Quote: null, Links: [] },
		};
		const { container } = renderPage({ project, moreProjects: [] });
		expect(container.querySelector('h1')).toHaveTextContent('최소 프로젝트');
		expect(container.querySelector('main dl')).toBeNull();
		expect(container.querySelector('main figure')).toBeNull();
		expect(container.querySelector('section[aria-labelledby="project-title"]').className).toMatch(/heroNoCover/);
		expect(sectionIds(container)).toEqual([]);
		expect(container.querySelector('nav[aria-labelledby="project-toc-label"]')).toBeNull();
		expect(container.querySelector('main h2')).toBeNull();
	});

	it('섹션이 하나면 목차 없이, 표지만 있으면 갤러리 없이', () => {
		const project = {
			...pop,
			ProjectImages: [pop.ProjectImages[0]],
			ProjectInfo: { ObjectivesDetails: '개요만 있습니다.' },
		};
		const { container } = renderPage({ project, moreProjects: [] });
		expect(sectionIds(container)).toEqual(['overview']);
		expect(container.querySelector('nav[aria-labelledby="project-toc-label"]')).toBeNull();
		expect(container.querySelector('#gallery, dialog')).toBeNull();
		expect(container.querySelector('figure img')).toHaveAttribute('alt', '제조 공정 POP 모니터링 시스템 표지 이미지');
	});
});

describe('화면과 이미지 보기', () => {
	const triggers = (container) => Array.from(container.querySelectorAll('#gallery figure button'));
	const dialog = (container) => container.querySelector('dialog');
	const closeButton = (container) => container.querySelector('dialog button[aria-label="닫기"]');

	function pressOn(target, key, init = {}) {
		const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
		act(() => {
			target.dispatchEvent(event);
		});
		return event;
	}

	it('표지를 뺀 모든 이미지를 원본 비율 버튼으로, 캡션은 이미지 제목이 다를 때만', () => {
		const { container } = renderPage(props);
		expect(triggers(container).map((b) => b.getAttribute('aria-label'))).toEqual([
			'생산현황 종합 모니터링 크게 보기',
			'제조 공정 POP 모니터링 시스템 화면 2 크게 보기',
			'호기별 진도현황 크게 보기',
		]);
		expect(Array.from(container.querySelectorAll('#gallery figcaption')).map((c) => c.textContent)).toEqual([
			'생산현황 종합 모니터링',
			'호기별 진도현황',
		]);
		const img = triggers(container)[0].querySelector('img');
		expect(img).toHaveAttribute('alt', '생산현황 종합 모니터링');
		expect(img.style.width).toBe('100%');
		expect(img.style.height).toBe('auto');
		expect(img.style.objectFit).toBe('');
		expect(dialog(container)).not.toHaveAttribute('open');
		expect(dialog(container).querySelector('img')).toBeNull();
	});

	it('열면 이름 있는 modal 에 원본 이미지, 닫기 버튼 포커스, Tab 은 안에 머묾, 스크롤 잠금', () => {
		const { container } = renderPage(props);
		const trigger = triggers(container)[2];
		trigger.focus();
		click(trigger);
		const viewer = dialog(container);
		expect(viewer).toHaveAttribute('open');
		const label = document.getElementById(viewer.getAttribute('aria-labelledby'));
		expect(label).toHaveTextContent('호기별 진도현황');
		expect(viewer.querySelector('img')).toHaveAttribute('src', '/uploads/g3.jpg');
		expect(viewer.querySelector('img')).toHaveAttribute('alt', '호기별 진도현황');
		expect(document.activeElement).toBe(closeButton(container));
		expect(document.documentElement.style.overflow).toBe('hidden');

		expect(pressOn(closeButton(container), 'Tab').defaultPrevented).toBe(true);
		pressOn(closeButton(container), 'Tab', { shiftKey: true });
		expect(document.activeElement).toBe(closeButton(container));
	});

	it('Escape 는 보기만 닫고 연 버튼으로 포커스 복귀 (열린 모바일 메뉴는 유지)', () => {
		const { container } = renderPage(props);
		const menuButton = container.querySelector('button[aria-controls="projects-mobile-nav"]');
		click(menuButton);
		const trigger = triggers(container)[1];
		click(trigger);
		const event = pressOn(closeButton(container), 'Escape');
		expect(event.defaultPrevented).toBe(true);
		expect(dialog(container)).not.toHaveAttribute('open');
		expect(dialog(container).querySelector('img')).toBeNull();
		expect(document.activeElement).toBe(trigger);
		expect(document.documentElement.style.overflow).toBe('');
		expect(menuButton).toHaveAttribute('aria-expanded', 'true');
	});

	it('닫기 버튼 / 바깥(배경) 클릭 / 브라우저 cancel 로 닫힘', () => {
		const { container } = renderPage(props);
		click(triggers(container)[0]);
		click(closeButton(container));
		expect(dialog(container)).not.toHaveAttribute('open');
		expect(document.activeElement).toBe(triggers(container)[0]);

		click(triggers(container)[0]);
		click(dialog(container).querySelector('img'));
		expect(dialog(container)).toHaveAttribute('open');
		click(dialog(container));
		expect(dialog(container)).not.toHaveAttribute('open');

		click(triggers(container)[0]);
		const cancel = new Event('cancel', { cancelable: true });
		act(() => {
			dialog(container).dispatchEvent(cancel);
		});
		expect(cancel.defaultPrevented).toBe(true);
		expect(dialog(container)).not.toHaveAttribute('open');
		expect(document.documentElement.style.overflow).toBe('');
	});

	it('StrictMode(개발 모드 이중 effect)에서도 열기 / 닫기 / 포커스 복귀가 한 번씩만', () => {
		const { container } = render(<StrictMode>{page(props)}</StrictMode>);
		const trigger = triggers(container)[0];
		click(trigger);
		expect(dialog(container)).toHaveAttribute('open');
		expect(document.activeElement).toBe(closeButton(container));
		pressOn(closeButton(container), 'Escape');
		expect(dialog(container)).not.toHaveAttribute('open');
		expect(document.activeElement).toBe(trigger);
		expect(document.documentElement.style.overflow).toBe('');
		click(trigger);
		expect(dialog(container)).toHaveAttribute('open');
		expect(document.documentElement.style.overflow).toBe('hidden');
	});

	it('열린 채로 언마운트(라우트 이동)되면 문서 스크롤 잠금을 되돌림', () => {
		document.documentElement.style.overflow = 'auto';
		const { container } = renderPage(props);
		click(triggers(container)[0]);
		expect(document.documentElement.style.overflow).toBe('hidden');
		cleanup();
		expect(document.documentElement.style.overflow).toBe('auto');
	});
});

describe('hydration', () => {
	it('브라우저 기본 로케일이 서버와 달라도 서버 HTML 과 같은 다른 프로젝트 순서로 hydrate', async () => {
		const html = renderToString(page(props));
		console.error.mockClear();
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.appendChild(container);
		const serverOrder = Array.from(container.querySelectorAll('#more a')).map((a) => a.getAttribute('href'));

		useDefaultCollation('ko');
		const recoverable = jest.fn();
		let root;
		await act(async () => {
			root = hydrateRoot(container, page(props), { onRecoverableError: recoverable });
		});
		expect(recoverable).not.toHaveBeenCalled();
		expect(console.error).not.toHaveBeenCalled();
		expect(Array.from(container.querySelectorAll('#more a')).map((a) => a.getAttribute('href'))).toEqual(serverOrder);

		act(() => root.unmount());
		container.remove();
	});
});
