import PagesMetaHead from '../../components/PagesMetaHead';
import ProjectsGrid from '../../components/projects/ProjectsGrid';

const API_BASE_URL =
	process.env.API_INTERNAL_URL || 'http://localhost:7341';

function ProjectsIndex({ projects }) {
	return (
		<div className="container mx-auto">
			<PagesMetaHead title="Projects" />

			<ProjectsGrid projects={projects} />
		</div>
	);
}

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
		return { props: { projects: body?.data ?? [] } };
	} catch (err) {
		console.error('[projects] fetch failed', err);
		throw err;
	}
}

export default ProjectsIndex;
