import PagesMetaHead from '../components/PagesMetaHead';
import HomeLayout from '../components/home/HomeLayout';
import HomeHero from '../components/home/HomeHero';
import HomeProjects from '../components/home/HomeProjects';
import AboutStrip from '../components/home/AboutStrip';
import ContactCTA from '../components/home/ContactCTA';
import { HOME_PROJECT_LIMIT, pickAboutSummary } from '../lib/home';

const API_BASE_URL = process.env.API_INTERNAL_URL || 'http://localhost:7341';

// SSR 에서 projects + about 를 한 번에 fetch. 실패는 빈 값으로 fallback.
async function fetchJsonSafe(path) {
	try {
		const res = await fetch(`${API_BASE_URL}${path}`);
		if (res.status === 404) return null;
		if (!res.ok) throw new Error(`[home] ${path} → ${res.status}`);
		const body = await res.json();
		return body?.data ?? null;
	} catch (err) {
		console.error(`[home] fetch ${path} failed`, err);
		return null;
	}
}

export default function Home({ projects, about }) {
	return (
		<>
			<PagesMetaHead title="Home" />
			<HomeHero role={about?.tagline} />
			{/* API 순서 그대로 앞의 6개만 노출. 검색은 전체 목록에서 찾아 최대 6개까지 보여 준다. */}
			<HomeProjects projects={projects} displayLimit={HOME_PROJECT_LIMIT} />
			<AboutStrip summary={pickAboutSummary(about?.bio)} />
			<ContactCTA email={about?.email} />
		</>
	);
}

// Next.js Pages Router 의 per-page layout 패턴 — _app.jsx 의 getLayout 이 호출.
Home.getLayout = (page) => <HomeLayout>{page}</HomeLayout>;
// 홈은 라우트 전환 reveal 과 플로팅 맨 위로 버튼 없이 렌더한다 (_app.jsx 참고).
Home.minimalShell = true;

export async function getServerSideProps() {
	const [projects, about] = await Promise.all([
		fetchJsonSafe('/api/projects'),
		fetchJsonSafe('/api/about'),
	]);
	return {
		props: {
			projects: Array.isArray(projects) ? projects : [],
			about: about ?? null,
		},
	};
}
