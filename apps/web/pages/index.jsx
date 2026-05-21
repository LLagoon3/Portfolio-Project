import Link from 'next/link';
import PagesMetaHead from '../components/PagesMetaHead';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import AppBanner from '../components/shared/AppBanner';

const API_BASE_URL =
	process.env.API_INTERNAL_URL || 'http://localhost:7341';

export default function Home({ projects }) {
	return (
		<div className="container mx-auto">
			<PagesMetaHead title="Home" />

			<AppBanner />

			<ProjectsGrid projects={projects} />

			<div className="mt-10 sm:mt-15 flex justify-center">
				<Link
					href="/projects"
					aria-label="More Projects"
					className="font-general-medium px-7 py-4 text-lg sm:text-xl text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-1 focus:ring-indigo-900 rounded-lg shadow-lg hover:shadow-xl duration-500"
				>
					More Projects
				</Link>
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	try {
		const res = await fetch(`${API_BASE_URL}/api/projects`);
		if (res.status === 404) {
			// 프로젝트 목록 API 가 404 를 반환하는 건 비정상이지만, 배포 순서 이슈 등으로
			// 일시적으로 발생할 수 있으므로 홈이 하드 크래시되지 않도록 빈 배열로 fallback
			return { props: { projects: [] } };
		}
		if (!res.ok) {
			// 5xx 등 비정상 응답은 시스템 장애이므로 감추지 않고 Next.js 에러 페이지로 드러낸다
			throw new Error(`[home] projects API returned ${res.status}`);
		}
		const body = await res.json();
		return { props: { projects: body?.data ?? [] } };
	} catch (err) {
		console.error('[home] fetch projects failed', err);
		throw err;
	}
}
