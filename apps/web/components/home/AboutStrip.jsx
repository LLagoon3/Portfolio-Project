import Link from 'next/link';
import HomeIcon from './HomeIcon';
import styles from './Home.module.css';

// summary 는 pickAboutSummary(about.bio) 결과 — 제목과 겹치지 않는 설명 단락.
export default function AboutStrip({ summary }) {
	return (
		<section id="about" className={styles.about} aria-labelledby="about-title">
			<div>
				<div className={styles.eyebrow}>
					<span className={`${styles.eyebrowNumber} ${styles.mono}`}>02 /</span>
					About
				</div>
				<h2 id="about-title" className={`${styles.sectionTitle} ${styles.aboutTitle}`}>
					기능 구현을 넘어
					<br />
					서비스의 <span>안정성</span>과
					<br />
					<span>유지보수성</span>을 고민합니다
				</h2>
			</div>
			<div className={styles.aboutCopy}>
				<p>{summary}</p>
				<Link href="/about">
					더 알아보기
					<HomeIcon name="arrowRight" />
				</Link>
			</div>
		</section>
	);
}
