import Link from 'next/link';
import Image from 'next/image';
import HomeIcon from './HomeIcon';
import styles from './Home.module.css';

// 이미지 아래에 번호 / 카테고리 / 제목을 두는 카드. 이미지는 API 의 커버 URL 을 그대로 쓴다
// (/uploads/* 는 next.config.js rewrites 가 API 로 프록시).
export default function HomeProjectCard({ project, number }) {
	const { url, img, title, category } = project;

	return (
		<Link
			href={`/projects/${url}`}
			className={styles.project}
			aria-label={`${title} 상세 보기`}
		>
			<div className={styles.projectImage}>
				{img ? (
					<Image
						src={img}
						alt={`${title} 프로젝트 표지`}
						fill
						sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 400px"
						style={{ objectFit: 'cover' }}
					/>
				) : null}
			</div>
			<div className={styles.projectMeta}>
				<span className={`${styles.projectIndex} ${styles.mono}`}>
					{String(number).padStart(2, '0')}
				</span>
				{category ? <span>{category}</span> : null}
			</div>
			<div className={styles.projectHeading}>
				<h3 className={styles.projectTitle}>{title}</h3>
				<HomeIcon name="external" />
			</div>
		</Link>
	);
}
