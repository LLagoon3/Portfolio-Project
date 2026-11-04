import '@testing-library/jest-dom';
// jsdom 에는 TextEncoder 가 없어 Node 용 서버 렌더러를 직접 쓴다.
import { renderToString } from 'react-dom/server.node';
import { hydrateRoot } from 'react-dom/client';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import ReactMarkdown from 'react-markdown';
import AboutPage, { getServerSideProps } from '../../pages/about';
import { RESUME_URL } from '../../components/about/minimal/About';
import { AboutMarkdownLink } from '../../components/about/minimal/AboutMarkdown';
import { DEFAULT_TAGLINE } from '../../lib/about';
import { act, byText, cleanup, click, render } from '../helpers/render';

// react-markdown 은 ESM 전용이라 Jest(CommonJS) 에서 직접 불러올 수 없다. 단락 전달과
// 컴포넌트 매핑(링크 / 제목 수준)만 확인하고, 실제 Markdown 결과는 브라우저 검증에서 본다.
jest.mock('react-markdown', () => {
	const React = require('react');
	return {
		__esModule: true,
		default: jest.fn(({ children }) => React.createElement('p', { 'data-markdown': '' }, children)),
	};
});

// /api/about 공개 응답과 같은 모양. 화면에서 쓰지 않는 필드(email 등)는 가짜 값으로 둔다.
const bio = [
	'기능 구현을 넘어, 서비스가 안정적으로 운영되고 쉽게 유지보수될 수 있는 구조를 고민합니다.',
	'저는 요구사항을 빠르게 구현하는 것만큼, 그 기능이 실제 환경에서 어떻게 동작하고 오래 유지될지를 중요하게 봅니다.',
	'ClassUp에서는 서버 중심 상태 관리와 쿼리 튜닝으로 학습 기록의 안정성과 조회 성능을 개선했습니다.',
];
const stats = [
	{ label: 'SELECTED PROJECTS', value: '9', sub: '운영 / 외주 / 팀 프로젝트 / 오픈소스' },
	{ label: 'API Performance', value: '10x', sub: '베팅덕 — Redis 큐 적용 후' },
	{ label: 'Open Source Contributions', value: '6+', sub: 'OpenClaw, DAISO MCP, agent-messenger' },
	{ label: 'QUERY CUT', value: '75%', sub: 'ClassUp MySQL EXPLAIN 기반 쿼리 튜닝' },
];
const principles = [
	{ title: 'Flow First', body: '요청, 데이터, 운영 흐름을 먼저 이해합니다.' },
	{ title: 'Built To Last', body: '오래 유지될 수 있는 구조를 설계합니다.' },
	{ title: 'Observable By Default', body: '문제가 생겼을 때 원인을 추적할 수 있게 만듭니다.' },
];
// 서버가 내려 준 순서 그대로여야 한다 (연도순이 아님).
const journey = [
	['2026.04 - now', 'OpenClaw 오픈소스 기여', 'Open Source / Developer Tooling'],
	['2026.05 - now', 'DAISO MCP 오픈소스 기여', 'Open Source / MCP Integration'],
	['2026.06', 'agent-messenger 오픈소스 기여', 'Open Source / KakaoTalk Integration'],
	['2026.04 - 진행 중', '사내 운영 자동화 MCP 플랫폼', 'MCP / Operations Automation'],
	['2025.10 - 2025.12', 'ClassUp 사전 상담 기능', 'AI Application Backend'],
	['2025.08 - 2025.10', 'ClassUp 학생앱 타이머', 'Backend Intern'],
	['2025.03 - 2025.06', '커스텀 웹 프레임워크', 'Personal Project'],
	['2024.06 - 2025.03', '네이버 부스트캠프 & Betting-Duck', 'Realtime Backend'],
	['2024.01 - 2024.05', 'CaTs ChatBot', 'Backend Lead / Production Maintenance'],
].map(([year, title, role], i) => ({ year, title, role, body: `${title} 본문 ${i + 1}` }));
const stacks = [
	{ title: 'Languages', techs: ['TypeScript', 'Python', 'JavaScript'] },
	{ title: 'Backend', techs: ['Node.js', 'NestJS', 'Express', 'Django'] },
	{ title: 'Database / Cache', techs: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'] },
	{ title: 'Infra / DevOps', techs: ['Docker', 'GitHub Actions', 'Nginx', 'Linux'] },
	{ title: 'Observability / Data Pipeline', techs: ['Grafana', 'Loki', 'Vector', 'syslog-ng'] },
	{ title: 'Realtime / AI Integration', techs: ['WebSocket', 'Socket.IO', 'OpenAI API', 'MCP'] },
];
const about = {
	name: '이석호',
	tagline: 'Backend Developer',
	profileImage: '/uploads/profile-square.jpg',
	bio,
	availability: null,
	stats,
	principles,
	journey,
	stacks,
	email: 'unused@example.com',
	phone: '010-0000-0000',
	address: 'unused address',
	socials: [{ label: 'unused social', url: 'https://example.com/unused' }],
	faqs: [{ q: 'unused question', a: 'unused answer' }],
};

const json = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => data });

