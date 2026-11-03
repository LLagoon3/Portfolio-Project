import HomeHeader from './HomeHeader';
import HomeIcon from './HomeIcon';
import styles from './Home.module.css';

// 홈 전용 레이아웃. BoldLayout 의 grain / scroll progress / cursor dot / Hire Me 없이
// 정적 헤더와 한 줄 푸터만 둔다. 다른 공개 페이지는 계속 BoldLayout 을 쓴다.
export default function HomeLayout({ children }) {
	const year = new Date().getFullYear();

	return (
		<div id="top" className={styles.root}>
			<a className={styles.skip} href="#work">
				프로젝트로 바로 가기
			</a>
			<HomeHeader />
			<main className={styles.wrap}>
				{children}
				<footer className={styles.footer}>
					<span>© {year} 이석호 · Lagoon</span>
					<a href="#top">
						맨 위로
						<HomeIcon name="arrowUp" />
					</a>
				</footer>
			</main>
		</div>
	);
}
