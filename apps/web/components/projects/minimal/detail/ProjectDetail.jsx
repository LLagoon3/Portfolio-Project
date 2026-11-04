import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProjectsIcon from '../ProjectsIcon';
import ProjectDetailGallery from './ProjectDetailGallery';
import ProjectDetailMarkdown from './ProjectDetailMarkdown';
import ProjectDetailToc from './ProjectDetailToc';
import { buildHeroMeta, pickOverview } from '../../../../lib/projects';
import {
	RELATION_LABELS,
	buildGallery,
	buildImpact,
	buildLinks,
	buildStackGroups,
	parseProcessSteps,
	pickCoverImage,
	pickQuote,
} from '../../../../lib/projectDetail';
import styles from './ProjectDetail.module.css';

function Section({ id, label, hiddenHeading = false, children }) {
	return (
		<section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
			<h2 id={`${id}-title`} className={hiddenHeading ? styles.srOnly : styles.sectionTitle}>
				{label}
			</h2>
			{children}
		</section>
	);
}

// dt / dd 를 dl 의 직접 자식으로 두어 라벨 열 폭을 모든 행이 공유한다.
function Facts({ meta, links }) {
	if (!meta.length && !links.length) return null;
	return (
		<dl className={styles.facts}>
			{meta.map((item) => (
				<Fragment key={item.label}>
					<dt>{item.label}</dt>
					<dd>{item.value}</dd>
				</Fragment>
			))}
			{links.length ? (
				<>
					<dt>링크</dt>
					<dd>
						<ul className={styles.links}>
							{links.map((link) => (
								<li key={link.key}>
									<a href={link.url} target="_blank" rel="noopener noreferrer">
										{link.label}
										<ProjectsIcon name="arrowUpRight" className={styles.linkIcon} />
										<span className={styles.srOnly}> (새 탭)</span>
									</a>
								</li>
							))}
						</ul>
					</dd>
				</>
			) : null}
		</dl>
	);
}

// 상세 화면 본문. 데이터가 있는 섹션만 그리고, 목차도 그려진 섹션만 가리킨다.
// moreProjects 는 서버에서 계산한 같은 카테고리 / 이전 / 다음 프로젝트 목록이다.
export default function ProjectDetail({ project, moreProjects = [] }) {
	const title = project.title ?? '';
	const meta = buildHeroMeta(project);
	const links = buildLinks(project.ProjectInfo?.Links);
	const cover = pickCoverImage(project);
	const overview = pickOverview(project.ProjectInfo?.ObjectivesDetails);
	const gallery = buildGallery(project);
	const steps = parseProcessSteps(project.ProjectInfo?.ProjectDetails);
	const impact = buildImpact(project.ProjectInfo?.Impact);
	const stackGroups = buildStackGroups(project.ProjectInfo?.Technologies);
	const quote = pickQuote(project.ProjectInfo?.Quote);

	const sections = [
		overview && { id: 'overview', label: '개요' },
		gallery.length > 0 && { id: 'gallery', label: '화면' },
		steps.length > 0 && { id: 'process', label: '과정' },
		impact.length > 0 && { id: 'impact', label: '결과' },
		stackGroups.length > 0 && { id: 'stack', label: '기술' },
		quote && { id: 'quote', label: '회고' },
		moreProjects.length > 0 && { id: 'more', label: '다른 프로젝트' },
	].filter(Boolean);
	const has = (id) => sections.some((section) => section.id === id);

	return (
		<div className={styles.detail}>
			<section
				className={`${styles.hero} ${cover ? '' : styles.heroNoCover}`.trim()}
				aria-labelledby="project-title"
			>
				<div className={styles.heroText}>
					<Link className={styles.back} href="/projects">
						<ProjectsIcon name="arrowLeft" className={styles.backIcon} />
						프로젝트 목록
					</Link>
					<h1 id="project-title" className={styles.title}>
						{title}
					</h1>
					<Facts meta={meta} links={links} />
				</div>
				{cover ? (
					<figure className={styles.cover}>
						<Image
							src={cover}
							alt={`${title} 표지 이미지`}
							width={0}
							height={0}
							priority
							sizes="(max-width: 700px) 400px, (max-width: 1050px) 280px, 320px"
							style={{ width: '100%', height: 'auto' }}
						/>
					</figure>
				) : null}
			</section>

			{sections.length ? (
				<div className={styles.body}>
					{sections.length > 1 ? <ProjectDetailToc sections={sections} /> : null}
					<div className={styles.content}>
						{has('overview') ? (
							<Section id="overview" label="개요">
								<p className={styles.lead}>{overview}</p>
							</Section>
						) : null}

						{has('gallery') ? (
							<Section id="gallery" label="화면">
								<ProjectDetailGallery images={gallery} />
							</Section>
						) : null}

						{has('process') ? (
							<Section id="process" label="과정">
								<ol className={styles.steps}>
									{steps.map((step) => (
										<li key={step.key} className={styles.step}>
											<article>
												{step.kind ? (
													<p className={`${styles.kind} ${styles.mono}`}>{step.kind}</p>
												) : null}
												<h3 className={styles.stepTitle}>{step.title}</h3>
												<ProjectDetailMarkdown>{step.body}</ProjectDetailMarkdown>
											</article>
										</li>
									))}
								</ol>
							</Section>
						) : null}

						{has('impact') ? (
							<Section id="impact" label="결과">
								<dl className={styles.impact}>
									{impact.map((stat) => (
										<div key={stat.key} className={styles.stat}>
											<dt>{stat.label}</dt>
											<dd className={styles.statValue}>{stat.value}</dd>
											{stat.sub ? <dd className={styles.statSub}>{stat.sub}</dd> : null}
										</div>
									))}
								</dl>
							</Section>
						) : null}

						{has('stack') ? (
							<Section id="stack" label="기술">
								{stackGroups.map((group) => (
									<div key={group.key} className={styles.techGroup}>
										{group.title ? <h3 className={styles.techTitle}>{group.title}</h3> : null}
										<ul className={styles.techs}>
											{group.techs.map((tech, index) => (
												<li key={`${tech}-${index}`}>{tech}</li>
											))}
										</ul>
									</div>
								))}
							</Section>
						) : null}

						{has('quote') ? (
							// 작성자 표기('프로젝트 회고')와 겹치지 않게 섹션 제목은 보조기기에만 둔다.
							<Section id="quote" label="회고" hiddenHeading>
								<figure className={styles.quote}>
									<blockquote>
										<p>{quote.text}</p>
									</blockquote>
									{quote.author ? <figcaption>{quote.author}</figcaption> : null}
								</figure>
							</Section>
						) : null}

						{has('more') ? (
							<Section id="more" label="다른 프로젝트">
								<ul className={styles.more}>
									{moreProjects.map((item) => (
										<li key={`${item.relation}-${item.url}`}>
											<Link href={`/projects/${item.url}`}>
												<span className={styles.moreRelation}>{RELATION_LABELS[item.relation]}</span>
												<span className={styles.moreTitle}>{item.title}</span>
												<span className={styles.moreCategory}>{item.category}</span>
												<span className={`${styles.moreYear} ${styles.mono}`}>{item.year}</span>
												<ProjectsIcon name="arrowRight" className={styles.moreArrow} />
											</Link>
										</li>
									))}
								</ul>
							</Section>
						) : null}
					</div>
				</div>
			) : null}
		</div>
	);
}
