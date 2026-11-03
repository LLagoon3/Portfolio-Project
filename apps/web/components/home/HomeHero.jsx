import HomeIcon from './HomeIcon';
import styles from './Home.module.css';

// 이력서 외부 링크 — PDF 가 아닌 Notion 페이지.
export const RESUME_URL =
	'https://dear-sawfish-e55.notion.site/15fd6568ef4b80509953d6e7648258dd?source=copy_link';

const EXPERTISE = [
	'Realtime systems',
	'Performance optimization',
	'Observability',
	'Operations automation',
	'Redis & caching',
	'MCP & AI integration',
];

export default function HomeHero({ role }) {
	const roleLabel = (typeof role === 'string' && role.trim()) || 'Backend developer';

	return (
		<>
			<section className={styles.hero} aria-labelledby="hero-title">
				<div className={styles.heroTop}>
					<span className={styles.role}>{roleLabel}</span>
				</div>
				<div className={styles.heroGrid}>
					<h1 id="hero-title" className={styles.heroTitle}>
						이석호의<span>포트폴리오</span>
					</h1>
					<div className={styles.heroCopy}>
						<p className={styles.tagline}>
							기능 구현을 넘어,
							<br />
							안정적인 운영까지
						</p>
						<p className={styles.support}>
							서비스의 동작 원리와 운영 구조를 함께 이해하며, 성능·안정성·운영 효율을
							개선하는 백엔드 개발자입니다.
						</p>
						<div className={styles.actions}>
							<a className={`${styles.btn} ${styles.btnPrimary}`} href="#work">
								프로젝트 보기
								<HomeIcon name="arrowDown" />
							</a>
							<a
								className={styles.btn}
								href={RESUME_URL}
								target="_blank"
								rel="noopener noreferrer"
							>
								이력서 보기
								<HomeIcon name="external" />
								<span className={styles.srOnly}>(새 탭)</span>
							</a>
						</div>
					</div>
				</div>
			</section>
			<ul className={styles.expertise} aria-label="관심 분야">
				{EXPERTISE.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		</>
	);
}
