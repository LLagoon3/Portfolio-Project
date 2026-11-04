import { createContext, useContext, useState } from 'react';
import Link from 'next/link';
import ProjectsHeader from './ProjectsHeader';
import ProjectsIcon from './ProjectsIcon';
import styles from './Projects.module.css';

// 모바일 메뉴가 열려 있으면 Escape 는 메뉴부터 닫는다. 본문(보기 설정)이 이를 알 수 있게 공유한다.
const MobileMenuOpenContext = createContext(false);

export function useMobileMenuOpen() {
	return useContext(MobileMenuOpenContext);
}

// /projects, /projects/[url], /about, /contact 가 함께 쓰는 레이아웃. BoldLayout 의 grain / scroll progress /
// cursor dot / Hire Me 없이 정적 헤더, 본문, 짧은 연락 안내 푸터만 둔다. 다른 공개 페이지는 계속 BoldLayout 을 쓴다.
// currentHref 는 헤더에서 현재 메뉴로 표시할 링크다 (기본: Projects). 상세 화면은 navCurrent="section" 으로
// Projects 메뉴를 표시만 하고 aria-current 는 두지 않는다. footerActions 는 연락하기 앞에 두는 보조 링크다.
// showFooterCta={false} 면 연락 안내 줄 없이 저작권 / 맨 위로 줄만 둔다 (연락처 화면 자신). 이때 푸터 위
// 여백은 본문 마지막 섹션이 맡는다.
export default function ProjectsLayout({
	children,
	navCurrent = 'page',
	currentHref = '/projects',
	footerActions = null,
	showFooterCta = true,
}) {
	const [menuOpen, setMenuOpen] = useState(false);
	const year = new Date().getFullYear();
	const contactLink = (
		<Link className={`${styles.btn} ${styles.btnPrimary}`} href="/contact">
			연락하기
			<ProjectsIcon name="arrowRight" />
		</Link>
	);

	return (
		<div id="top" className={styles.root}>
			<a className={styles.skip} href="#main">
				본문으로 바로 가기
			</a>
			<ProjectsHeader
				menuOpen={menuOpen}
				onMenuOpenChange={setMenuOpen}
				navCurrent={navCurrent}
				currentHref={currentHref}
			/>
			<MobileMenuOpenContext.Provider value={menuOpen}>
				<main id="main" className={`${styles.wrap} ${styles.main}`} tabIndex={-1}>
					{children}
				</main>
			</MobileMenuOpenContext.Provider>
			<footer className={showFooterCta ? styles.footer : `${styles.footer} ${styles.footerBare}`}>
				<div className={styles.wrap}>
					{showFooterCta ? (
						<div className={styles.footerCta}>
							<p>함께할 기회를 기다립니다</p>
							{footerActions ? (
								<div className={styles.footerActions}>
									{footerActions}
									{contactLink}
								</div>
							) : (
								contactLink
							)}
						</div>
					) : null}
					<div className={styles.footerBottom}>
						<span>© {year} 이석호 · Lagoon</span>
						<a href="#top">
							맨 위로
							<ProjectsIcon name="arrowUp" />
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