function mockApi(response) {
	global.fetch = jest.fn(() => (response instanceof Error ? Promise.reject(response) : Promise.resolve(response)));
}

let router;
function makeRouter() {
	return {
		pathname: '/about',
		route: '/about',
		asPath: '/about',
		basePath: '',
		query: {},
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
			{AboutPage.getLayout(<AboutPage {...pageProps} />)}
		</RouterContext.Provider>
	);
}

const renderPage = (data = about) => render(page({ about: data }));
const texts = (root, selector) => Array.from(root.querySelectorAll(selector)).map((el) => el.textContent);
const section = (container, id) => container.querySelector(`section[aria-labelledby="about-${id}-title"]`);

// 모바일 메뉴 폭 판단(matchMedia)을 흉내 낸다. set(false) 는 데스크톱 폭으로 넓어진 것.
function mockViewport(mobile) {
	const listeners = new Set();
	const query = {
		matches: mobile,
		media: '(max-width: 700px)',
		addEventListener: (type, fn) => listeners.add(fn),
		removeEventListener: (type, fn) => listeners.delete(fn),
	};
	window.matchMedia = jest.fn(() => query);
	return {
		set(matches) {
			query.matches = matches;
			act(() => listeners.forEach((fn) => fn({ matches })));
		},
		// 폭은 바뀌었지만 change 알림은 아직 오지 않은 상태
		setSilently(matches) {
			query.matches = matches;
		},
	};
}

function pressEscape(target) {
	act(() => {
		target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
	});
}

beforeEach(() => {
	localStorage.clear();
	document.documentElement.className = '';
	jest.spyOn(console, 'error').mockImplementation(() => {});
	router = makeRouter();
	ReactMarkdown.mockClear();
});

afterEach(() => {
	cleanup();
	jest.restoreAllMocks();
	delete global.fetch;
	delete window.matchMedia;
});

describe('getServerSideProps', () => {
	it('/api/about 의 data 를 그대로 props 로', async () => {
		mockApi(json({ success: true, data: about }));
		await expect(getServerSideProps()).resolves.toEqual({ props: { about } });
		expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/about$/));
		expect(console.error).not.toHaveBeenCalled();
	});

	it('404 와 data 없는 응답은 빈 프로필 (기존 기본 사진)', async () => {
		mockApi(json({ message: 'not found' }, 404));
		const { props } = await getServerSideProps();
		expect(props.about).toMatchObject({ name: '', profileImage: '/images/profile.jpeg', bio: [], stats: [] });
		mockApi(json({ success: true }));
		await expect(getServerSideProps()).resolves.toEqual({ props });
	});

	it('5xx / 네트워크 오류는 감추지 않고 에러로 드러냄', async () => {
		mockApi(json({}, 503));
		await expect(getServerSideProps()).rejects.toThrow('[about] API returned 503');
		mockApi(new Error('ECONNREFUSED'));
		await expect(getServerSideProps()).rejects.toThrow('ECONNREFUSED');
		expect(console.error).toHaveBeenCalledWith('[about] fetch failed', expect.any(Error));
	});
});

