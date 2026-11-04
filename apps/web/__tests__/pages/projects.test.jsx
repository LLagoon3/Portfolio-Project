import '@testing-library/jest-dom';
// jsdom 에는 TextEncoder 가 없어 Node 용 서버 렌더러를 직접 쓴다.
import { renderToString } from 'react-dom/server.node';
import { hydrateRoot } from 'react-dom/client';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import ProjectsIndex, { getServerSideProps } from '../../pages/projects/index';
import { sortProjectsForIndex } from '../../lib/projectsIndex';
import { act, byText, cleanup, click, render, typeInto } from '../helpers/render';

// /api/projects 응답과 같은 모양 (id, url, title, category, img, headerPublishDate), API 순서 그대로.
const apiProjects = [
	['internal-operations-mcp-platform', '사내 운영 자동화 MCP 플랫폼', 'MCP / Operations Automation', '2026.04 – 진행 중'],
	['classup-pre-consultation', '클래스업 - 사전 상담 기능', 'Backend', '2025.10 – 2025.12'],
	['classup-student-timer', '클래스업 학생앱 - 타이머 서비스', 'Backend', '2025.08 – 2025.10'],
	['betting-duck', '베팅덕 (실시간 베팅 서비스)', 'Realtime', '2024.10 – 2025.02'],
	['cats-chatbot', 'CaTs ChatBot', 'Backend', '2024.01 – 2024.05'],
	['custom-web-framework', '커스텀 웹 프레임워크', 'Low-level', '2025.03 – 2025.06'],
	['daiso-mcp-contribution', 'DAISO MCP 오픈소스 기여', 'Open Source Contribution', '2026.05'],
	['agent-messenger-contribution', 'agent-messenger 오픈소스 기여', 'Open Source Contribution', '2026.06'],
].map(([url, title, category, headerPublishDate], i) => ({
	id: i + 1,
	url,
	title,
	category,
	img: `/uploads/cover-${i + 1}.jpg`,
	headerPublishDate,
}));

// localeCompare() 결과는 실행 환경의 기본 로케일을 따른다. 기대 순서를 고정하려고
// 테스트에서는 기본 로케일을 명시적으로 흉내 낸다 (서버 = en, 한국어 브라우저 = ko).
const nativeLocaleCompare = String.prototype.localeCompare;
function useDefaultCollation(locale) {
	// eslint-disable-next-line no-extend-native
	String.prototype.localeCompare = function localeCompare(that) {
		return nativeLocaleCompare.call(this, that, locale);
	};
}

function mockFetch(response) {
	global.fetch = jest.fn().mockResolvedValue(response);
}

async function loadProps(data = apiProjects) {
	mockFetch({ ok: true, status: 200, json: async () => ({ data }) });
	const { props } = await getServerSideProps();
	return props;
}

// next/link 가 실제 페이지 이동 대신 push 를 호출하는지 확인할 수 있게 최소 router 를 넣는다.
let router;
function makeRouter() {
	return {
		pathname: '/projects',
		route: '/projects',
		asPath: '/projects',
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
			{ProjectsIndex.getLayout(<ProjectsIndex {...pageProps} />)}
		</RouterContext.Provider>
	);
}

function renderPage(pageProps) {
	return render(page(pageProps));
}

const cards = (container) => Array.from(container.querySelectorAll('main li a[href^="/projects/"]'));
const hrefs = (container) => cards(container).map((a) => a.getAttribute('href').replace('/projects/', ''));
const numbers = (container) =>
	cards(container).map((a) => [a.getAttribute('href').replace('/projects/', ''), a.querySelector('span').textContent]);
const searchInput = (container) => container.querySelector('input[type="search"]');
const settingsToggle = (container) => byText(container, 'button', '보기 설정');
const settingsPanel = (container) => container.querySelector('#project-settings');
const summary = (container) => container.querySelector('#project-settings-summary');
const status = (container) => container.querySelector('main [role="status"]');
const radio = (container, name, value) =>
	container.querySelector(`input[type="radio"][name="${name}"][value="${value}"]`);

