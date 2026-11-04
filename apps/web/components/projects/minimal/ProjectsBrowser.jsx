import { useEffect, useMemo, useRef, useState } from 'react';
import ProjectsIcon from './ProjectsIcon';
import ProjectsItem from './ProjectsItem';
import ProjectsSettings from './ProjectsSettings';
import { useMobileMenuOpen } from './ProjectsLayout';
import {
	DEFAULT_SETTINGS,
	applyFilters,
	buildCategories,
	decorateProjects,
	summarizeSettings,
} from '../../../lib/projectsIndex';
import styles from './Projects.module.css';

const SETTINGS_ID = 'project-settings';
const SUMMARY_ID = 'project-settings-summary';
const EAGER_IMAGE_COUNT = 3;

// projects 는 getServerSideProps 가 최신순으로 정렬해 내려 준 순서다 (lib/projectsIndex.js 참고).
export default function ProjectsBrowser({ projects = [] }) {
	const decorated = useMemo(() => decorateProjects(projects), [projects]);
	const categories = useMemo(() => buildCategories(decorated), [decorated]);

	const [search, setSearch] = useState('');
	const [category, setCategory] = useState(DEFAULT_SETTINGS.category);
	const [sort, setSort] = useState(DEFAULT_SETTINGS.sort);
	const [view, setView] = useState(DEFAULT_SETTINGS.view);
	const [settingsOpen, setSettingsOpen] = useState(false);
	// 검색/카테고리를 한 번이라도 바꾼 뒤부터 결과 수를 보조기기에 알린다.
	const [announce, setAnnounce] = useState(false);

	const menuOpen = useMobileMenuOpen();
	const searchRef = useRef(null);
	const toggleRef = useRef(null);
	const panelRef = useRef(null);

	const visible = useMemo(
		() => applyFilters(decorated, { category, search, sort }),
		[decorated, category, search, sort],
	);
	const summary = settingsOpen ? '' : summarizeSettings({ category, sort, view });
	const modified =
		category !== DEFAULT_SETTINGS.category ||
		sort !== DEFAULT_SETTINGS.sort ||
		view !== DEFAULT_SETTINGS.view;

	useEffect(() => {
		if (!settingsOpen) return undefined;
		// capture 단계에서 먼저 받아 헤더의 모바일 메뉴 Escape 처리보다 앞선다.
		const handleKeyDown = (event) => {
			if (event.key !== 'Escape' || event.defaultPrevented) return;
			const active = document.activeElement;
			if (active === searchRef.current) return; // 네이티브 검색어 지우기
			const inSettings = active === toggleRef.current || panelRef.current?.contains(active);
			if (!inSettings && menuOpen) return; // 바깥에 포커스가 있으면 열린 메뉴부터 닫는다
			event.preventDefault();
			setSettingsOpen(false);
			toggleRef.current?.focus();
		};
		document.addEventListener('keydown', handleKeyDown, true);
		return () => document.removeEventListener('keydown', handleKeyDown, true);
	}, [settingsOpen, menuOpen]);

	const changeSearch = (value) => {
		setSearch(value);
		setAnnounce(true);
	};

	const changeCategory = (value) => {
		setCategory(value);
		setAnnounce(true);
	};

	const resetFilters = () => {
		setSearch('');
		setCategory(DEFAULT_SETTINGS.category);
		setAnnounce(true);
		searchRef.current?.focus();
	};

	const hasProjects = decorated.length > 0;
	let status = '';
	if (announce) status = visible.length ? `${visible.length}개 프로젝트` : '조건에 맞는 프로젝트 없음';

	return (
		<>
			<div className={styles.pageHead}>
				<h1 className={styles.title}>프로젝트</h1>
				{hasProjects ? (
					<>
						<div className={styles.toolbar}>
							<div className={styles.search}>
								<ProjectsIcon name="search" className={styles.searchIcon} />
								<input
									ref={searchRef}
									type="search"
									className={styles.searchInput}
									value={search}
									onChange={(event) => changeSearch(event.target.value)}
									placeholder="프로젝트 검색"
									aria-label="프로젝트 검색"
									autoComplete="off"
								/>
							</div>
							<button
								ref={toggleRef}
								type="button"
								className={`${styles.btn} ${styles.settingsToggle} ${modified ? styles.isModified : ''}`}
								onClick={() => setSettingsOpen((open) => !open)}
								aria-expanded={settingsOpen}
								aria-controls={SETTINGS_ID}
								aria-describedby={SUMMARY_ID}
							>
								<ProjectsIcon name="sliders" className={styles.settingsIcon} />
								보기 설정
								<ProjectsIcon name="chevronDown" className={styles.chevron} />
							</button>
							<p id={SUMMARY_ID} className={styles.settingsSummary}>
								{summary}
							</p>
						</div>
						<ProjectsSettings
							ref={panelRef}
							id={SETTINGS_ID}
							open={settingsOpen}
							categories={categories}
							category={category}
							sort={sort}
							view={view}
							onCategoryChange={changeCategory}
							onSortChange={setSort}
							onViewChange={setView}
						/>
					</>
				) : null}
			</div>

			{hasProjects ? (
				<>
					{/* 결과 수는 화면에 표시하지 않고 보조기기에만 알린다. */}
					<p className={styles.srOnly} role="status" aria-live="polite">
						{status}
					</p>
					{visible.length > 0 ? (
						<ul className={`${styles.projects} ${view === 'list' ? styles.isList : ''}`.trim()}>
							{visible.map((project, index) => (
								<ProjectsItem
									key={project.id ?? project.url}
									project={project}
									eager={index < EAGER_IMAGE_COUNT}
								/>
							))}
						</ul>
					) : (
						<div className={styles.empty}>
							<h2 className={styles.emptyTitle}>조건에 맞는 프로젝트가 없어요</h2>
							<p>검색어나 카테고리를 바꿔 보세요</p>
							<button type="button" className={styles.btn} onClick={resetFilters}>
								조건 초기화
							</button>
						</div>
					)}
				</>
			) : (
				// API 응답이 빈 배열인 경우 — 검색/보기 설정 없이 중립 안내만 둔다.
				<div className={styles.empty}>
					<h2 className={styles.emptyTitle}>표시할 프로젝트가 없어요</h2>
				</div>
			)}
		</>
	);
}