describe('구조와 레이아웃', () => {
	it('전환 shell 없이 정적 레이아웃: About 만 aria-current, skip link, 내부 링크', () => {
		expect(AboutPage.minimalShell).toBe(true);
		const { container } = renderPage();

		expect(container.querySelector('a[aria-label="Lagoon 홈"]')).toHaveAttribute('href', '/');
		['주 메뉴', '모바일 메뉴'].forEach((label) => {
			const links = Array.from(container.querySelectorAll(`nav[aria-label="${label}"] a`));
			expect(links.map((a) => a.getAttribute('href'))).toEqual(['/projects', '/about', '/contact']);
			expect(links.map((a) => a.getAttribute('aria-current'))).toEqual([null, 'page', null]);
		});
		expect(container.querySelectorAll('[aria-current]')).toHaveLength(2);
		expect(container.querySelector('header [class*="isSection"]')).toBeNull();

		expect(byText(container, 'a', '본문으로 바로 가기')).toHaveAttribute('href', '#main');
		expect(container.querySelector('main#main')).toHaveAttribute('tabindex', '-1');
		expect(container.querySelector('.bold-root, .bold-grain, .bold-interactive, .animate-ping')).toBeNull();
	});

	it('h1 하나와 섹션 제목 순서, 장식 / 중복 CTA 없음', () => {
		const { container } = renderPage();
		expect(container.querySelectorAll('h1')).toHaveLength(1);
		expect(container.querySelector('h1')).toHaveTextContent(/^문제의 본질에 집중하는 개발자, 이석호입니다$/);
		expect(texts(container, 'main h2')).toEqual(['소개', '주요 수치', '작업 원칙', '경험', '기술']);
		Array.from(container.querySelectorAll('main section')).forEach((s) => {
			expect(container.querySelector(`#${s.getAttribute('aria-labelledby')}`)).toBeInTheDocument();
		});
		[
			'SEOUL',
			'BACKEND',
			'GROUPS',
			'TOOLS',
			'Hire Me',
			'Contact Me',
			'— Bio',
			'In numbers',
			'unused',
			'010-0000-0000',
		].forEach((text) => expect(container.textContent).not.toContain(text));
	});

	it('프로필: 실제 사진(정사각 원본 비율), 이름 / 한 줄 소개, 빈 availability 는 표시하지 않음', () => {
		const { container } = renderPage();
		const hero = container.querySelector('section[aria-labelledby="about-title"]');
		const img = hero.querySelector('figure img');
		expect(img).toHaveAttribute('alt', '이석호 프로필 사진');
		expect(decodeURIComponent(img.getAttribute('src'))).toContain('/uploads/profile-square.jpg');
		expect(img.getAttribute('sizes')).toContain('240px');
		expect(hero.querySelector('p')).toHaveTextContent(/^Backend Developer$/);
		expect(hero.querySelectorAll('p')).toHaveLength(1);
	});

	it('푸터: 이력서(새 탭, 안전한 rel) → 연락하기 → 맨 위로', () => {
		const { container } = renderPage();
		const footer = container.querySelector('footer');
		expect(footer).toHaveTextContent('함께할 기회를 기다립니다');
		expect(Array.from(footer.querySelectorAll('a')).map((a) => a.getAttribute('href'))).toEqual([
			RESUME_URL,
			'/contact',
			'#top',
		]);
		const resume = byText(footer, 'a', '이력서 보기 (새 탭)');
		expect(resume).toHaveAttribute('target', '_blank');
		expect(resume).toHaveAttribute('rel', 'noopener noreferrer');
		expect(RESUME_URL).toBe('https://dear-sawfish-e55.notion.site/15fd6568ef4b80509953d6e7648258dd?source=copy_link');
		expect(byText(footer, 'a', '연락하기')).not.toHaveAttribute('target');
		expect(footer.textContent).toMatch(/© \d{4} 이석호 · Lagoon/);
	});

	it('헤더 / 푸터 링크는 Next 라우터로 내부 이동', () => {
		const { container } = renderPage();
		const nav = container.querySelector('nav[aria-label="주 메뉴"]');
		click(byText(nav, 'a', 'Projects'));
		expect(router.push).toHaveBeenLastCalledWith('/projects', '/projects', expect.any(Object));
		click(byText(nav, 'a', 'Contact'));
		expect(router.push).toHaveBeenLastCalledWith('/contact', '/contact', expect.any(Object));
		click(container.querySelector('a[aria-label="Lagoon 홈"]'));
		expect(router.push).toHaveBeenLastCalledWith('/', '/', expect.any(Object));
		click(byText(container, 'footer a', '연락하기'));
		expect(router.push).toHaveBeenLastCalledWith('/contact', '/contact', expect.any(Object));
	});
});

