import { useEffect, useState } from 'react';

// matchMedia('(prefers-reduced-motion: reduce)') 래퍼.
// SSR 시점에는 false 반환 (UI 가 모션 ON 상태로 페인트된 뒤, 클라이언트에서 정정).
export default function useReducedMotion() {
	const [reduced, setReduced] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined' || !window.matchMedia) return;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => setReduced(mq.matches);
		update();
		mq.addEventListener('change', update);
		return () => mq.removeEventListener('change', update);
	}, []);

	return reduced;
}
