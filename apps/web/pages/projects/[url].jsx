import BoldLayout from '../../components/layout/bold/BoldLayout';
import PagesMetaHead from '../../components/PagesMetaHead';
import BoldProjectDetailHero from '../../components/projects/bold/detail/BoldProjectDetailHero';
import BoldProjectDetailOverview from '../../components/projects/bold/detail/BoldProjectDetailOverview';
import BoldProjectDetailGallery from '../../components/projects/bold/detail/BoldProjectDetailGallery';
import BoldProjectDetailProcess from '../../components/projects/bold/detail/BoldProjectDetailProcess';
import BoldProjectDetailStack from '../../components/projects/bold/detail/BoldProjectDetailStack';
import BoldProjectDetailRelated from '../../components/projects/bold/detail/BoldProjectDetailRelated';
import BoldProjectDetailSideNav from '../../components/projects/bold/detail/BoldProjectDetailSideNav';
import BoldProjectDetailImpact from '../../components/projects/bold/detail/BoldProjectDetailImpact';
import BoldProjectDetailQuote from '../../components/projects/bold/detail/BoldProjectDetailQuote';
import { parseYear } from '../../lib/projects';

const API_BASE_URL =
	process.env.API_INTERNAL_URL || 'http://localhost:7341';

const PROCESS_KIND_KEYWORDS = [
	{ kind: 'DECISION', keywords: ['결정', '선택', 'DECISION', 'CHOOSE'] },
	{ kind: 'OPS', keywords: ['운영', '배포', 'OPS', 'DEPLOY'] },
	{ kind: 'RESULT', keywords: ['결과', '성과', 'RESULT', 'IMPACT'] },
	{ kind: 'TRADEOFF', keywords: ['트레이드오프', '대안', 'TRADEOFF'] },
];
const KIND_ROTATION = ['DECISION', 'OPS', 'RESULT', 'TRADEOFF'];

function ProjectDetail({ project, relatedProjects }) {
	const heroEyebrow = buildHeroEyebrow(project);
	const heroMeta = buildHeroMeta(project);
	const overview = pickOverview(project.ProjectInfo?.ObjectivesDetails);
	const gallery = project.ProjectImages?.slice(1) ?? [];
	const steps = parseProcessSteps(project.ProjectInfo?.ProjectDetails);
	const stackGroups = project.ProjectInfo?.Technologies ?? [];
	// Phase 2 — admin 명시 값 우선, 미입력 시 폴백 (title 마지막 토큰).
	const heroAccentWord = pickHeroAccentWord(project);
	// heroSubtitle 은 DB / admin / API 에 보존하되 페이지에서는 미렌더 — Overview 섹션과
	// 의미 중복이라 한 곳만 두기로 결정 (사용자 결정). 후속에 emotional 카피로 차별화 시
	// 복원 가능.
	const impactStats = project.ProjectInfo?.Impact ?? [];
	const quote = project.ProjectInfo?.Quote ?? null;
	const links = project.ProjectInfo?.Links ?? [];

	// SideNav 는 실제 렌더되는 섹션만 노출.
	const sections = [
		{ id: 'hero', label: 'Intro' },
		overview && { id: 'overview', label: 'Overview' },
		gallery.length > 0 && { id: 'gallery', label: 'Gallery' },
		steps.length > 0 && { id: 'process', label: 'Process' },
		impactStats.length > 0 && { id: 'impact', label: 'Impact' },
		stackGroups.some((g) => g?.techs?.length) && { id: 'stack', label: 'Stack' },
		quote && { id: 'quote', label: 'Quote' },
		relatedProjects.length > 0 && { id: 'related', label: 'Next Up' },
	].filter(Boolean);

	return (
		<>
			<PagesMetaHead title={project.title} />

			<div className="container mx-auto px-6 lg:px-10">
				{/* lg+ 에서 SideNav 를 별도 컬럼으로 분리 → fixed 시 main content 침범 문제 해소.
				    SideNav 자체는 sticky top-32. 모바일에선 SideNav 영역 자체 미렌더. */}
				<div className="lg:flex lg:gap-10 xl:gap-14">
					<aside className="hidden lg:block lg:w-[160px] lg:flex-shrink-0 lg:pt-32">
						<BoldProjectDetailSideNav sections={sections} />
					</aside>
					<div
						className="lg:flex-1 lg:min-w-0"
						style={{ wordBreak: 'keep-all' }}
					>
						<BoldProjectDetailHero
							title={project.title}
							accentWord={heroAccentWord}
							eyebrow={heroEyebrow}
							coverImage={project.ProjectImages?.[0]?.img}
							meta={heroMeta}
							links={links}
						/>
						<BoldProjectDetailOverview body={overview} />
						<BoldProjectDetailGallery images={gallery} />
						<BoldProjectDetailProcess steps={steps} />
						<BoldProjectDetailImpact stats={impactStats} />
						<BoldProjectDetailStack groups={stackGroups} />
						<BoldProjectDetailQuote quote={quote} />
						<BoldProjectDetailRelated projects={relatedProjects} />
					</div>
				</div>
			</div>
		</>
	);
}

// admin 명시 값이 있으면 그대로, 없으면 title 마지막 공백 토큰 폴백.
function pickHeroAccentWord(project) {
	if (project.heroAccentWord && project.heroAccentWord.trim()) {
		return project.heroAccentWord.trim();
	}
	const tokens = (project.title ?? '').trim().split(/\s+/);
	return tokens[tokens.length - 1] || '';
}