describe('본문 데이터', () => {
	it('소개는 모든 단락을 순서대로 Markdown 으로, 첫 단락만 리드 문단', () => {
		const { container } = renderPage();
		expect(ReactMarkdown.mock.calls.map(([{ children }]) => children)).toEqual(bio);
		const blocks = Array.from(section(container, 'bio').querySelectorAll('[data-markdown]')).map((p) => p.parentElement);
		expect(blocks).toHaveLength(3);
		expect(blocks[0].className).toMatch(/lead/);
		expect(blocks[1].className).toMatch(/paragraph/);
		expect(blocks[1].className).not.toMatch(/lead/);
	});

	it('Markdown 링크는 외부면 새 탭 + 안전한 rel, 제목은 페이지 h1 / 섹션 h2 아래로 낮춤', () => {
		renderPage();
		const { components } = ReactMarkdown.mock.calls[0][0];
		expect(components.a).toBe(AboutMarkdownLink);
		const { container } = render(
			<div>
				<AboutMarkdownLink href="https://example.com/a" node={{}}>
					외부
				</AboutMarkdownLink>
				<AboutMarkdownLink href="/projects">내부</AboutMarkdownLink>
				{['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => (
					<div key={tag} data-from={tag}>
						{components[tag]({ node: {}, children: tag })}
					</div>
				))}
			</div>,
		);
		const external = byText(container, 'a', '외부 (새 탭)');
		expect(external).toHaveAttribute('target', '_blank');
		expect(external).toHaveAttribute('rel', 'noopener noreferrer');
		expect(external).not.toHaveAttribute('node');
		expect(byText(container, 'a', '내부')).not.toHaveAttribute('target');
		expect(
			Array.from(container.querySelectorAll('[data-from]')).map((el) => [el.dataset.from, el.firstElementChild.tagName]),
		).toEqual([
			['h1', 'H3'],
			['h2', 'H4'],
			['h3', 'H5'],
			['h4', 'H6'],
			['h5', 'H6'],
			['h6', 'H6'],
		]);
	});

	it('수치 4개: 값 / 보조 설명은 그대로, 라벨은 대소문자만 정리', () => {
		const { container } = renderPage();
		const dl = section(container, 'stats').querySelector('dl');
		expect(texts(dl, 'dt')).toEqual(['Selected projects', 'API performance', 'Open source contributions', 'Query cut']);
		expect(texts(dl, 'dd[class*="statValue"]')).toEqual(['9', '10x', '6+', '75%']);
		expect(texts(dl, 'dd[class*="statSub"]')).toEqual(stats.map((s) => s.sub));
		// 카운트업 없이 서버 HTML 에 최종 값이 그대로 있다
		expect(renderToString(page({ about }))).toContain('>10x<');
	});

	it('원칙: 기존 소개 문장 + 3개를 순서대로', () => {
		const { container } = renderPage();
		const s = section(container, 'principles');
		expect(s.querySelector('p')).toHaveTextContent(/^기술은 결국 서비스를 더 잘 굴러가게 만드는 도구라고 생각합니다\./);
		expect(texts(s, 'ol > li h3')).toEqual(principles.map((p) => p.title));
		expect(texts(s, 'ol > li p')).toEqual(principles.map((p) => p.body));
	});

	it('경험: 9개 행을 API 순서 그대로 (기간 / 제목 / 역할 / 본문)', () => {
		const { container } = renderPage();
		const rows = Array.from(section(container, 'journey').querySelectorAll('ol > li'));
		expect(rows.map((li) => Array.from(li.querySelectorAll('p, h3')).map((el) => el.textContent))).toEqual(
			journey.map((j) => [j.year, j.title, j.role, j.body]),
		);
	});

	it('기술: 6개 그룹 / 23개 항목을 순서대로', () => {
		const { container } = renderPage();
		const groups = Array.from(section(container, 'stack').querySelectorAll(':scope > div > ul > li'));
		expect(groups.map((li) => [li.querySelector('h3').textContent, texts(li, 'ul li')])).toEqual(
			stacks.map((g) => [g.title, g.techs]),
		);
		expect(groups.reduce((sum, li) => sum + li.querySelectorAll('ul li').length, 0)).toBe(23);
	});
});

