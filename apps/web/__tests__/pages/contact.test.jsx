import '@testing-library/jest-dom';
// jsdom 에는 TextEncoder 가 없어 Node 용 서버 렌더러를 직접 쓴다.
import { renderToString } from 'react-dom/server.node';
import { hydrateRoot } from 'react-dom/client';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import ReactMarkdown from 'react-markdown';
import ContactPage, { getServerSideProps } from '../../pages/contact';
import ProjectsLayout from '../../components/projects/minimal/ProjectsLayout';
import { COPIED, COPY_FAILED } from '../../components/contact/minimal/Contact';
import { CONTACT_ENDPOINT, SUBMIT_SUCCESS } from '../../components/contact/minimal/ContactForm';
import { ContactMarkdownLink } from '../../components/contact/minimal/ContactMarkdown';
import { act, byText, cleanup, click, render } from '../helpers/render';

// react-markdown 은 ESM 전용이라 Jest(CommonJS) 에서 직접 불러올 수 없다. 답변 전달과
// 컴포넌트 매핑(링크 / 제목 수준)만 확인하고, 실제 Markdown 결과는 브라우저 검증에서 본다.
jest.mock('react-markdown', () => {
	const React = require('react');
	return {
		__esModule: true,
		default: jest.fn(({ children }) => React.createElement('p', { 'data-markdown': '' }, children)),
	};
});

const EMAIL = 'choonarm3@gmail.com';
const ADDRESS = '충청북도 청주시 흥덕구, 2순환로 1228';

// 현재 /api/about 공개 응답과 같은 모양 (화면에서 쓰지 않는 필드 포함).
const apiData = {
	name: '이석호',
	tagline: 'Backend Developer',
	email: EMAIL,
	phone: '010-0000-0000',
	address: ADDRESS,
	availability: null,
	socials: [],
	faqs: [],
	bio: ['unused bio'],
};
const contact = { address: ADDRESS, email: EMAIL, availability: null, socials: [], faqs: [] };

const populated = {
	email: EMAIL,
	address: ADDRESS,
	availability: '2027년 상반기 신입 백엔드 포지션을 찾고 있습니다',
	socials: [
		{ label: 'GitHub', url: 'https://github.com/LLagoon3' },
		{ label: '메일로 보내기', url: 'mailto:other@example.com' },
		{ label: '잘못된 링크', url: 'javascript:alert(1)' },
	],
	faqs: [
		{ question: '신입 채용 외에 외주도 받나요?', answer: '# 네\n\n일정이 맞으면 **가능합니다**. [포트폴리오](https://example.com)' },
		{ question: '답장은 어디로 오나요?', answer: '입력하신 이메일로 드립니다.' },
	],
};

const json = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => data });
const nonJson = (status) => ({
	ok: false,
	status,
	json: async () => {
		throw new SyntaxError('Unexpected token < in JSON');
	},
});

let router;
function makeRouter() {
	return {
		pathname: '/contact',
		route: '/contact',
		asPath: '/contact',
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
			{ContactPage.getLayout(<ContactPage {...pageProps} />)}
		</RouterContext.Provider>
	);
}

const renderPage = (data = contact) => render(page({ contact: data }));
const texts = (root, selector) => Array.from(root.querySelectorAll(selector)).map((el) => el.textContent);
const countText = (root, text) => root.textContent.split(text).length - 1;

// 폼 조작 헬퍼. React 는 네이티브 input 이벤트를 듣기 때문에 setter 로 값을 바꾼 뒤 발생시킨다.
function type(field, value) {
	const proto = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
	const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
	act(() => {
		setter.call(field, value);
		field.dispatchEvent(new Event('input', { bubbles: true }));
	});
}

function blur(field) {
	act(() => {
		field.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
	});
}

