// @testing-library/dom 없이 react-dom 만으로 렌더/이벤트를 다루는 최소 헬퍼.
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import * as TestUtils from 'react-dom/test-utils';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

export const act = typeof React.act === 'function' ? React.act : TestUtils.act;

const mounted = new Set();

export function render(ui) {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(ui);
	});
	const handle = { container, root };
	mounted.add(handle);
	return handle;
}

export function cleanup() {
	mounted.forEach(({ container, root }) => {
		act(() => root.unmount());
		container.remove();
	});
	mounted.clear();
}

export function click(element) {
	act(() => {
		element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
	});
}

// React 의 onChange 는 네이티브 input 이벤트를 듣기 때문에 setter 로 값을 바꾼 뒤 발생시킨다.
export function typeInto(input, value) {
	const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
	act(() => {
		setter.call(input, value);
		input.dispatchEvent(new Event('input', { bubbles: true }));
	});
}

export function pressKey(key, target = document) {
	act(() => {
		target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
	});
}

export function byText(root, selector, text) {
	return Array.from(root.querySelectorAll(selector)).find(
		(el) => el.textContent.trim() === text,
	);
}
