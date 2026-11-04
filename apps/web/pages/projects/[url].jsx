import PagesMetaHead from '../../components/PagesMetaHead';
import ProjectsLayout from '../../components/projects/minimal/ProjectsLayout';
import ProjectDetail from '../../components/projects/minimal/detail/ProjectDetail';
import { buildMoreProjects } from '../../lib/projectDetail';

const API_BASE_URL = process.env.API_INTERNAL_URL || 'http://localhost:7341';

function ProjectDetailPage({ project, moreProjects }) {
	return (
		<>
			<PagesMetaHead title={project.title} />
			{/* 상세 → 상세 이동은 같은 페이지 컴포넌트를 재사용하므로, 프로젝트별로 새로 마운트해
			    목차 위치 / 이미지 보기 상태가 이전 프로젝트에서 이어지지 않게 한다. */}
			<ProjectDetail key={project.url} project={project} moreProjects={moreProjects} />
		</>
	);
}

// 목록과 같은 정적 레이아웃. 헤더는 Projects 메뉴를 표시만 하고 aria-current 는 두지 않는다.
ProjectDetailPage.getLayout = (page) => <ProjectsLayout navCurrent="section">{page}</ProjectsLayout>;
// 목록과 같이 라우트 전환 reveal 과 플로팅 맨 위로 버튼 없이 렌더한다 (_app.jsx 참고).
ProjectDetailPage.minimalShell = true;

// 다른 프로젝트(같은 카테고리 / 이전 / 다음) 계산용 보조 목록. 실패해도 상세 화면은 렌더한다.
async function fetchProjectList() {
	try {
		const res = await fetch(`${API_BASE_URL}/api/projects`);
		if (!res.ok) {
			throw new Error(`[project detail] project list API returned ${res.status}`);
		}
		const body = await res.json();
		return Array.isArray(body?.data) ? body.data : [];
	} catch (err) {
		console.error('[project detail] fetch project list failed', err);
		return [];
	}
}

export async function getServerSideProps({ query }) {
	const url = String(query.url ?? '');
	// 보조 목록은 상세 요청과 함께 시작한다. fetchProjectList 는 reject 하지 않는다.
	const projectListRequest = fetchProjectList();
	try {
		const res = await fetch(`${API_BASE_URL}/api/projects/${encodeURIComponent(url)}`);
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

		// 최신순 정렬(localeCompare)은 실행 환경 로케일을 따르므로 서버에서만 계산해 내려 보낸다.
		let moreProjects = [];
		try {
			moreProjects = buildMoreProjects(project, await projectListRequest);
		} catch (moreErr) {
			console.error('[project detail] build more projects failed', moreErr);
		}

		return { props: { project, moreProjects } };
	} catch (err) {
		console.error('[project detail] fetch failed', err);
		throw err;
	}
}

export default ProjectDetailPage;