function formParts(container) {
	const form = container.querySelector('form');
	const field = (label) => {
		const el = byText(form, 'label', label) ?? Array.from(form.querySelectorAll('label')).find((l) => l.textContent.startsWith(label));
		return form.querySelector(`#${el.getAttribute('for')}`);
	};
	return {
		form,
		name: field('이름'),
		email: field('이메일'),
		company: field('소속'),
		message: field('메시지'),
		radios: Array.from(form.querySelectorAll('input[type="radio"]')),
		submit: form.querySelector('button[type="submit"]'),
		status: form.querySelector('[role="status"]'),
		alert: () => form.querySelector('[role="alert"]'),
	};
}

function fillValid(parts, { company = '' } = {}) {
	type(parts.name, '  홍길동 ');
	type(parts.email, ' hong@example.com ');
	type(parts.company, company);
	type(parts.message, '\n안녕하세요.\n함께 일하고 싶습니다. ');
}

async function submit(parts) {
	await act(async () => {
		parts.submit.click();
	});
}

// fetch 결과를 테스트가 정할 때까지 붙잡아 둔다.
function deferredFetch() {
	let resolve;
	let reject;
	global.fetch = jest.fn(
		() =>
			new Promise((res, rej) => {
				resolve = res;
				reject = rej;
			}),
	);
	return {
		resolve: async (value) => act(async () => resolve(value)),
		reject: async (error) => act(async () => reject(error)),
	};
}

function mockFetch(response) {
	global.fetch = jest.fn(() => (response instanceof Error ? Promise.reject(response) : Promise.resolve(response)));
}

function mockClipboard(writeText) {
	Object.defineProperty(navigator, 'clipboard', { value: writeText ? { writeText } : undefined, configurable: true });
}

// 모바일 메뉴 폭 판단(matchMedia)을 흉내 낸다.
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
	};
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
	jest.useRealTimers();
	jest.restoreAllMocks();
	delete global.fetch;
	delete window.matchMedia;
	delete navigator.clipboard;
});

describe('getServerSideProps', () => {
	it('/api/about 에서 연락처 필드만 props 로 (phone 등은 넘기지 않음)', async () => {
		mockFetch(json({ success: true, data: apiData }));
		await expect(getServerSideProps()).resolves.toEqual({ props: { contact } });
		expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/about$/));
		expect(global.fetch).toHaveBeenCalledTimes(1);
		expect(console.error).not.toHaveBeenCalled();
	});

	it('404 와 data 없는 응답은 빈 연락처', async () => {
		const empty = { props: { contact: { address: null, email: null, availability: null, socials: [], faqs: [] } } };
		mockFetch(json({ message: 'not found' }, 404));
		await expect(getServerSideProps()).resolves.toEqual(empty);
		mockFetch(json({ success: true }));
		await expect(getServerSideProps()).resolves.toEqual(empty);
		mockFetch(json({ success: true, data: { email: null } }));
		await expect(getServerSideProps()).resolves.toEqual(empty);
	});

	it('5xx / 네트워크 오류는 감추지 않고 에러로 드러냄', async () => {
		mockFetch(json({}, 503));
		await expect(getServerSideProps()).rejects.toThrow('[contact] About API returned 503');
		mockFetch(new Error('ECONNREFUSED'));
		await expect(getServerSideProps()).rejects.toThrow('ECONNREFUSED');
		expect(console.error).toHaveBeenCalledWith('[contact] fetch failed', expect.any(Error));
	});
});