ProjectDetail.getLayout = (page) => <BoldLayout>{page}</BoldLayout>;

// JSX 로 반환 → 두 phrase 사이의 공백 1곳에서만 wrap 가능. 좁은 viewport 에서
// 'Selected Work / — 2025 · Web Application' 처럼 깔끔하게 두 줄.
function buildHeroEyebrow(project) {
	const year = parseYear(project.ProjectHeader?.publishDate);
	const category = project.category;
	const primary = <span className="whitespace-nowrap">Selected Work</span>;
	if (year && category) {
		return (
			<>
				{primary}{' '}
				<span className="whitespace-nowrap">— {year} · {category}</span>
			</>
		);
	}
	if (category) {
		return (
			<>
				{primary}{' '}
				<span className="whitespace-nowrap">· {category}</span>
			</>
		);
	}
	return primary;
}

// Hero meta strip: Client / Role 은 admin 의 전용 필드 (#125) 사용.
// 이전엔 companyInfo 의 title 키워드 (role/역할/담당, client/...) 매칭 폴백이
// 있었으나 명명 의존 + 직관성 부족으로 제거. 빈 값이면 해당 칸 미노출.
function buildHeroMeta(project) {
	const meta = [];

	if (project.heroClient) {
		meta.push({ label: 'Client', value: project.heroClient });
	}

	if (project.heroRole) {
		meta.push({ label: 'Role', value: project.heroRole });
	}

	if (project.ProjectHeader?.publishDate) {
		meta.push({ label: 'Timeline', value: project.ProjectHeader.publishDate });
	}

	if (project.category) {
		meta.push({ label: 'Category', value: project.category });
	}

	return meta;
}

// 첫 단락 (빈 줄 split 의 첫 청크) 만 노출 — Overview 는 한 호흡 요약.
function pickOverview(objectivesDetails) {
	if (!objectivesDetails) return '';
	const first = objectivesDetails.split(/\n\s*\n/)[0]?.trim();
	return first || '';
}

// admin 명시 우선 (1 entry = 1 step), 미입력 entry 는 details markdown 의 ## h2 split
// + 키워드 매칭 폴백. 둘이 섞여 있어도 하나의 step 시퀀스로 합쳐 출력 (sortOrder 보존).
function parseProcessSteps(projectDetails = []) {
	const steps = [];
	for (const entry of projectDetails) {
		const md = entry.details ?? '';
		const kindExplicit = entry.kind?.trim();
		const titleExplicit = entry.title?.trim();

		if (kindExplicit || titleExplicit) {
			// admin 명시 — 1 entry = 1 step
			steps.push({
				kind: kindExplicit || pickKind(titleExplicit ?? '', steps.length),
				title: titleExplicit || '',
				body: md,
			});
			continue;
		}

		// 폴백: 기존 markdown h2 split. ## 없으면 단일 메모.
		if (!md.trim()) continue;
		const hasH2 = /^##\s+/m.test(md);
		if (!hasH2) {
			steps.push({ kind: 'NOTE', title: '메모', body: md.trim() });
			continue;
		}
		const sections = md.split(/^##\s+/gm).filter((s) => s.trim().length > 0);
		sections.forEach((section) => {
			const [titleLine, ...bodyLines] = section.split('\n');
			const title = titleLine.trim();
			steps.push({
				kind: pickKind(title, steps.length),
				title,
				body: bodyLines.join('\n').trim(),
			});
		});
	}
	return steps;
}

function pickKind(title, idx) {
	const lower = title.toLowerCase();
	for (const { kind, keywords } of PROCESS_KIND_KEYWORDS) {
		if (keywords.some((k) => lower.includes(k.toLowerCase()))) return kind;
	}
	return KIND_ROTATION[idx % KIND_ROTATION.length];
}

export async function getServerSideProps({ query }) {
	const { url } = query;
	try {
		const res = await fetch(`${API_BASE_URL}/api/projects/${url}`);
		if (res.status === 404) {
			// 존재하지 않는 슬러그는 Next.js 404 로 응답
			return { notFound: true };
		}
		if (!res.ok) {
			// 5xx 등 비정상 응답은 404 로 위장하지 않고 Next.js 에러 페이지로 드러낸다
			throw new Error(`[project detail] API returned ${res.status}`);
		}
		const body = await res.json();
		const project = body?.data;
		if (!project) {
			return { notFound: true };
		}

		// Related projects 는 보조 섹션이므로 실패해도 메인 페이지 렌더를 막지 않는다
		let relatedProjects = [];
		try {
			const category = encodeURIComponent(project.category);
			const relRes = await fetch(
				`${API_BASE_URL}/api/projects?category=${category}`,
			);
			if (relRes.ok) {
				const relBody = await relRes.json();
				relatedProjects = (relBody?.data ?? [])
					.filter((p) => p.url !== url)
					.slice(0, 4);
			}
		} catch (relErr) {
			console.error('[project detail] fetch related failed', relErr);
		}

		return { props: { project, relatedProjects } };
	} catch (err) {
		console.error('[project detail] fetch failed', err);
		throw err;
	}
}

export default ProjectDetail;