describe('빈 / 누락 데이터', () => {
	it('404 빈 프로필은 기존 기본 이름 / 소개 / 사진과 소개 안내만, 빈 섹션은 생략', async () => {
		mockApi(json({}, 404));
		const { props } = await getServerSideProps();
		const { container } = render(page(props));
		expect(container.querySelector('h1')).toHaveTextContent('문제의 본질에 집중하는 개발자, 이석호입니다');
		expect(container.querySelector('section[aria-labelledby="about-title"] p')).toHaveTextContent(DEFAULT_TAGLINE);
		expect(container.querySelector('figure img').getAttribute('src')).toContain(encodeURIComponent('/images/profile.jpeg'));
		expect(texts(container, 'main h2')).toEqual(['소개']);
		expect(section(container, 'bio')).toHaveTextContent('자기소개가 아직 등록되지 않았습니다.');
		expect(ReactMarkdown).not.toHaveBeenCalled();
		expect(container.querySelector('footer')).toHaveTextContent('이력서 보기');
	});

	it('null 필드 / 사진 없음 / 일부 값 누락에도 깨지지 않고 있는 값만, availability 는 조용한 문장으로', () => {
		const { container } = renderPage({
			name: null,
			tagline: null,
			profileImage: null,
			availability: '새로운 기회를 찾고 있습니다',
			bio: null,
			stats: [{ label: 'Uptime', value: 99.9 }],
			principles: null,
			journey: [{ title: '기간 / 역할 없는 경험', body: '본문만 있음' }],
			stacks: [{ title: '빈 그룹', techs: [] }, { title: 'Ops', techs: ['Docker'] }],
		});
		const hero = container.querySelector('section[aria-labelledby="about-title"]');
		expect(hero.querySelector('figure')).toBeNull();
		expect(hero.className).toMatch(/heroTextOnly/);
		expect(texts(hero, 'p')).toEqual([DEFAULT_TAGLINE, '새로운 기회를 찾고 있습니다']);
		expect(texts(container, 'main h2')).toEqual(['소개', '주요 수치', '경험', '기술']);
		expect(texts(container, 'dd')).toEqual(['99.9']);
		const row = section(container, 'journey').querySelector('li');
		expect(Array.from(row.children).map((el) => el.tagName)).toEqual(['DIV']);
		expect(texts(row, 'h3, p')).toEqual(['기간 / 역할 없는 경험', '본문만 있음']);
		expect(texts(section(container, 'stack'), 'h3')).toEqual(['Ops']);
	});
});