describe('구조와 레이아웃', () => {
	it('전환 shell 없이 정적 레이아웃: Contact 만 aria-current, skip link', () => {
		expect(ContactPage.minimalShell).toBe(true);
		const { container } = renderPage();

		expect(container.querySelector('a[aria-label="Lagoon 홈"]')).toHaveAttribute('href', '/');
		['주 메뉴', '모바일 메뉴'].forEach((label) => {
			const links = Array.from(container.querySelectorAll(`nav[aria-label="${label}"] a`));
			expect(links.map((a) => a.getAttribute('href'))).toEqual(['/projects', '/about', '/contact']);
			expect(links.map((a) => a.getAttribute('aria-current'))).toEqual([null, null, 'page']);
		});
		expect(container.querySelectorAll('[aria-current]')).toHaveLength(2);
		expect(byText(container, 'a', '본문으로 바로 가기')).toHaveAttribute('href', '#main');
		expect(container.querySelector('main#main')).toHaveAttribute('tabindex', '-1');
		expect(container.querySelector('.bold-root, .bold-grain, .bold-interactive, .animate-ping')).toBeNull();
	});

	it('h1 하나, 섹션 제목 순서, 장식 / 중복 CTA / 지어낸 정보 없음', () => {
		const { container } = renderPage();
		expect(container.querySelectorAll('h1')).toHaveLength(1);
		expect(container.querySelector('h1')).toHaveTextContent(/^함께할 기회를 기다립니다$/);
		expect(container.querySelector('h1').nextElementSibling).toHaveTextContent(/^답장은 가능한 한 24시간 안에 드립니다$/);
		expect(texts(container, 'main h2')).toEqual(['직접 연락', '메시지 보내기']);
		Array.from(container.querySelectorAll('main section')).forEach((s) => {
			expect(container.querySelector(`#${s.getAttribute('aria-labelledby')}`)).toBeInTheDocument();
		});
		[
			'Hire Me',
			'Seoul',
			'KST',
			'Availability',
			'자주 받는 질문',
			'010-0000-0000',
			'전송됐어요',
			'미리보기',
			'링크',
		].forEach((text) => expect(container.textContent).not.toContain(text));
	});

	it('푸터: 연락 안내 줄 없이 저작권과 맨 위로만', () => {
		const { container } = renderPage();
		const footer = container.querySelector('footer');
		expect(Array.from(footer.querySelectorAll('a')).map((a) => a.getAttribute('href'))).toEqual(['#top']);
		expect(footer).not.toHaveTextContent('함께할 기회를 기다립니다');
		expect(footer).not.toHaveTextContent('연락하기');
		expect(footer.textContent).toMatch(/© \d{4} 이석호 · Lagoon/);
		expect(container.querySelector('#top')).toContainElement(footer);
	});

	it('공용 레이아웃 기본값은 기존 푸터(연락 안내 + 연락하기 + 맨 위로) 그대로', () => {
		const { container } = render(
			<RouterContext.Provider value={router}>
				<ProjectsLayout>
					<p>본문</p>
				</ProjectsLayout>
			</RouterContext.Provider>,
		);
		const footer = container.querySelector('footer');
		expect(footer.className).toBe('footer');
		expect(footer).toHaveTextContent('함께할 기회를 기다립니다');
		expect(Array.from(footer.querySelectorAll('a')).map((a) => a.getAttribute('href'))).toEqual(['/contact', '#top']);
		expect(container.querySelector('nav[aria-label="주 메뉴"] a[aria-current="page"]')).toHaveTextContent('Projects');
		expect(container.querySelector('footer').className).not.toContain('footerBare');
	});
});

