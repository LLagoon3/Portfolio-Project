import BoldLayout from '../components/layout/bold/BoldLayout';
import PagesMetaHead from '../components/PagesMetaHead';
import HomeHero from '../components/home/HomeHero';
import KeywordMarquee from '../components/home/KeywordMarquee';
import HomeProjects from '../components/home/HomeProjects';
import AboutStrip from '../components/home/AboutStrip';
import ContactCTA from '../components/home/ContactCTA';

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
	const bioFirst = Array.isArray(about?.bio) ? about.bio[0] : null;

	return (
		<>
			<PagesMetaHead title="Home" />
			<HomeHero tagline={about?.tagline} />
			<KeywordMarquee />
			{/* 메인은 highlight 슬롯 6개 한정 — total / 카테고리 카운트는 HomeProjects
			    내부에서 전체 projects 기준으로 계산하고 그리드만 displayLimit 까지 잘림. */}
			<HomeProjects projects={projects} displayLimit={6} />
			<AboutStrip bioFirst={bioFirst} />
			<ContactCTA />
		</>
	);
}

// Next.js Pages Router 의 per-page layout 패턴 — _app.jsx 의 getLayout 이 호출.
Home.getLayout = (page) => <BoldLayout>{page}</BoldLayout>;

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