describe('헤더 상호작용', () => {
	it('테마 버튼은 기존 theme 저장소와 <html> 클래스를 함께 전환하고 복원', () => {
		const { container } = renderPage();
		const button = container.querySelector('button[aria-label$="테마로 전환"]');
		expect(button).toHaveAttribute('aria-label', '다크 테마로 전환');
		click(button);
		expect(document.documentElement).toHaveClass('dark');
		expect(localStorage.getItem('theme')).toBe('dark');
		expect(button).toHaveAttribute('aria-label', '라이트 테마로 전환');
		cleanup();

		document.documentElement.className = '';
		const again = renderPage();
		expect(document.documentElement).toHaveClass('dark');
		expect(again.container.querySelector('button[aria-label="라이트 테마로 전환"]')).toBeInTheDocument();
	});

	it('모바일 메뉴: 열기 / Escape 닫기(포커스 복귀) / 링크 선택 시 닫힘', () => {
		const { container } = renderPage();
		const menuButton = container.querySelector('button[aria-controls="projects-mobile-nav"]');
		const mobileNav = container.querySelector('#projects-mobile-nav');
		click(menuButton);
		expect(menuButton).toHaveAttribute('aria-expanded', 'true');
		expect(mobileNav).not.toHaveAttribute('hidden');
		pressEscape(document.body);
		expect(mobileNav).toHaveAttribute('hidden');
		expect(document.activeElement).toBe(menuButton);

		click(menuButton);
		click(byText(mobileNav, 'a', 'Projects'));
		expect(mobileNav).toHaveAttribute('hidden');
		expect(router.push).toHaveBeenCalledWith('/projects', '/projects', expect.any(Object));
	});

	it('데스크톱 폭으로 넓어지면 메뉴를 닫고 숨겨지는 메뉴 안 포커스를 보이는 같은 링크로 옮김', () => {
		const viewport = mockViewport(true);
		const { container } = renderPage();
		const menuButton = container.querySelector('button[aria-controls="projects-mobile-nav"]');
		const mobileNav = container.querySelector('#projects-mobile-nav');

		click(menuButton);
		act(() => byText(mobileNav, 'a', 'About').focus());
		viewport.set(false);
		expect(mobileNav).toHaveAttribute('hidden');
		expect(menuButton).toHaveAttribute('aria-expanded', 'false');
		expect(document.activeElement).toBe(byText(container.querySelector('nav[aria-label="주 메뉴"]'), 'a', 'About'));
		expect(document.activeElement).toHaveAttribute('aria-current', 'page');

		// 메뉴 버튼 자체에 포커스가 있으면 바로 앞 테마 버튼으로
		viewport.set(true);
		act(() => menuButton.focus());
		viewport.set(false);
		expect(document.activeElement).toBe(container.querySelector('button[aria-label$="테마로 전환"]'));

		// 헤더 밖 포커스는 건드리지 않고, 좁아질 때는 아무것도 하지 않음
		const resume = byText(container, 'footer a', '이력서 보기 (새 탭)');
		act(() => resume.focus());
		viewport.set(true);
		viewport.set(false);
		expect(document.activeElement).toBe(resume);
	});
	it('폭 변화 알림 전에 브라우저가 숨겨진 메뉴 링크의 포커스를 놓아도(focus fixup) 같은 데스크톱 링크로', () => {
		const viewport = mockViewport(true);
		const { container } = renderPage();
		const menuButton = container.querySelector('button[aria-controls="projects-mobile-nav"]');
		const mobileContact = byText(container.querySelector('#projects-mobile-nav'), 'a', 'Contact');
		const desktopContact = byText(container.querySelector('nav[aria-label="주 메뉴"]'), 'a', 'Contact');
		click(menuButton);
		act(() => mobileContact.focus());

		// 좁은 화면에서 포커스가 빠지는 경우(링크 선택 후 메뉴 닫힘 등)는 옮기지 않는다
		act(() => {
			mobileContact.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
		});
		expect(document.activeElement).toBe(mobileContact);

		viewport.setSilently(false);
		act(() => {
			mobileContact.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
		});
		expect(document.activeElement).toBe(desktopContact);
		viewport.set(false);
		expect(menuButton).toHaveAttribute('aria-expanded', 'false');
		expect(document.activeElement).toBe(desktopContact);
	});
});

describe('hydration', () => {
	it('서버 HTML(본문 포함)과 같은 내용으로 hydrate', async () => {
		const html = renderToString(page({ about }));
		expect(html).toContain('문제의 본질에 집중하는 개발자, 이석호입니다');
		expect(html).toContain('CaTs ChatBot');
		console.error.mockClear();
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.appendChild(container);

		const recoverable = jest.fn();
		let root;
		await act(async () => {
			root = hydrateRoot(container, page({ about }), { onRecoverableError: recoverable });
		});
		expect(recoverable).not.toHaveBeenCalled();
		expect(console.error).not.toHaveBeenCalled();

		act(() => root.unmount());
		container.remove();
	});
});