describe('공개 연락처', () => {
	it('이메일은 한 번만, mailto 링크와 복사 버튼은 따로. 주소는 그대로', () => {
		mockClipboard(jest.fn(() => Promise.resolve()));
		const { container } = renderPage();
		expect(countText(container, EMAIL)).toBe(1);
		const mail = byText(container, 'a', EMAIL);
		expect(mail).toHaveAttribute('href', `mailto:${EMAIL}`);
		expect(mail).not.toHaveAttribute('target');
		const dl = container.querySelector('main dl');
		expect(texts(dl, 'dt')).toEqual(['이메일', '주소']);
		expect(dl.querySelectorAll('dd')[1]).toHaveTextContent(new RegExp(`^${ADDRESS}$`));

		// 메일 링크를 눌러도 클립보드는 건드리지 않는다.
		mail.addEventListener('click', (event) => event.preventDefault());
		click(mail);
		expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
	});

	it('있을 때만: availability 문장, 소셜 링크(안전한 주소만 링크), FAQ(질문 h3 + Markdown 답변)', () => {
		const { container } = renderPage(populated);
		expect(container.querySelector('h1').parentElement).toHaveTextContent(populated.availability);
		const dl = container.querySelector('main dl');
		expect(texts(dl, 'dt')).toEqual(['이메일', '주소', '링크']);

		const github = byText(dl, 'a', 'GitHub (새 탭)');
		expect(github).toHaveAttribute('href', 'https://github.com/LLagoon3');
		expect(github).toHaveAttribute('target', '_blank');
		expect(github).toHaveAttribute('rel', 'noopener noreferrer');
		const mailto = byText(dl, 'a', '메일로 보내기');
		expect(mailto).toHaveAttribute('href', 'mailto:other@example.com');
		expect(mailto).not.toHaveAttribute('target');
		expect(dl).toHaveTextContent('잘못된 링크');
		expect(byText(dl, 'a', '잘못된 링크')).toBeUndefined();
		expect(container.querySelector('a[href^="javascript"]')).toBeNull();

		expect(texts(container, 'main h2')).toEqual(['직접 연락', '메시지 보내기', '자주 받는 질문']);
		const faq = container.querySelector('section[aria-labelledby="contact-faq-title"]');
		expect(texts(faq, 'h3')).toEqual(populated.faqs.map((f) => f.question));
		expect(ReactMarkdown).toHaveBeenCalledTimes(2);
		expect(ReactMarkdown.mock.calls.map(([props]) => props.children)).toEqual(populated.faqs.map((f) => f.answer));
		const { components } = ReactMarkdown.mock.calls[0][0];
		expect(components.a).toBe(ContactMarkdownLink);
		expect(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => renderToString(components[tag]({ children: 'x' })))).toEqual([
			'<h4>x</h4>',
			'<h5>x</h5>',
			'<h6>x</h6>',
			'<h6>x</h6>',
			'<h6>x</h6>',
			'<h6>x</h6>',
		]);
	});

	it('Markdown 링크: 외부는 새 탭 + 안전한 rel + (새 탭), 내부 / mailto 는 그대로', () => {
		const { container } = render(
			<div>
				<ContactMarkdownLink href="https://example.com/a">외부</ContactMarkdownLink>
				<ContactMarkdownLink href="/projects">내부</ContactMarkdownLink>
				<ContactMarkdownLink href="mailto:a@b.co">메일</ContactMarkdownLink>
			</div>,
		);
		const [external, internal, mail] = container.querySelectorAll('a');
		expect(external).toHaveAttribute('target', '_blank');
		expect(external).toHaveAttribute('rel', 'noopener noreferrer');
		expect(external).toHaveTextContent('외부 (새 탭)');
		[internal, mail].forEach((a) => {
			expect(a).not.toHaveAttribute('target');
			expect(a).not.toHaveAttribute('rel');
		});
	});

	it('값이 없으면 해당 줄 / 블록을 통째로 생략 (기본 이메일 / 지역 없음)', () => {
		const { container } = renderPage({ email: null, address: ADDRESS, availability: null, socials: [], faqs: [] });
		expect(texts(container, 'main dt')).toEqual(['주소']);
		expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
		expect(byText(container, 'button', '이메일 복사')).toBeUndefined();
		cleanup();

		const empty = renderPage({ email: null, address: null, availability: null, socials: [], faqs: [] }).container;
		expect(empty.querySelector('main dl')).toBeNull();
		expect(texts(empty, 'main h2')).toEqual(['메시지 보내기']);
		expect(empty.querySelector('section[aria-labelledby="contact-title"]').className).toContain('introSingle');
		expect(empty.querySelector('form')).toBeInTheDocument();
		['@', 'Seoul', '서울', 'KST'].forEach((text) => expect(empty.querySelector('main').textContent).not.toContain(text));
	});

	it('공개 값은 텍스트로만 렌더 (HTML 해석 없음)', () => {
		const { container } = renderPage({
			...populated,
			address: '<img src=x onerror=alert(1)>',
			availability: '<b>굵게</b>',
			faqs: [{ question: '<script>x</script>', answer: 'a' }],
		});
		expect(container.querySelector('main img, main script, main b')).toBeNull();
		expect(container.textContent).toContain('<img src=x onerror=alert(1)>');
	});
});