// 실제 브라우저의 keydown 처럼 취소 가능한 이벤트로 보낸다 (패널이 먼저 처리하면 메뉴는 건너뜀).
function pressEscape(target) {
	act(() => {
		target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
	});
}

function choose(container, name, value) {
	act(() => {
		radio(container, name, value).click();
	});
}

// en 기본 로케일(서버)에서의 최신순: 연도 내림차순, 같은 연도는 라틴 → 한글 순.
const NEWEST = [
	'agent-messenger-contribution',
	'daiso-mcp-contribution',
	'internal-operations-mcp-platform',
	'custom-web-framework',
	'classup-pre-consultation',
	'classup-student-timer',
	'cats-chatbot',
	'betting-duck',
];

let props;

beforeEach(async () => {
	useDefaultCollation('en');
	localStorage.clear();
	document.documentElement.className = '';
	jest.spyOn(console, 'error').mockImplementation(() => {});
	router = makeRouter();
	props = await loadProps();
});

afterEach(() => {
	cleanup();
	String.prototype.localeCompare = nativeLocaleCompare; // eslint-disable-line no-extend-native
	jest.restoreAllMocks();
	delete global.fetch;
});

describe('getServerSideProps', () => {
	it('API 목록을 기존 최신순 규칙으로 정렬해 내려 줌', async () => {
		expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/projects$/));
		expect(props.projects.map((p) => p.url)).toEqual(NEWEST);
		expect(props.projects[0]).toEqual(apiProjects[7]);
	});

	it('404 는 빈 목록, 5xx 와 네트워크 오류는 에러로 드러냄', async () => {
		mockFetch({ ok: false, status: 404 });
		await expect(getServerSideProps()).resolves.toEqual({ props: { projects: [] } });

		mockFetch({ ok: false, status: 503 });
		await expect(getServerSideProps()).rejects.toThrow('[projects] API returned 503');

		global.fetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'));
		await expect(getServerSideProps()).rejects.toThrow('ECONNREFUSED');
		expect(console.error).toHaveBeenCalledWith('[projects] fetch failed', expect.any(Error));
	});

	it('data 가 없으면 빈 목록', async () => {
		mockFetch({ ok: true, status: 200, json: async () => ({}) });
		await expect(getServerSideProps()).resolves.toEqual({ props: { projects: [] } });
	});
});

