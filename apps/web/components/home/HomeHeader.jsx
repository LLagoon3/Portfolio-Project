import { useEffect, useRef, useState } from 'react';
import useThemeSwitcher from '../../hooks/useThemeSwitcher';
import HomeIcon from './HomeIcon';
import styles from './Home.module.css';

// 홈 섹션 앵커. 상세 페이지 이동은 각 섹션 하단 링크가 맡는다.
const NAV_LINKS = [
	{ href: '#work', label: 'Projects' },
	{ href: '#about', label: 'About' },
	{ href: '#contact', label: 'Contact' },
];

export default function HomeHeader() {
	// 다른 공개 페이지와 같은 localStorage('theme') + <html> 클래스 기반 테마를 공유한다.
	// activeTheme 은 "다음에 전환될 테마" 를 뜻한다.
	const [activeTheme, setTheme] = useThemeSwitcher();
	const [menuOpen, setMenuOpen] = useState(false);
	const menuButtonRef = useRef(null);

	const nextIsDark = activeTheme === 'dark';

	useEffect(() => {
		if (!menuOpen) return undefined;
		const handleKeyDown = (event) => {
			if (event.key !== 'Escape') return;
			setMenuOpen(false);
			menuButtonRef.current?.focus();
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [menuOpen]);

	const closeMenu = () => setMenuOpen(false);

	return (
		<header className={styles.header}>
			<div className={`${styles.wrap} ${styles.headerInner}`}>
				<a className={styles.brand} href="#top" aria-label="Lagoon 홈">
					<span className={styles.brandMark} aria-hidden="true">
						L
					</span>
					Lagoon
				</a>
				<nav className={styles.desktopNav} aria-label="주 메뉴">
					{NAV_LINKS.map((link) => (
						<a key={link.href} href={link.href}>
							{link.label}
						</a>
					))}
				</nav>
				<div className={styles.headerActions}>
					<button
						type="button"
						className={styles.iconButton}
						onClick={() => setTheme(activeTheme)}
						aria-label={nextIsDark ? '다크 테마로 전환' : '라이트 테마로 전환'}
					>
						<HomeIcon name="moon" />
						<span className={styles.themeName} aria-hidden="true">
							{nextIsDark ? 'Dark' : 'Light'}
						</span>
					</button>
					<button
						ref={menuButtonRef}
						type="button"
						className={`${styles.iconButton} ${styles.menuButton}`}
						onClick={() => setMenuOpen((open) => !open)}
						aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
						aria-expanded={menuOpen}
						aria-controls="home-mobile-nav"
					>
						<HomeIcon name="menu" />
					</button>
				</div>
			</div>
			<nav
				id="home-mobile-nav"
				className={`${styles.mobileNav} ${styles.wrap}`}
				aria-label="모바일 메뉴"
				hidden={!menuOpen}
			>
				{NAV_LINKS.map((link) => (
					<a key={link.href} href={link.href} onClick={closeMenu}>
						{link.label}
					</a>
				))}
			</nav>
		</header>
	);
}
