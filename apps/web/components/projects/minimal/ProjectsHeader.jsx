import { useEffect, useRef } from 'react';
import Link from 'next/link';
import useThemeSwitcher from '../../../hooks/useThemeSwitcher';
import ProjectsIcon from './ProjectsIcon';
import styles from './Projects.module.css';

// 홈 헤더와 같은 모양이지만, 이 화면에서는 섹션 앵커 대신 실제 페이지로 이동한다.
const NAV_LINKS = [
	{ href: '/projects', label: 'Projects', current: true },
	{ href: '/about', label: 'About' },
	{ href: '/contact', label: 'Contact' },
];

export const MOBILE_NAV_ID = 'projects-mobile-nav';

function NavLinks({ onNavigate }) {
	return NAV_LINKS.map((link) => (
		<Link
			key={link.href}
			href={link.href}
			aria-current={link.current ? 'page' : undefined}
			onClick={onNavigate}
		>
			{link.label}
		</Link>
	));
}

export default function ProjectsHeader({ menuOpen, onMenuOpenChange }) {
	// 다른 공개 페이지와 같은 localStorage('theme') + <html> 클래스 기반 테마를 공유한다.
	// activeTheme 은 "다음에 전환될 테마" 를 뜻한다.
	const [activeTheme, setTheme] = useThemeSwitcher();
	const menuButtonRef = useRef(null);
	const nextIsDark = activeTheme === 'dark';

	useEffect(() => {
		if (!menuOpen) return undefined;
		const handleKeyDown = (event) => {
			// 보기 설정 패널이 먼저 처리했거나, 검색창의 네이티브 지우기는 건드리지 않는다.
			if (event.key !== 'Escape' || event.defaultPrevented) return;
			if (event.target instanceof HTMLInputElement && event.target.type === 'search') return;
			onMenuOpenChange(false);
			menuButtonRef.current?.focus();
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [menuOpen, onMenuOpenChange]);

	const closeMenu = () => onMenuOpenChange(false);

	return (
		<header className={styles.header}>
			<div className={`${styles.wrap} ${styles.headerInner}`}>
				<Link className={styles.brand} href="/" aria-label="Lagoon 홈">
					<span className={styles.brandMark} aria-hidden="true">
						L
					</span>
					Lagoon
				</Link>
				<nav className={styles.desktopNav} aria-label="주 메뉴">
					<NavLinks />
				</nav>
				<div className={styles.headerActions}>
					<button
						type="button"
						className={styles.iconButton}
						onClick={() => setTheme(activeTheme)}
						aria-label={nextIsDark ? '다크 테마로 전환' : '라이트 테마로 전환'}
					>
						<ProjectsIcon name="moon" />
						<span className={styles.themeName} aria-hidden="true">
							{nextIsDark ? 'Dark' : 'Light'}
						</span>
					</button>
					<button
						ref={menuButtonRef}
						type="button"
						className={`${styles.iconButton} ${styles.menuButton}`}
						onClick={() => onMenuOpenChange(!menuOpen)}
						aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
						aria-expanded={menuOpen}
						aria-controls={MOBILE_NAV_ID}
					>
						<ProjectsIcon name="menu" />
					</button>
				</div>
			</div>
			<nav
				id={MOBILE_NAV_ID}
				className={`${styles.mobileNav} ${styles.wrap}`}
				aria-label="모바일 메뉴"
				hidden={!menuOpen}
			>
				<NavLinks onNavigate={closeMenu} />
			</nav>
		</header>
	);
}
