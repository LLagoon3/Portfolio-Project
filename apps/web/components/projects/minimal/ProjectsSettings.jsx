import { forwardRef } from 'react';
import ProjectsIcon from './ProjectsIcon';
import { SORT_OPTIONS, VIEW_OPTIONS } from '../../../lib/projectsIndex';
import styles from './Projects.module.css';

function RadioGroup({ legend, name, options, value, onChange, className = '' }) {
	return (
		<fieldset className={className}>
			<legend>{legend}</legend>
			<div className={styles.options}>
				{options.map((option) => (
					<label key={option.value} className={styles.option}>
						<input
							type="radio"
							name={name}
							value={option.value}
							checked={value === option.value}
							onChange={() => onChange(option.value)}
						/>
						<span>
							{option.icon ? <ProjectsIcon name={option.icon} /> : null}
							{option.label}
						</span>
					</label>
				))}
			</div>
		</fieldset>
	);
}

// "보기 설정" 접이식 패널. 카테고리 / 정렬 / 보기 방식을 라디오 그룹으로 고른다.
// 카테고리 이름순은 실행 환경 로케일을 따르므로, 서버 HTML 에는 비워 두고 열었을 때만 그린다.
const ProjectsSettings = forwardRef(function ProjectsSettings(
	{ id, open, categories, category, sort, view, onCategoryChange, onSortChange, onViewChange },
	ref,
) {
	return (
		<div ref={ref} id={id} className={styles.settings} role="group" aria-label="보기 설정" hidden={!open}>
			{open ? (
				<>
					<RadioGroup
						legend="카테고리"
						name="category"
						className={styles.groupCategory}
						options={[
							{ value: 'all', label: '전체' },
							...categories.map((c) => ({ value: c, label: c })),
						]}
						value={category}
						onChange={onCategoryChange}
					/>
					<RadioGroup
						legend="정렬"
						name="sort"
						className={styles.groupSort}
						options={SORT_OPTIONS}
						value={sort}
						onChange={onSortChange}
					/>
					<RadioGroup
						legend="보기"
						name="view"
						className={styles.groupView}
						options={VIEW_OPTIONS}
						value={view}
						onChange={onViewChange}
					/>
				</>
			) : null}
		</div>
	);
});

export default ProjectsSettings;
