import { useEffect, useRef } from 'react';
import useReducedMotion from './useReducedMotion';

// 화면 위에 떠다니는 indigo 닷.
// - touch / coarse pointer 디바이스에서는 조기 return (모바일 무영향)
// - prefers-reduced-motion 시에도 비활성
// - mousemove 로 위치 추적, interactive 요소 hover 시 크기 확장
// - unmount 시 mousemove + 동적으로 바인딩된 mouseenter/leave + DOM marker 모두 정리.
export default function useCursorDot() {
	const dotRef = useRef(null);
	const reduced = useReducedMotion();

	useEffect(() => {
		if (typeof window === 'undefined' || reduced) return undefined;
		// touch / coarse pointer 환경 (모바일) 에서는 dot 자체를 안 띄움
		if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return undefined;

		const dot = dotRef.current;
		if (!dot) return undefined;

		let visible = false;
		const handleMove = (e) => {
			if (!visible) {
				dot.style.opacity = '1';
				visible = true;
			}
			dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
		};

		const interactiveSelectors = 'a, button, [role="button"], .bold-interactive';
		const handleEnter = () => {
			dot.style.width = '36px';
			dot.style.height = '36px';
		};
		const handleLeave = () => {
			dot.style.width = '8px';
			dot.style.height = '8px';
		};

		// bind 된 (element, marker) 추적 — cleanup 시 핸들러 제거 + marker reset.
		// 모든 카드가 같은 handleEnter/handleLeave 함수 인스턴스를 공유하므로 element 만 보관.
		const boundEls = new Set();
		const bind = () => {
			document.querySelectorAll(interactiveSelectors).forEach((el) => {
				if (el.dataset.boldCursorBound) return;
				el.dataset.boldCursorBound = '1';
				el.addEventListener('mouseenter', handleEnter);
				el.addEventListener('mouseleave', handleLeave);
				boundEls.add(el);
			});
		};

		window.addEventListener('mousemove', handleMove);
		bind();
		// 동적으로 추가된 요소(예: 필터 후 다시 렌더된 카드) 도 따라가도록
		const mo = new MutationObserver(bind);
		mo.observe(document.body, { childList: true, subtree: true });

		return () => {
			window.removeEventListener('mousemove', handleMove);
			mo.disconnect();
			boundEls.forEach((el) => {
				el.removeEventListener('mouseenter', handleEnter);
				el.removeEventListener('mouseleave', handleLeave);
				delete el.dataset.boldCursorBound;
			});
			boundEls.clear();
		};
	}, [reduced]);

	return dotRef;
}
