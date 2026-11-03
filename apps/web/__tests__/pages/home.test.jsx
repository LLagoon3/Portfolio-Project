import '@testing-library/jest-dom';
import Home from '../../pages/index';
import { ABOUT_SUMMARY_FALLBACK } from '../../lib/home';
import { act, byText, cleanup, click, pressKey, render, typeInto } from '../helpers/render';

// /api/projects 응답과 같은 모양 (id, url, title, category, img, headerPublishDate).
const projects = [
	['internal-operations-mcp-platform', '사내 운영 자동화 MCP 플랫폼', 'MCP / Operations Automation'],
	['classup-pre-consultation', '클래스업 - 사전 상담 기능', 'Backend'],
	['classup-student-timer', '클래스업 학생앱 - 타이머 서비스', 'Backend'],
	['betting-duck', '베팅덕 (실시간 베팅 서비스)', 'Realtime'],
	['cats-chatbot', 'CaTs ChatBot', 'Backend'],
	['custom-web-framework', '커스텀 웹 프레임워크', 'Low-level'],
	['daiso-mcp-contribution', 'DAISO MCP 오픈소스 기여', 'Open Source Contribution'],
	['openclaw-contribution', 'OpenClaw 오픈소스 기여', 'Open Source Contribution'],
].map(([url, title, category], i) => ({
	id: i + 1,
	url,
	title,
	category,
	img: `/uploads/cover-${i + 1}.jpg`,
	headerPublishDate: '2025.01 – 2025.02',
}));

const about = {
	tagline: 'Backend Developer',
	email: 'owner@example.com',
	bio: [
		'기능 구현을 넘어, 서비스가 안정적으로 운영되고 쉽게 유지보수될 수 있는 구조를 고민합니다.',
		'데이터가 쌓였을 때의 성능과 요청의 정합성을 함께 고려합니다.',
		'성과 단락은 홈에 노출하지 않습니다.',
	],
};

function renderHome(props = { projects, about }) {
	return render(Home.getLayout(<Home {...props} />));
}

const cards = (container) => Array.from(container.querySelectorAll('#work a[href^="/projects/"]'));
const status = (container) => container.querySelector('#work [role="status"]');
const searchInput = (container) => container.querySelector('input[type="search"]');

beforeEach(() => {
	localStorage.clear();
	document.documentElement.className = '';
});

afterEach(() => {
	cleanup();
	jest.useRealTimers();
});

describe('Home 구조', () => {
	it('hero → 관심 분야 → 프로젝트 → About → Contact 순서로 렌더', () => {
		const { container } = renderHome();
		const order = ['#hero-title', 'ul[aria-label="관심 분야"]', '#work', '#about', '#contact'].map(
			(sel) => container.querySelector(sel),
		);
		order.forEach((el) => expect(el).toBeInTheDocument());
		for (let i = 1; i < order.length; i += 1) {
			expect(
				order[i - 1].compareDocumentPosition(order[i]) & Node.DOCUMENT_POSITION_FOLLOWING,
			).toBeTruthy();
		}
		expect(container.querySelector('h1')).toHaveTextContent('이석호의포트폴리오');
		expect(container.textContent).toContain('Backend Developer');
	});

	it('삭제된 장식/중복 UI 를 렌더하지 않음', () => {
		const { container } = renderHome();
		expect(container.querySelector('select')).toBeNull();
		expect(container.querySelectorAll('h1')).toHaveLength(1);
		['TOTAL', '대표', 'KST', '서울', 'Hire Me', '탐색 중', 'HIGHLIGHTS', '선택하면'].forEach(
			(text) => expect(container.textContent).not.toContain(text),
		);
		// hero 의 프로젝트 이동은 CTA 하나뿐
		const heroLinks = container.querySelectorAll('section[aria-labelledby="hero-title"] a[href="#work"]');
		expect(heroLinks).toHaveLength(1);
	});

	it('정적 헤더/푸터를 가진 홈 전용 레이아웃이며 전환 shell 을 쓰지 않음', () => {
		expect(Home.minimalShell).toBe(true);
		const { container } = renderHome();
		const nav = container.querySelector('nav[aria-label="주 메뉴"]');
		expect(Array.from(nav.querySelectorAll('a')).map((a) => a.getAttribute('href'))).toEqual([
			'#work',
			'#about',
			'#contact',
		]);
		expect(byText(container, 'footer a', '맨 위로')).toHaveAttribute('href', '#top');
		expect(container.querySelector('#top')).toBeInTheDocument();
	});
});