describe('이메일 복사', () => {
	it('성공: 클립보드에 공개 이메일, 버튼 문구 / 상태를 잠시 바꿨다 되돌림', async () => {
		jest.useFakeTimers();
		const writeText = jest.fn(() => Promise.resolve());
		mockClipboard(writeText);
		const { container } = renderPage();
		const copy = byText(container, 'button', '이메일 복사');
		const status = copy.closest('dd').querySelector('[role="status"]');
		const hint = copy.closest('dd').querySelector('p[hidden]');
		expect(copy).toBeEnabled();
		expect(hint).toHaveTextContent(COPY_FAILED);

		await act(async () => copy.click());
		expect(writeText).toHaveBeenCalledWith(EMAIL);
		expect(copy).toHaveTextContent('복사했습니다');
		expect(status).toHaveTextContent(COPIED);
		expect(hint).not.toBeVisible();

		act(() => jest.advanceTimersByTime(3000));
		expect(copy).toHaveTextContent('이메일 복사');
		expect(status).toHaveTextContent('');
	});

	it('클립보드 거부 / 미지원: 성공처럼 보이지 않고 직접 선택 안내', async () => {
		mockClipboard(jest.fn(() => Promise.reject(new Error('denied'))));
		let { container } = renderPage();
		let copy = byText(container, 'button', '이메일 복사');
		await act(async () => copy.click());
		expect(copy).toHaveTextContent('이메일 복사');
		expect(copy.closest('dd').querySelector('[role="status"]')).toHaveTextContent(COPY_FAILED);
		expect(Array.from(copy.closest('dd').querySelectorAll('p')).find((p) => !p.getAttribute('role'))).not.toHaveAttribute(
			'hidden',
		);
		cleanup();

		mockClipboard(undefined);
		({ container } = renderPage());
		copy = byText(container, 'button', '이메일 복사');
		await act(async () => copy.click());
		expect(copy).toHaveTextContent('이메일 복사');
		expect(copy.closest('dd').querySelector('[role="status"]')).toHaveTextContent(COPY_FAILED);
	});
});

describe('문의 폼: 구조', () => {
	it('보이는 라벨 / legend, 네이티브 라디오 4개(기본 신입 채용), 필수 / 선택, API 길이 제한', () => {
		const { container } = renderPage();
		const parts = formParts(container);
		expect(parts.form).toHaveAttribute('aria-labelledby', 'contact-form-title');
		expect(parts.form).not.toHaveAttribute('action');
		expect(parts.form.querySelector('fieldset legend')).toHaveTextContent('문의 종류');
		expect(parts.radios.map((r) => [r.name, r.value, r.checked])).toEqual([
			['topic', '신입 채용', true],
			['topic', '외주 · 협업', false],
			['topic', '기술 잡담', false],
			['topic', '기타', false],
		]);
		parts.radios.forEach((radio) => expect(radio.closest('label')).toHaveTextContent(radio.value));
		expect(parts.name).toHaveAttribute('maxlength', '100');
		expect(parts.email).toHaveAttribute('maxlength', '255');
		expect(parts.email).toHaveAttribute('type', 'email');
		expect(parts.message.tagName).toBe('TEXTAREA');
		[parts.name, parts.email, parts.message].forEach((f) => expect(f).toBeRequired());
		expect(parts.company).not.toBeRequired();
		expect(byText(parts.form, 'label', '소속(선택)')).toBeInTheDocument();
		expect(parts.form.querySelectorAll('[placeholder]')).toHaveLength(0);
		expect(parts.submit).toHaveTextContent('메시지 보내기');
		expect(parts.submit).toBeEnabled();
	});

	it('서버 HTML: JS 전에는 보내기 / 복사 버튼이 비활성이고 noscript 안내가 있음 (입력값이 GET 으로 새지 않게)', () => {
		const html = renderToString(page({ contact }));
		const doc = new DOMParser().parseFromString(html, 'text/html');
		expect(doc.querySelector('form button[type="submit"]').hasAttribute('disabled')).toBe(true);
		expect(doc.querySelector('form').hasAttribute('novalidate')).toBe(true);
		expect(doc.querySelector('form').hasAttribute('action')).toBe(false);
		expect(html).toContain('메시지를 보내려면 JavaScript를 켜 주세요');
		const copy = Array.from(doc.querySelectorAll('button')).find((b) => b.textContent === '이메일 복사');
		expect(copy.hasAttribute('disabled')).toBe(true);
		expect(copy.className).toContain('copyPending');
		expect(html).toContain('함께할 기회를 기다립니다');
		expect(html).toContain(ADDRESS);
	});
});

