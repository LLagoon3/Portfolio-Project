import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import HomeIcon from './HomeIcon';
import HomeProjectCard from './HomeProjectCard';
import { HOME_PROJECT_LIMIT, selectHomeProjects } from '../../lib/home';
import styles from './Home.module.css';

export default function HomeProjects({ projects = [], displayLimit = HOME_PROJECT_LIMIT }) {
	const [query, setQuery] = useState('');
	const inputRef = useRef(null);

	const hasProjects = Array.isArray(projects) && projects.length > 0;
	const visible = useMemo(
		() => selectHomeProjects(projects, query, displayLimit),
		[projects, query, displayLimit],
	);
	const searching = query.trim() !== '';

	const resetSearch = () => {
		setQuery('');
		inputRef.current?.focus();
	};

	return (
		<section id="work" className={styles.work} aria-labelledby="work-title">
			<div className={styles.sectionHead}>
				<div>
					<div className={styles.eyebrow}>
						<span className={`${styles.eyebrowNumber} ${styles.mono}`}>01 /</span>
						Selected work
					</div>
					<h2 id="work-title" className={styles.sectionTitle}>
						프로젝트
					</h2>
				</div>
			</div>

			{hasProjects ? (
				<>
					<div className={styles.toolbar}>
						<div className={styles.search}>
							<HomeIcon name="search" className={styles.searchIcon} />
							<input
								ref={inputRef}
								type="search"
								className={styles.searchInput}
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="프로젝트 검색"
								aria-label="프로젝트 검색"
							/>
						</div>
					</div>
					{/* 검색 결과 수는 화면에 표시하지 않고 보조기기에만 알린다. */}
					<p className={styles.srOnly} role="status" aria-live="polite">
						{searching ? `${visible.length}개의 검색 결과` : ''}
					</p>
					{visible.length > 0 ? (
						<div className={styles.projectGrid}>
							{visible.map(({ project, number }) => (
								<HomeProjectCard
									key={project.id ?? project.url}
									project={project}
									number={number}
								/>
							))}
						</div>
					) : (
						<div className={styles.empty}>
							<h3 className={styles.emptyTitle}>검색 결과가 없어요</h3>
							<p>다른 검색어로 찾아보세요.</p>
							<button type="button" className={styles.btn} onClick={resetSearch}>
								검색 초기화
							</button>
						</div>
					)}
				</>
			) : (
				// API 응답이 비었거나 실패한 경우 — 검색 도구 없이 중립 안내만 둔다.
				<div className={styles.empty}>
					<h3 className={styles.emptyTitle}>표시할 프로젝트가 없어요</h3>
				</div>
			)}

			<div className={styles.workFooter}>
				<Link href="/projects" className={styles.btn}>
					전체 프로젝트 보기
					<HomeIcon name="arrowRight" />
				</Link>
			</div>
		</section>
	);
}