describe('프로젝트 목록과 검색', () => {
	it('API 순서의 앞 6개를 상세 페이지 내부 링크와 API 커버 이미지로 노출', () => {
		const { container } = renderHome();
		const list = cards(container);
		expect(list.map((a) => a.getAttribute('href'))).toEqual(
			projects.slice(0, 6).map((p) => `/projects/${p.url}`),
		);
		list.forEach((a) => expect(a).not.toHaveAttribute('target'));
		expect(list[0]).toHaveAttribute('aria-label', '사내 운영 자동화 MCP 플랫폼 상세 보기');
		expect(list[0].querySelector('h3')).toHaveTextContent('사내 운영 자동화 MCP 플랫폼');
		expect(list[0].textContent).toContain('01');
		expect(list[0].textContent).toContain('MCP / Operations Automation');
		const img = list[0].querySelector('img');
		expect(img).toHaveAttribute('alt', '사내 운영 자동화 MCP 플랫폼 프로젝트 표지');
		expect(decodeURIComponent(img.getAttribute('src'))).toContain('/uploads/cover-1.jpg');
		expect(byText(container, 'a', '전체 프로젝트 보기')).toHaveAttribute('href', '/projects');
	});

	it('검색어 입력 시 결과를 좁히고 원래 번호와 결과 수 안내를 유지', () => {
		const { container } = renderHome();
		expect(status(container)).toHaveTextContent('');
		typeInto(searchInput(container), '타이머');
		const list = cards(container);
		expect(list).toHaveLength(1);
		expect(list[0]).toHaveAttribute('href', '/projects/classup-student-timer');
		expect(list[0].textContent).toContain('03');
		expect(status(container)).toHaveTextContent('1개의 검색 결과');

		typeInto(searchInput(container), 'REALTIME');
		expect(cards(container).map((a) => a.getAttribute('href'))).toEqual(['/projects/betting-duck']);
	});

	it('검색은 홈에 처음 보이지 않던 프로젝트도 찾음 (기존 홈 정책 유지)', () => {
		const { container } = renderHome();
		typeInto(searchInput(container), '오픈소스');
		expect(cards(container).map((a) => a.getAttribute('href'))).toEqual([
			'/projects/daiso-mcp-contribution',
			'/projects/openclaw-contribution',
		]);
		expect(status(container)).toHaveTextContent('2개의 검색 결과');
	});

	it('결과가 없으면 안내와 초기화 버튼을 보이고, 초기화 시 목록 복원 + 입력창 포커스', () => {
		const { container } = renderHome();
		const input = searchInput(container);
		typeInto(input, '존재하지 않는 프로젝트');
		expect(cards(container)).toHaveLength(0);
		expect(container.textContent).toContain('검색 결과가 없어요');
		expect(status(container)).toHaveTextContent('0개의 검색 결과');

		click(byText(container, 'button', '검색 초기화'));
		expect(input).toHaveValue('');
		expect(document.activeElement).toBe(input);
		expect(cards(container)).toHaveLength(6);
		expect(status(container)).toHaveTextContent('');
		expect(container.textContent).not.toContain('검색 결과가 없어요');
	});

	it('프로젝트가 없으면 검색 없이 중립 안내와 전체 보기 링크만 노출', () => {
		const { container } = renderHome({ projects: [], about: null });
		expect(searchInput(container)).toBeNull();
		expect(container.textContent).toContain('표시할 프로젝트가 없어요');
		expect(byText(container, 'a', '전체 프로젝트 보기')).toHaveAttribute('href', '/projects');
	});
});

