import '@testing-library/jest-dom';
import MyApp from '../../pages/_app';
import { act, cleanup, render } from '../helpers/render';

const mockRouter = { pathname: '/', asPath: '/' };
jest.mock('next/router', () => ({ useRouter: () => mockRouter }));

function makePage({ minimalShell } = {}) {
	const Page = () => <div data-testid="page">page</div>;
	Page.getLayout = (page) => <div data-testid="layout">{page}</div>;
	if (minimalShell) Page.minimalShell = true;
	return Page;
}

function scrollPastThreshold() {
	Object.defineProperty(window, 'pageYOffset', { value: 500, configurable: true, writable: true });
	act(() => {
		window.dispatchEvent(new Event('scroll'));
	});
}

afterEach(() => {
	cleanup();
	Object.defineProperty(window, 'pageYOffset', { value: 0, configurable: true, writable: true });
	mockRouter.pathname = '/';
	mockRouter.asPath = '/';
});

describe('_app shell', () => {
	it('일반 공개 페이지는 기존처럼 전환 wrapper 와 맨 위로 버튼을 사용', () => {
		const { container } = render(<MyApp Component={makePage()} pageProps={{}} />);
		const layout = container.querySelector('[data-testid="layout"]');
		const page = container.querySelector('[data-testid="page"]');
		expect(layout.firstElementChild).not.toBe(page);
		expect(layout.firstElementChild).toContainElement(page);

		scrollPastThreshold();
		expect(container.querySelector('button[aria-label="Back to top"]')).toBeInTheDocument();
	});

	it('minimalShell 페이지(홈)는 전환 wrapper 와 플로팅 맨 위로 버튼 없이 렌더', () => {
		const { container } = render(
			<MyApp Component={makePage({ minimalShell: true })} pageProps={{}} />,
		);
		const layout = container.querySelector('[data-testid="layout"]');
		expect(layout.firstElementChild).toBe(container.querySelector('[data-testid="page"]'));

		scrollPastThreshold();
		expect(container.querySelector('button[aria-label="Back to top"]')).toBeNull();
	});

	it('어드민은 기존처럼 전환 wrapper 없이 렌더', () => {
		mockRouter.pathname = '/admin';
		mockRouter.asPath = '/admin';
		const { container } = render(<MyApp Component={makePage()} pageProps={{}} />);
		const layout = container.querySelector('[data-testid="layout"]');
		expect(layout.firstElementChild).toBe(container.querySelector('[data-testid="page"]'));
	});
});
