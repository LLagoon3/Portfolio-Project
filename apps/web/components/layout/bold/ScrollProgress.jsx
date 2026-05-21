import { useEffect, useRef } from 'react';

// 상단 2px gradient bar. 스크롤 위치 비율을 width 로 표현.
export default function ScrollProgress() {
	const barRef = useRef(null);

	useEffect(() => {
		const bar = barRef.current;
		if (!bar) return;
		const update = () => {
			const root = document.documentElement;
			const max = root.scrollHeight - root.clientHeight;
			bar.style.width = max > 0 ? `${(root.scrollTop / max) * 100}%` : '0%';
		};
		update();
		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update);
		return () => {
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		};
	}, []);

	return (
		<div
			ref={barRef}
			aria-hidden="true"
			className="fixed top-0 left-0 h-[2px] z-[60]"
			style={{
				background: 'linear-gradient(90deg, var(--indigo), var(--indigo-soft))',
				width: '0%',
				transition: 'width 0.12s linear',
			}}
		/>
	);
}