describe('About / Contact', () => {
	it('About 은 제목과 겹치지 않는 bio 설명 단락과 내부 /about 링크를 사용', () => {
		const { container } = renderHome();
		const copy = container.querySelector('#about p');
		expect(copy).toHaveTextContent(about.bio[1]);
		expect(container.querySelector('#about').textContent).not.toContain(about.bio[0]);
		expect(container.querySelector('#about').textContent).not.toContain(about.bio[2]);
		expect(byText(container, '#about a', '더 알아보기')).toHaveAttribute('href', '/about');
	});

	it('about 데이터가 없으면 fallback 문구와 기본 역할/이메일을 사용', () => {
		const { container } = renderHome({ projects, about: null });
		expect(container.querySelector('#about p')).toHaveTextContent(ABOUT_SUMMARY_FALLBACK);
		expect(container.textContent).toContain('Backend developer');
		expect(container.querySelector('#contact a[href^="mailto:"]')).toHaveAttribute(
			'href',
			'mailto:choonarm3@gmail.com',
		);
	});

	it('이메일은 mailto, 외부 링크는 새 탭 + noopener', () => {
		const { container } = renderHome();
		expect(container.querySelector('#contact a[href^="mailto:"]')).toHaveAttribute(
			'href',
			'mailto:owner@example.com',
		);
		container.querySelectorAll('a[target="_blank"]').forEach((a) => {
			expect(a.getAttribute('rel')).toContain('noopener');
			expect(a.getAttribute('href')).toMatch(/^https:\/\//);
		});
		expect(container.querySelectorAll('a[target="_blank"]')).toHaveLength(3);
	});

	describe('이메일 복사', () => {
		const originalClipboard = navigator.clipboard;
		const setClipboard = (value) =>
			Object.defineProperty(navigator, 'clipboard', { value, configurable: true });
		afterEach(() => setClipboard(originalClipboard));

		const toast = (container) => container.querySelector('#contact [role="status"]');

		it('성공 시 복사 완료 안내 후 3초 뒤 사라짐', async () => {
			jest.useFakeTimers();
			const writeText = jest.fn().mockResolvedValue(undefined);
			setClipboard({ writeText });
			const { container } = renderHome();
			await act(async () => {
				byText(container, 'button', '이메일 복사').click();
			});
			expect(writeText).toHaveBeenCalledWith('owner@example.com');
			expect(toast(container)).toHaveTextContent('이메일 주소를 복사했어요');
			act(() => {
				jest.advanceTimersByTime(3000);
			});
			expect(toast(container)).toHaveTextContent('');
		});

		it('클립보드 거부 시 주소를 직접 보여 줌', async () => {
			setClipboard({ writeText: jest.fn().mockRejectedValue(new Error('denied')) });
			const { container } = renderHome();
			await act(async () => {
				byText(container, 'button', '이메일 복사').click();
			});
			expect(toast(container)).toHaveTextContent('이메일: owner@example.com');
		});

		it('클립보드 API 가 없어도 주소를 보여 줌', async () => {
			setClipboard(undefined);
			const { container } = renderHome();
			await act(async () => {
				byText(container, 'button', '이메일 복사').click();
			});
			expect(toast(container)).toHaveTextContent('이메일: owner@example.com');
		});
	});
});

describe('헤더 상호작용', () => {
	it('테마 버튼은 기존 theme 저장소와 <html> 클래스를 함께 전환', () => {
		const { container } = renderHome();
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
		const { container } = renderHome();
		expect(document.documentElement).toHaveClass('dark');
		expect(container.querySelector('button[aria-label="라이트 테마로 전환"]')).toBeInTheDocument();
	});

	it('모바일 메뉴는 열기/Escape 닫기(포커스 복귀)/링크 선택 시 닫힘', () => {
		const { container } = renderHome();
		const menuButton = container.querySelector('button[aria-controls="home-mobile-nav"]');
		const mobileNav = container.querySelector('#home-mobile-nav');
		expect(menuButton).toHaveAttribute('aria-expanded', 'false');
		expect(mobileNav).toHaveAttribute('hidden');

		click(menuButton);
		expect(menuButton).toHaveAttribute('aria-expanded', 'true');
		expect(menuButton).toHaveAttribute('aria-label', '메뉴 닫기');
		expect(mobileNav).not.toHaveAttribute('hidden');

		pressKey('Escape');
		expect(menuButton).toHaveAttribute('aria-expanded', 'false');
		expect(mobileNav).toHaveAttribute('hidden');
		expect(document.activeElement).toBe(menuButton);

		click(menuButton);
		click(byText(mobileNav, 'a', 'About'));
		expect(mobileNav).toHaveAttribute('hidden');
		expect(menuButton).toHaveAttribute('aria-expanded', 'false');
	});

	it('메뉴가 닫혀 있을 때 Escape 는 포커스를 옮기지 않음', () => {
		const { container } = renderHome();
		const input = searchInput(container);
		input.focus();
		pressKey('Escape');
		expect(document.activeElement).toBe(input);
	});
});
