import { useEffect, useState } from 'react';
import useThemeSwitcher from '../../../hooks/useThemeSwitcher';
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
	const [activeTheme, , mounted] = useThemeSwitcher();
	// useThemeSwitcher 의 activeTheme 는 "다음에 토글할 값" 이므로
	// 현재 theme 는 그 반대.
	const [isLight, setIsLight] = useState(false);

	useEffect(() => {
		if (!mounted) return;
		setIsLight(activeTheme === 'dark');
	}, [activeTheme, mounted]);

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