describe('구조', () => {
	it('작은 h1 하나와 검색 / 보기 설정만 두고 장식 요소는 렌더하지 않음', () => {
		const { container } = renderPage(props);
		expect(container.querySelectorAll('h1')).toHaveLength(1);
		expect(container.querySelector('h1')).toHaveTextContent(/^프로젝트$/);
		expect(container.querySelector('select')).toBeNull();
		expect(container.querySelector('[role="tablist"]')).toBeNull();
		expect(container.querySelector('.bold-root, .bold-grain, .bold-interactive')).toBeNull();
		['PROJECTS', 'Selected', 'TOTAL', 'Hire Me', 'No results', '/ 08', '8개'].forEach((text) =>
			expect(container.textContent).not.toContain(text),
		);
		// 결과 수는 화면에 보이지 않는 status 에만 (처음엔 비어 있음)
		expect(status(container)).toHaveTextContent('');
	});

	it('전환 shell 을 쓰지 않는 전용 레이아웃: 내부 링크 헤더, skip link, 짧은 푸터', () => {
		expect(ProjectsIndex.minimalShell).toBe(true);
		const { container } = renderPage(props);

		expect(container.querySelector('a[aria-label="Lagoon 홈"]')).toHaveAttribute('href', '/');
		const nav = container.querySelector('nav[aria-label="주 메뉴"]');
		const navLinks = Array.from(nav.querySelectorAll('a'));
		expect(navLinks.map((a) => a.getAttribute('href'))).toEqual(['/projects', '/about', '/contact']);
		expect(navLinks.map((a) => a.getAttribute('aria-current'))).toEqual(['page', null, null]);
		expect(container.querySelector('a[href^="#"][href$="work"]')).toBeNull();

		const skip = byText(container, 'a', '본문으로 바로 가기');
		expect(skip).toHaveAttribute('href', '#main');
		expect(container.querySelector('main#main')).toHaveAttribute('tabindex', '-1');

		const footer = container.querySelector('footer');
		expect(footer).toHaveTextContent('함께할 기회를 기다립니다');
		expect(Array.from(footer.querySelectorAll('a')).map((a) => a.getAttribute('href'))).toEqual([
			'/contact',
			'#top',
		]);
		expect(byText(footer, 'a', '연락하기')).toHaveAttribute('href', '/contact');
		expect(footer.textContent).toMatch(/© \d{4} 이석호 · Lagoon/);
		expect(container.querySelector('#top')).toContainElement(footer);
	});

	it('카드는 이미지 아래에 고정 번호 / 카테고리 / 연도 / 제목을 두고 상세로 내부 이동', () => {
		const { container } = renderPage(props);
		expect(hrefs(container)).toEqual(NEWEST);

		const first = cards(container)[0];
		expect(first).not.toHaveAttribute('target');
		expect(first).toHaveAttribute('aria-label', 'agent-messenger 오픈소스 기여 상세 보기');
		const img = first.querySelector('img');
		expect(img).toHaveAttribute('alt', 'agent-messenger 오픈소스 기여 프로젝트 표지');
		expect(decodeURIComponent(img.getAttribute('src'))).toContain('/uploads/cover-8.jpg');

		const title = first.querySelector('h2');
		expect(title).toHaveTextContent('agent-messenger 오픈소스 기여');
		expect(img.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		expect(Array.from(first.querySelectorAll('span')).map((s) => s.textContent)).toEqual([
			'01',
			'Open Source Contribution',
			'2026',
		]);
		expect(numbers(container).map(([, n]) => n)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08']);
	});
});

describe('검색', () => {
	it('제목/카테고리로 좁히고, 번호는 유지하며 결과 수를 보조기기에만 알림', () => {
		const { container } = renderPage(props);
		typeInto(searchInput(container), '타이머');
		expect(numbers(container)).toEqual([['classup-student-timer', '06']]);
		expect(status(container)).toHaveTextContent('1개 프로젝트');

		typeInto(searchInput(container), 'backend');
		expect(numbers(container)).toEqual([
			['classup-pre-consultation', '05'],
			['classup-student-timer', '06'],
			['cats-chatbot', '07'],
		]);
		expect(status(container)).toHaveTextContent('3개 프로젝트');

		// 기간/주소는 검색 대상이 아니다
		typeInto(searchInput(container), '2026');
		expect(cards(container)).toHaveLength(0);
	});

	it('결과가 없으면 안내 + 조건 초기화 (검색어/카테고리만 되돌리고 정렬/보기는 유지, 검색창 포커스)', () => {
		const { container } = renderPage(props);
		click(settingsToggle(container));
		choose(container, 'category', 'Backend');
		choose(container, 'sort', 'az');
		choose(container, 'view', 'list');
		typeInto(searchInput(container), '존재하지 않는 프로젝트');

		expect(container.querySelector('main ul')).toBeNull();
		expect(container.textContent).toContain('조건에 맞는 프로젝트가 없어요');
		expect(status(container)).toHaveTextContent('조건에 맞는 프로젝트 없음');

		click(byText(container, 'button', '조건 초기화'));
		expect(searchInput(container)).toHaveValue('');
		expect(document.activeElement).toBe(searchInput(container));
		expect(radio(container, 'category', 'all')).toBeChecked();
		expect(radio(container, 'sort', 'az')).toBeChecked();
		expect(radio(container, 'view', 'list')).toBeChecked();
		expect(cards(container)).toHaveLength(8);
		expect(status(container)).toHaveTextContent('8개 프로젝트');
		expect(container.textContent).not.toContain('조건에 맞는 프로젝트가 없어요');
	});

	it('API 목록이 비면 검색/보기 설정 없이 중립 안내만', async () => {
		const { container } = renderPage(await loadProps([]));
		expect(container.querySelector('h1')).toHaveTextContent('프로젝트');
		expect(searchInput(container)).toBeNull();
		expect(settingsToggle(container)).toBeUndefined();
		expect(container.textContent).toContain('표시할 프로젝트가 없어요');
		expect(byText(container, 'button', '조건 초기화')).toBeUndefined();
		expect(byText(container, 'footer a', '연락하기')).toHaveAttribute('href', '/contact');
	});
});

describe('보기 설정', () => {
	it('기본은 접힘 상태이고, 열면 카테고리 / 정렬 / 보기 라디오 그룹을 개수 없이 보여 줌', () => {
		const { container } = renderPage(props);
		const toggle = settingsToggle(container);
		expect(toggle).toHaveAttribute('aria-expanded', 'false');
		expect(toggle).toHaveAttribute('aria-controls', 'project-settings');
		expect(settingsPanel(container)).toHaveAttribute('hidden');
		expect(container.querySelector('input[type="radio"]')).toBeNull();

		click(toggle);
		expect(toggle).toHaveAttribute('aria-expanded', 'true');
		expect(settingsPanel(container)).not.toHaveAttribute('hidden');
		const legends = Array.from(container.querySelectorAll('#project-settings legend')).map((l) => l.textContent);
		expect(legends).toEqual(['카테고리', '정렬', '보기']);
		const labels = (name) =>
			Array.from(container.querySelectorAll(`input[name="${name}"]`)).map((input) =>
				input.closest('label').textContent,
			);
		expect(labels('category')).toEqual([
			'전체',
			'Backend',
			'Low-level',
			'MCP / Operations Automation',
			'Open Source Contribution',
			'Realtime',
		]);
		expect(labels('sort')).toEqual(['최신순', '오래된순', '이름순', '카테고리순']);
		expect(labels('view')).toEqual(['그리드', '목록']);
		expect(radio(container, 'category', 'all')).toBeChecked();
		expect(radio(container, 'sort', 'newest')).toBeChecked();
		expect(radio(container, 'view', 'grid')).toBeChecked();
	});

	it('카테고리 선택은 정확히 그 카테고리만 남기고 번호를 유지', () => {
		const { container } = renderPage(props);
		click(settingsToggle(container));
		choose(container, 'category', 'Open Source Contribution');
		expect(numbers(container)).toEqual([
			['agent-messenger-contribution', '01'],
			['daiso-mcp-contribution', '02'],
		]);
		expect(status(container)).toHaveTextContent('2개 프로젝트');
	});

	it('정렬 4종은 기존 규칙을 따르고 번호는 항목을 따라감', () => {
		const { container } = renderPage(props);
		click(settingsToggle(container));

		choose(container, 'sort', 'oldest');
		expect(numbers(container)).toEqual([
			['cats-chatbot', '07'],
			['betting-duck', '08'],
			['custom-web-framework', '04'],
			['classup-pre-consultation', '05'],
			['classup-student-timer', '06'],
			['agent-messenger-contribution', '01'],
			['daiso-mcp-contribution', '02'],
			['internal-operations-mcp-platform', '03'],
		]);

		choose(container, 'sort', 'az');
		expect(hrefs(container)).toEqual([
			'agent-messenger-contribution',
			'cats-chatbot',
			'daiso-mcp-contribution',
			'betting-duck',
			'internal-operations-mcp-platform',
			'custom-web-framework',
			'classup-pre-consultation',
			'classup-student-timer',
		]);

		choose(container, 'sort', 'cat');
		expect(hrefs(container)).toEqual([
			'cats-chatbot',
			'classup-pre-consultation',
			'classup-student-timer',
			'custom-web-framework',
			'internal-operations-mcp-platform',
			'agent-messenger-contribution',
			'daiso-mcp-contribution',
			'betting-duck',
		]);

		choose(container, 'sort', 'newest');
		expect(hrefs(container)).toEqual(NEWEST);
		// 정렬만 바꾸면 결과 수 안내는 하지 않는다
		expect(status(container)).toHaveTextContent('');
	});

	it('그리드/목록은 같은 항목을 유지한 채 배치만 전환', () => {
		const { container } = renderPage(props);
		const list = () => container.querySelector('main ul');
		expect(list().className).not.toMatch(/isList/);
		click(settingsToggle(container));
		choose(container, 'view', 'list');
		expect(list().className).toMatch(/isList/);
		expect(hrefs(container)).toEqual(NEWEST);
		choose(container, 'view', 'grid');
		expect(list().className).not.toMatch(/isList/);
	});

	it('닫혀 있을 때만 기본값이 아닌 설정을 요약해 보여 줌', () => {
		const { container } = renderPage(props);
		const toggle = settingsToggle(container);
		expect(toggle).toHaveAttribute('aria-describedby', 'project-settings-summary');
		expect(summary(container)).toHaveTextContent('');
		expect(toggle.className).not.toMatch(/isModified/);

		click(toggle);
		choose(container, 'category', 'Backend');
		choose(container, 'sort', 'cat');
		choose(container, 'view', 'list');
		expect(summary(container)).toHaveTextContent('');

		click(toggle);
		expect(summary(container)).toHaveTextContent('Backend · 카테고리순 · 목록 보기');
		expect(toggle.className).toMatch(/isModified/);

		click(toggle);
		choose(container, 'category', 'all');
		choose(container, 'sort', 'newest');
		choose(container, 'view', 'grid');
		click(toggle);
		expect(summary(container)).toHaveTextContent('');
		expect(toggle.className).not.toMatch(/isModified/);
	});

	it('Escape 는 패널을 닫고 보기 설정 버튼으로 포커스를 돌려줌', () => {
		const { container } = renderPage(props);
		const toggle = settingsToggle(container);
		click(toggle);
		radio(container, 'sort', 'az').focus();
		pressEscape(document.activeElement);
		expect(toggle).toHaveAttribute('aria-expanded', 'false');
		expect(settingsPanel(container)).toHaveAttribute('hidden');
		expect(document.activeElement).toBe(toggle);
	});

	it('검색창에서 누른 Escape 는 패널/메뉴를 닫지 않음 (네이티브 검색어 지우기)', () => {
		const { container } = renderPage(props);
		const menuButton = container.querySelector('button[aria-controls="projects-mobile-nav"]');
		click(menuButton);
		click(settingsToggle(container));
		const input = searchInput(container);
		input.focus();
		pressEscape(input);
		expect(settingsToggle(container)).toHaveAttribute('aria-expanded', 'true');
		expect(menuButton).toHaveAttribute('aria-expanded', 'true');
		expect(document.activeElement).toBe(input);
	});
});

describe('헤더 상호작용', () => {
	it('테마 버튼은 기존 theme 저장소와 <html> 클래스를 함께 전환', () => {
		const { container } = renderPage(props);
		const button = container.querySelector('button[aria-label$="테마로 전환"]');
		expect(button).toHaveAttribute('aria-label', '다크 테마로 전환');
		expect(document.documentElement).toHaveClass('light');

		click(button);
		expect(document.documentElement).toHaveClass('dark');
		expect(document.documentElement).not.toHaveClass('light');
		expect(localStorage.getItem('theme')).toBe('dark');
		expect(button).toHaveAttribute('aria-label', '라이트 테마로 전환');
		expect(button.textContent).toBe('Light');
	});

	it('저장된 다크 테마를 마운트 시 복원', () => {
		localStorage.setItem('theme', 'dark');
		const { container } = renderPage(props);
		expect(document.documentElement).toHaveClass('dark');
		expect(container.querySelector('button[aria-label="라이트 테마로 전환"]')).toBeInTheDocument();
	});

	it('모바일 메뉴는 열기 / Escape 닫기(포커스 복귀) / 링크 선택 시 닫힘', () => {
		const { container } = renderPage(props);
		const menuButton = container.querySelector('button[aria-controls="projects-mobile-nav"]');
		const mobileNav = container.querySelector('#projects-mobile-nav');
		expect(menuButton).toHaveAttribute('aria-expanded', 'false');
		expect(mobileNav).toHaveAttribute('hidden');
		expect(Array.from(mobileNav.querySelectorAll('a')).map((a) => a.getAttribute('href'))).toEqual([
			'/projects',
			'/about',
			'/contact',
		]);

		click(menuButton);
		expect(menuButton).toHaveAttribute('aria-expanded', 'true');
		expect(menuButton).toHaveAttribute('aria-label', '메뉴 닫기');
		expect(mobileNav).not.toHaveAttribute('hidden');

		pressEscape(document.body);
		expect(menuButton).toHaveAttribute('aria-expanded', 'false');
		expect(mobileNav).toHaveAttribute('hidden');
		expect(document.activeElement).toBe(menuButton);

		click(menuButton);
		click(byText(mobileNav, 'a', 'About'));
		expect(mobileNav).toHaveAttribute('hidden');
		expect(router.push).toHaveBeenCalledWith('/about', '/about', expect.any(Object));
	});

	it('헤더 / 카드 / 푸터 링크는 Next 라우터로 내부 이동', () => {
		const { container } = renderPage(props);
		click(byText(container.querySelector('nav[aria-label="주 메뉴"]'), 'a', 'Contact'));
		expect(router.push).toHaveBeenLastCalledWith('/contact', '/contact', expect.any(Object));
		click(container.querySelector('a[aria-label="Lagoon 홈"]'));
		expect(router.push).toHaveBeenLastCalledWith('/', '/', expect.any(Object));
		click(cards(container)[0]);
		expect(router.push).toHaveBeenLastCalledWith(
			'/projects/agent-messenger-contribution',
			'/projects/agent-messenger-contribution',
			expect.any(Object),
		);
		click(byText(container, 'footer a', '연락하기'));
		expect(router.push).toHaveBeenLastCalledWith('/contact', '/contact', expect.any(Object));
	});

	it('메뉴와 보기 설정이 함께 열려 있으면 포커스 위치에 따라 하나씩 닫힘', () => {
		const { container } = renderPage(props);
		const menuButton = container.querySelector('button[aria-controls="projects-mobile-nav"]');
		const toggle = settingsToggle(container);
		click(menuButton);
		click(toggle);

		// 보기 설정 안에 포커스 → 패널만 닫힘
		toggle.focus();
		pressEscape(toggle);
		expect(toggle).toHaveAttribute('aria-expanded', 'false');
		expect(menuButton).toHaveAttribute('aria-expanded', 'true');
		expect(document.activeElement).toBe(toggle);

		// 바깥에 포커스 → 메뉴부터 닫고, 다음 Escape 에 패널을 닫음
		click(toggle);
		cards(container)[0].focus();
		pressEscape(document.activeElement);
		expect(menuButton).toHaveAttribute('aria-expanded', 'false');
		expect(toggle).toHaveAttribute('aria-expanded', 'true');
		expect(document.activeElement).toBe(menuButton);

		pressEscape(document.activeElement);
		expect(toggle).toHaveAttribute('aria-expanded', 'false');
		expect(document.activeElement).toBe(toggle);
	});
});

describe('hydration', () => {
	it('브라우저 기본 로케일이 서버와 달라도 서버 HTML 과 같은 순서/번호로 hydrate', async () => {
		// 서버(en)에서 렌더한 HTML
		const html = renderToString(page(props));
		// jsdom 에서 서버 렌더를 돌릴 때 next/head 가 내는 useLayoutEffect 경고는 테스트 환경 탓이라 비운다.
		console.error.mockClear();
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.appendChild(container);
		const serverOrder = hrefs(container);
		expect(serverOrder).toEqual(NEWEST);

		// 한국어 브라우저처럼 한글을 라틴보다 앞에 두는 기본 정렬로 바꾼 뒤 hydrate.
		useDefaultCollation('ko');
		// 브라우저에서 다시 정렬했다면 순서가 달라졌을 상황인지 먼저 확인한다.
		expect(sortProjectsForIndex(apiProjects).map((p) => p.url)).not.toEqual(NEWEST);

		const recoverable = jest.fn();
		let root;
		await act(async () => {
			root = hydrateRoot(container, page(props), {
				onRecoverableError: recoverable,
			});
		});
		expect(recoverable).not.toHaveBeenCalled();
		expect(console.error).not.toHaveBeenCalled();
		expect(hrefs(container)).toEqual(serverOrder);
		expect(numbers(container).map(([, n]) => n)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08']);

		act(() => root.unmount());
		container.remove();
	});
});
