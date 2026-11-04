import Image from 'next/image';
import Link from 'next/link';
import ProjectsIcon from './ProjectsIcon';
import { padNumber } from '../../../lib/projectsIndex';
import styles from './Projects.module.css';

// 그리드/목록이 같은 마크업을 쓴다. 목록 보기에서는 CSS 가 이미지를 숨기고 한 줄로 배치한다.
// 이미지는 API 의 커버 URL 을 그대로 쓴다 (/uploads/* 는 next.config.js rewrites 가 API 로 프록시).
// eager: 첫 줄 카드 이미지는 지연 로딩하지 않는다.
export default function ProjectsItem({ project, eager = false }) {
	const { url, img, title, category, year, number } = project;

	return (
		<li className={styles.project}>
			<Link href={`/projects/${url}`} aria-label={`${title} 상세 보기`}>
				<div className={styles.projectImage}>
					{img ? (
						<Image
							src={img}
							alt={`${title} 프로젝트 표지`}
							fill
							loading={eager ? 'eager' : 'lazy'}
							sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 400px"
							style={{ objectFit: 'cover' }}
						/>
					) : null}
				</div>
				<div className={styles.projectBody}>
					<span className={`${styles.projectIndex} ${styles.mono}`}>{padNumber(number)}</span>
					<span className={styles.projectCategory}>{category}</span>
					<span className={`${styles.projectYear} ${styles.mono}`}>{year}</span>
					<h2 className={styles.projectTitle}>{title}</h2>
					<ProjectsIcon name="arrowRight" className={styles.projectArrow} />
				</div>
			</Link>
		</li>
	);
}
