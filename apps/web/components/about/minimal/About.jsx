import Image from 'next/image';
import ProjectsIcon from '../../projects/minimal/ProjectsIcon';
import AboutMarkdown from './AboutMarkdown';
import { formatStatLabel, normalizeAbout } from '../../../lib/about';
import styles from './About.module.css';

export const RESUME_URL =
	'https://dear-sawfish-e55.notion.site/15fd6568ef4b80509953d6e7648258dd?source=copy_link';

// 푸터의 연락하기 옆에 두는 조용한 보조 링크. 기존 About 의 Notion 이력서를 새 탭으로 연다.
export function AboutResumeLink() {
	return (
		<a className={styles.resumeLink} href={RESUME_URL} target="_blank" rel="noopener noreferrer">
			이력서 보기
			<span className={styles.srOnly}> (새 탭)</span>
			<ProjectsIcon name="arrowUpRight" className={styles.resumeIcon} />
		</a>
	);
}

// 왼쪽 240px 열에 섹션 이름, 오른쪽 읽기 열에 본문을 두는 공통 행.
function Section({ id, title, className = '', children }) {
	const titleId = `about-${id}-title`;
	return (
		<section className={`${styles.section} ${className}`.trim()} aria-labelledby={titleId}>
			<h2 id={titleId} className={styles.sectionTitle}>
				{title}
			</h2>
			<div className={styles.sectionBody}>{children}</div>
		</section>
	);
}

function Identity({ name, tagline, profileImage, availability }) {
	return (
		<section
			className={`${styles.hero} ${profileImage ? '' : styles.heroTextOnly}`.trim()}
			aria-labelledby="about-title"
		>
			{profileImage ? (
				<figure className={styles.portrait}>
					<Image
						src={profileImage}
						alt={`${name} 프로필 사진`}
						width={0}
						height={0}
						priority
						sizes="(max-width: 700px) 144px, (max-width: 1050px) 200px, 240px"
					/>
				</figure>
			) : null}
			<div className={styles.identity}>
				<p className={styles.role}>{tagline}</p>
				<h1 id="about-title" className={styles.title}>
					{`문제의 본질에 집중하는 개발자, ${name}입니다`}
				</h1>
				{availability ? <p className={styles.availability}>{availability}</p> : null}
			</div>
		</section>
	);
}

// API 가 내려 준 소개 / 수치 / 원칙 / 경험 / 기술을 순서 그대로 렌더한다. 빈 섹션은 생략한다
// (소개만 기존처럼 안내 문구를 둔다). 진입 애니메이션 / 카운트업 / 장식 라벨은 쓰지 않는다.
export default function About({ about }) {
	const { name, tagline, profileImage, availability, bio, stats, principles, journey, stacks } =
		normalizeAbout(about);

	return (
		<div className={styles.page}>
			<Identity name={name} tagline={tagline} profileImage={profileImage} availability={availability} />

			<Section id="bio" title="소개" className={styles.bio}>
				{bio.length ? (
					bio.map((paragraph, idx) => (
						<AboutMarkdown key={idx} className={idx === 0 ? styles.lead : styles.paragraph}>
							{paragraph}
						</AboutMarkdown>
					))
				) : (
					<p className={styles.paragraph}>자기소개가 아직 등록되지 않았습니다.</p>
				)}
			</Section>

			{stats.length ? (
				<Section id="stats" title="주요 수치">
					<dl className={styles.stats}>
						{stats.map((stat, idx) => (
							<div key={`${stat.label}-${idx}`} className={styles.stat}>
								<dt className={styles.statLabel}>{formatStatLabel(stat.label)}</dt>
								<dd className={styles.statValue}>{String(stat.value ?? '')}</dd>
								{stat.sub ? <dd className={styles.statSub}>{stat.sub}</dd> : null}
							</div>
						))}
					</dl>
				</Section>
			) : null}

			{principles.length ? (
				<Section id="principles" title="작업 원칙">
					<p className={styles.intro}>
						기술은 결국 서비스를 더 잘 굴러가게 만드는 도구라고 생각합니다. 아래는 어떤 코드를 쓸지
						고민할 때 기준으로 삼는 원칙들입니다.
					</p>
					<ol className={`${styles.rows} ${styles.principles}`}>
						{principles.map((principle, idx) => (
							<li key={`${principle.title}-${idx}`}>
								{principle.title ? <h3>{principle.title}</h3> : null}
								{principle.body ? <p>{principle.body}</p> : null}
							</li>
						))}
					</ol>
				</Section>
			) : null}

			{journey.length ? (
				<Section id="journey" title="경험">
					<ol className={`${styles.rows} ${styles.journey}`}>
						{journey.map((row, idx) => (
							<li key={`${row.year}-${row.title}-${idx}`}>
								{row.year ? <p className={`${styles.date} ${styles.mono}`}>{row.year}</p> : null}
								<div className={styles.entry}>
									<h3>{row.title}</h3>
									{row.role ? <p className={styles.entryRole}>{row.role}</p> : null}
									{row.body ? <p className={styles.entryBody}>{row.body}</p> : null}
								</div>
							</li>
						))}
					</ol>
				</Section>
			) : null}

			{stacks.length ? (
				<Section id="stack" title="기술">
					<ul className={`${styles.rows} ${styles.stack}`}>
						{stacks.map((group, idx) => (
							<li key={`${group.title}-${idx}`}>
								{group.title ? <h3>{group.title}</h3> : null}
								<ul className={styles.techs}>
									{group.techs.map((tech, techIdx) => (
										<li key={`${tech}-${techIdx}`}>{tech}</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				</Section>
			) : null}
		</div>
	);
}