describe('문의 폼: 검증', () => {
	it('빈 제출: 세 필드에 인라인 오류, aria-invalid / describedby, 첫 오류로 포커스, 전송 없음', async () => {
		global.fetch = jest.fn();
		const { container } = renderPage();
		const parts = formParts(container);
		type(parts.name, '   ');
		await submit(parts);

		expect(global.fetch).not.toHaveBeenCalled();
		[
			[parts.name, '이름을 입력해 주세요'],
			[parts.email, '이메일을 입력해 주세요'],
			[parts.message, '메시지를 입력해 주세요'],
		].forEach(([field, message]) => {
			expect(field).toHaveAttribute('aria-invalid', 'true');
			expect(document.getElementById(field.getAttribute('aria-describedby'))).toHaveTextContent(message);
		});
		expect(parts.company).not.toHaveAttribute('aria-invalid');
		expect(document.activeElement).toBe(parts.name);
	});

	it('이메일 형식 오류는 그 필드로 포커스, 고치면 바로 오류 해제', async () => {
		global.fetch = jest.fn();
		const { container } = renderPage();
		const parts = formParts(container);
		type(parts.name, '홍길동');
		type(parts.email, 'hong@example');
		type(parts.message, '안녕하세요');
		await submit(parts);
		expect(global.fetch).not.toHaveBeenCalled();
		expect(document.activeElement).toBe(parts.email);
		expect(document.getElementById(parts.email.getAttribute('aria-describedby'))).toHaveTextContent('이메일 형식을 확인해 주세요');
		expect(parts.name).not.toHaveAttribute('aria-invalid');

		type(parts.email, 'hong@example.com');
		expect(parts.email).not.toHaveAttribute('aria-invalid');
		expect(parts.email).not.toHaveAttribute('aria-describedby');
	});

	it('입력 후 포커스를 벗어나면 확인, 아무것도 안 쓴 채 지나가면 조용히', () => {
		const { container } = renderPage();
		const parts = formParts(container);
		blur(parts.name);
		expect(parts.name).not.toHaveAttribute('aria-invalid');
		type(parts.email, 'nope');
		blur(parts.email);
		expect(parts.email).toHaveAttribute('aria-invalid', 'true');
	});
});

