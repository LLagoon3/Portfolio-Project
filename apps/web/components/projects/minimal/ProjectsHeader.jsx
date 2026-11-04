import { useEffect, useRef } from 'react';
import Link from 'next/link';
import useThemeSwitcher from '../../../hooks/useThemeSwitcher';
import ProjectsIcon from './ProjectsIcon';
import styles from './Projects.module.css';

// 홈 헤더와 같은 모양이지만, 이 화면에서는 섹션 앵커 대신 실제 페이지로 이동한다.
// currentHref 와 같은 링크가 현재 메뉴다. navCurrent 가 'page' 면 aria-current="page" 로, 'section' 이면
// (상세 화면) 같은 밑줄 표시만 두고 aria-current 는 붙이지 않는다 (목록 자체가 현재 페이지가 아니라서).
const NAV_LINKS = [
	{ href: '/projects', label: 'Projects' },
	{ href: '/about', label: 'About' },
	{ href: '/contact', label: 'Contact' },
];

export const MOBILE_NAV_ID = 'projects-mobile-nav';

// Projects.module.css 에서 모바일 메뉴 버튼이 보이는 폭과 같다.
const MOBILE_QUERY = '(max-width: 700px)';

function NavLinks({ currentHref, navCurrent, onNavigate }) {
	return NAV_LINKS.map((link) => {
		const current = link.href === currentHref;
		return (
			<Link
				key={link.href}
				href={link.href}
				aria-current={current && navCurrent === 'page' ? 'page' : undefined}
				className={current && navCurrent === 'section' ? styles.isSection : undefined}
				onClick={onNavigate}
			>
				{link.label}
			</Link>
		);
	});
}

export default function ProjectsHeader({
	menuOpen,
	onMenuOpenChange,
	navCurrent = 'page',
	currentHref = '/projects',
}) {
	// 다른 공개 페이지와 같은 localStorage('theme') + <html> 클래스 기반 테마를 공유한다.
	// activeTheme 은 "다음에 전환될 테마" 를 뜻한다.
	const [activeTheme, setTheme] = useThemeSwitcher();
	const headerRef = useRef(null);
	const themeButtonRef = useRef(null);
	const menuButtonRef = useRef(null);
	const desktopNavRef = useRef(null);
	const mobileNavRef = useRef(null);
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

	// 데스크톱 폭으로 넓어지면 모바일 메뉴와 메뉴 버튼이 사라진다. 메뉴를 닫고, 그 안에 있던 포커스는
	// 화면에 남는 같은 자리(데스크톱 메뉴의 같은 링크 / 바로 앞 테마 버튼)로 옮겨 숨은 요소에 남지 않게 한다.
	useEffect(() => {
		if (typeof window.matchMedia !== 'function') return undefined;
		const query = window.matchMedia(MOBILE_QUERY);
		const moveFocusToDesktop = (from) => {
			let target = null;
			if (from && mobileNavRef.current?.contains(from)) {
				const href = from.getAttribute('href');
				const desktopLinks = Array.from(desktopNavRef.current?.querySelectorAll('a') ?? []);
				target = desktopLinks.find((link) => link.getAttribute('href') === href) ?? null;
			} else if (from && from === menuButtonRef.current) {
				target = themeButtonRef.current;
			}
			target?.focus();
		};
		const handleChange = () => {
			if (query.matches) return;
			const active = document.activeElement;
			onMenuOpenChange(false);
			moveFocusToDesktop(active);
		};
		// 브라우저가 폭 변화 알림보다 먼저 숨겨진 요소의 포커스를 놓아 버리는 경우(focus fixup)도 같은 자리로 옮긴다.
		// 아직 화면에 보이는 요소에서 다른 곳을 눌러 포커스가 빠진 경우는 건드리지 않는다.
		const handleFocusOut = (event) => {
			if (query.matches || event.relatedTarget || event.target.getClientRects().length) return;
			moveFocusToDesktop(event.target);
		};
		const header = headerRef.current;
		header?.addEventListener('focusout', handleFocusOut);
		if (typeof query.addEventListener === 'function') {
			query.addEventListener('change', handleChange);
		} else {
			query.addListener(handleChange);
		}
		return () => {
			header?.removeEventListener('focusout', handleFocusOut);
			if (typeof query.removeEventListener === 'function') {
				query.removeEventListener('change', handleChange);
			} else {
				query.removeListener(handleChange);
			}
		};
	}, [onMenuOpenChange]);

	const closeMenu = () => onMenuOpenChange(false);

	return (
		<header ref={headerRef} className={styles.header}>
			<div className={`${styles.wrap} ${styles.headerInner}`}>
				<Link className={styles.brand} href="/" aria-label="Lagoon 홈">
					<span className={styles.brandMark} aria-hidden="true">
						L
					</span>
					Lagoon
				</Link>
				<nav ref={desktopNavRef} className={styles.desktopNav} aria-label="주 메뉴">
					<NavLinks currentHref={currentHref} navCurrent={navCurrent} />
				</nav>
				<div className={styles.headerActions}>
					<button
						ref={themeButtonRef}
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
				ref={mobileNavRef}
				id={MOBILE_NAV_ID}
				className={`${styles.mobileNav} ${styles.wrap}`}
				aria-label="모바일 메뉴"
				hidden={!menuOpen}
			>
				<NavLinks currentHref={currentHref} navCurrent={navCurrent} onNavigate={closeMenu} />
			</nav>
		</header>
	);
}
