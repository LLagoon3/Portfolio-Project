import PagesMetaHead from '../../components/PagesMetaHead';
import ProjectsLayout from '../../components/projects/minimal/ProjectsLayout';
import ProjectsBrowser from '../../components/projects/minimal/ProjectsBrowser';
import { sortProjectsForIndex } from '../../lib/projectsIndex';

const API_BASE_URL = process.env.API_INTERNAL_URL || 'http://localhost:7341';

function ProjectsIndex({ projects }) {
	return (
		<>
			<PagesMetaHead title="Projects" />
			<ProjectsBrowser projects={projects} />
		</>
	);
}

ProjectsIndex.getLayout = (page) => <ProjectsLayout>{page}</ProjectsLayout>;
// 홈과 같이 라우트 전환 reveal 과 플로팅 맨 위로 버튼 없이 렌더한다 (_app.jsx 참고).
ProjectsIndex.minimalShell = true;

export async function getServerSideProps() {
	try {
		const res = await fetch(`${API_BASE_URL}/api/projects`);
		if (res.status === 404) {
			// 목록 API 가 404 를 돌려주는 건 비정상이지만, 방어적으로 빈 배열 fallback
			return { props: { projects: [] } };
		}
		if (!res.ok) {
			// 5xx 등 비정상 응답은 시스템 장애이므로 감추지 않고 Next.js 에러 페이지로 드러낸다
			throw new Error(`[projects] API returned ${res.status}`);
		}
		const body = await res.json();
		// 기본(최신순) 정렬은 서버에서 한 번만 해 내려 보낸다. 브라우저 로케일이 달라도
		// hydration 순서와 프로젝트 번호가 서버 HTML 과 같게 유지된다.
		return { props: { projects: sortProjectsForIndex(body?.data ?? []) } };
	} catch (err) {
		console.error('[projects] fetch failed', err);
		throw err;
	}
}

export default ProjectsIndex;