describe('문의 폼: 전송', () => {
	it('기존 계약 그대로 POST (trim, 소속 단락, 선택한 topic) / 보내는 중 중복 제출 차단 / 실제 성공 뒤에만 접수 문구 + 초기화', async () => {
		const pendingFetch = deferredFetch();
		const { container } = renderPage();
		const parts = formParts(container);
		fillValid(parts, { company: ' 라군 컴퍼니 ' });
		click(parts.radios[2]);
		expect(parts.radios[2]).toBeChecked();
		await submit(parts);

		expect(global.fetch).toHaveBeenCalledTimes(1);
		const [url, init] = global.fetch.mock.calls[0];
		expect(url).toBe(CONTACT_ENDPOINT);
		expect(url).toBe('/api/contact');
		expect(init.method).toBe('POST');
		expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
		expect(JSON.parse(init.body)).toEqual({
			name: '홍길동',
			email: 'hong@example.com',
			message: '[소속] 라군 컴퍼니\n\n안녕하세요.\n함께 일하고 싶습니다.',
			topic: '기술 잡담',
		});

		// 보내는 중: 버튼 비활성 + 문구, 다시 눌러도 / Enter 제출해도 추가 요청 없음, 아직 성공 문구 없음
		expect(parts.submit).toBeDisabled();
		expect(parts.submit).toHaveTextContent('보내는 중…');
		await submit(parts);
		await act(async () => {
			parts.form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
		});
		expect(global.fetch).toHaveBeenCalledTimes(1);
		expect(parts.status).toHaveTextContent('');
		expect(container.textContent).not.toContain(SUBMIT_SUCCESS);

		await pendingFetch.resolve(json({ success: true, data: { id: 1 } }, 201));
		expect(parts.status).toHaveTextContent(SUBMIT_SUCCESS);
		expect(SUBMIT_SUCCESS).toBe('문의가 접수되었습니다');
		expect(parts.alert()).toBeNull();
		[parts.name, parts.email, parts.company, parts.message].forEach((f) => expect(f).toHaveValue(''));
		expect(parts.radios[0]).toBeChecked();
		expect(parts.submit).toBeEnabled();
		expect(parts.submit).toHaveTextContent('메시지 보내기');
		// 입력값은 저장소에 남기지 않는다 (테마만).
		expect(Object.keys(localStorage)).toEqual(['theme']);

		// 다시 쓰기 시작하면 지난 접수 문구는 사라진다.
		type(parts.name, '다');
		expect(parts.status).toHaveTextContent('');
	});

	it('네 가지 topic 모두 그대로 전송, 소속이 비면 메시지에 단락을 붙이지 않음', async () => {
		mockFetch(json({ success: true }, 201));
		const { container } = renderPage();
		const parts = formParts(container);
		const sent = [];
		for (let i = 0; i < parts.radios.length; i += 1) {
			fillValid(parts);
			click(parts.radios[i]);
			await submit(parts);
			sent.push(JSON.parse(global.fetch.mock.calls[i][1].body));
		}
		expect(sent.map((body) => body.topic)).toEqual(['신입 채용', '외주 · 협업', '기술 잡담', '기타']);
		sent.forEach((body) => expect(body.message).toBe('안녕하세요.\n함께 일하고 싶습니다.'));
	});

	it.each([
		['문자열 message', json({ message: '잘못된 요청입니다' }, 400), '메시지를 보내지 못했습니다. 잘못된 요청입니다'],
		[
			'배열 message',
			json({ message: ['email must be an email', 'name should not be empty'] }, 400),
			'메시지를 보내지 못했습니다. email must be an email, name should not be empty',
		],
		[
			'중첩 error.message (이 API 형식)',
			json({ success: false, error: { statusCode: 400, message: 'email must be an email' } }, 400),
			'메시지를 보내지 못했습니다. email must be an email',
		],
		['문자열 error', json({ error: 'Too Many Requests' }, 429), '메시지를 보내지 못했습니다. Too Many Requests'],
		['JSON 이 아닌 본문', nonJson(502), '메시지를 보내지 못했습니다. 잠시 후 다시 시도해 주세요.'],
		[
			'5xx 내부 문구는 노출하지 않음',
			json({ success: false, error: { message: 'QueryFailedError: secret' } }, 500),
			'메시지를 보내지 못했습니다. 잠시 후 다시 시도해 주세요.',
		],
		['네트워크 오류', new TypeError('Failed to fetch'), '메시지를 보내지 못했습니다. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.'],
	])('실패(%s): 읽을 수 있는 alert, 입력 / topic 유지, 성공 문구 없음', async (_, response, message) => {
		mockFetch(response);
		const { container } = renderPage();
		const parts = formParts(container);
		fillValid(parts, { company: '라군' });
		click(parts.radios[3]);
		await submit(parts);

		expect(global.fetch).toHaveBeenCalledTimes(1);
		expect(parts.alert()).toHaveTextContent(new RegExp(`^${message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
		expect(parts.status).toHaveTextContent('');
		expect(container.textContent).not.toContain(SUBMIT_SUCCESS);
		expect(parts.name).toHaveValue('  홍길동 ');
		// type=email 은 브라우저가 앞뒤 공백을 자동으로 정리한다.
		expect(parts.email).toHaveValue('hong@example.com');
		expect(parts.company).toHaveValue('라군');
		expect(parts.message).toHaveValue('\n안녕하세요.\n함께 일하고 싶습니다. ');
		expect(parts.radios[3]).toBeChecked();
		expect(parts.submit).toBeEnabled();

		// 고치기 시작하면 지난 실패 안내를 지운다 (topic 변경도 같다).
		click(parts.radios[0]);
		expect(parts.alert()).toBeNull();
	});

	it('실패 뒤 다시 보내 성공할 수 있음', async () => {
		mockFetch(json({ message: '잠시 후' }, 400));
		const { container } = renderPage();
		const parts = formParts(container);
		fillValid(parts);
		await submit(parts);
		expect(parts.alert()).toBeInTheDocument();
		mockFetch(json({ success: true }, 201));
		await submit(parts);
		expect(parts.alert()).toBeNull();
		expect(parts.status).toHaveTextContent(SUBMIT_SUCCESS);
	});
});

describe('헤더 상호작용', () => {
	it('테마 버튼은 기존 theme 저장소와 <html> 클래스를 함께 전환 (입력값은 저장하지 않음)', () => {
		const { container } = renderPage();
		const button = container.querySelector('button[aria-label="다크 테마로 전환"]');
		click(button);
		expect(localStorage.getItem('theme')).toBe('dark');
		expect(document.documentElement).toHaveClass('dark');
		expect(Object.keys(localStorage)).toEqual(['theme']);
	});

	it('모바일 메뉴: Escape 로 닫고 메뉴 버튼으로 포커스, 데스크톱 폭이 되면 닫고 같은 링크로', () => {
		const viewport = mockViewport(true);
		const { container } = renderPage();
		const toggle = container.querySelector('button[aria-controls]');
		const mobileNav = container.querySelector('nav[aria-label="모바일 메뉴"]');
		click(toggle);
		expect(mobileNav).not.toHaveAttribute('hidden');
		act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })));
		expect(mobileNav).toHaveAttribute('hidden');
		expect(document.activeElement).toBe(toggle);

		click(toggle);
		const current = mobileNav.querySelector('a[aria-current="page"]');
		act(() => current.focus());
		viewport.set(false);
		expect(mobileNav).toHaveAttribute('hidden');
		expect(document.activeElement).toBe(container.querySelector('nav[aria-label="주 메뉴"] a[aria-current="page"]'));
	});
});

describe('hydration', () => {
	it('서버 HTML 과 같은 내용으로 hydrate (빈 / 채워진 연락처 모두)', async () => {
		for (const data of [contact, populated]) {
			const html = renderToString(page({ contact: data }));
			console.error.mockClear();
			const container = document.createElement('div');
			container.innerHTML = html;
			document.body.appendChild(container);

			const recoverable = jest.fn();
			let root;
			await act(async () => {
				root = hydrateRoot(container, page({ contact: data }), { onRecoverableError: recoverable });
			});
			expect(recoverable).not.toHaveBeenCalled();
			expect(console.error).not.toHaveBeenCalled();
			// 붙은 뒤에는 보내기 / 복사가 동작한다.
			expect(container.querySelector('form button[type="submit"]')).toBeEnabled();
			expect(byText(container, 'button', '이메일 복사')).toBeEnabled();

			act(() => root.unmount());
			container.remove();
		}
	});
});
