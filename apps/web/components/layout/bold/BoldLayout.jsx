import { useEffect, useState } from 'react';
import BoldHeader from './BoldHeader';
import BoldFooter from './BoldFooter';
import ScrollProgress from './ScrollProgress';
import CursorDot from './CursorDot';

// Bold 페이지 전용 wrapper.
// - 다크 ink 배경 + grain 텍스처 + scroll progress + cursor dot
// - DARK/LIGHT 토글 시 wrapper 에 .bold-light 클래스 추가하여 CSS 변수 swap
// - 기존 DefaultLayout 페이지에는 영향 없음 (getLayout 미지정 시 fallback)
// - <Head> 메타는 페이지에서 직접 <PagesMetaHead title=... /> 호출
export default function BoldLayout({ children }) {
	// useThemeSwitcher 는 호출하는 컴포넌트마다 독립된 useState 인스턴스를 가지므로
	// (BoldHeader 의 토글이 여기로 전파되지 않음), 단일 source of truth 인
	// <html> className 을 직접 관찰한다. useThemeSwitcher 가 <html> 의 'dark'/'light'
	// 클래스를 토글하므로 그 변화를 MutationObserver 로 캡처.
	const [isLight, setIsLight] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const root = document.documentElement;
		const update = () => setIsLight(root.classList.contains('light'));
		update();
		const mo = new MutationObserver(update);
		mo.observe(root, { attributes: true, attributeFilter: ['class'] });
		return () => mo.disconnect();
	}, []);

	return (
		<div
			className={`bold-root bold-grain min-h-screen ${isLight ? 'bold-light' : ''}`}
			style={{
				background: 'var(--ink)',
				color: 'var(--paper)',
				fontFamily: 'GeneralSans-Variable, system-ui, sans-serif',
			}}
		>
			<ScrollProgress />
			<CursorDot />
			<BoldHeader />
			<main className="max-w-[1640px] mx-auto px-5 sm:px-6 lg:px-24 relative z-10 pt-16">
				{children}
				<BoldFooter />
			</main>
		</div>
	);
}
