import PagesMetaHead from '../components/PagesMetaHead';
import ProjectsLayout from '../components/projects/minimal/ProjectsLayout';
import About, { AboutResumeLink } from '../components/about/minimal/About';

const API_BASE_URL = process.env.API_INTERNAL_URL || 'http://localhost:7341';

const EMPTY_ABOUT = {
	name: '',
	tagline: null,
	profileImage: '/images/profile.jpeg',
	bio: [],
	availability: null,
	stats: [],
	principles: [],
	journey: [],
	stacks: [],
};

function AboutPage({ about }) {
	return (
		<>
			<PagesMetaHead title="About Me" />
			<About about={about} />
		</>
	);
}

// 프로젝트 목록 / 상세와 같은 정적 레이아웃. 헤더는 About 을 현재 페이지로, 푸터는 연락하기 앞에
// 기존 Notion 이력서 링크를 둔다.
AboutPage.getLayout = (page) => (
	<ProjectsLayout currentHref="/about" footerActions={<AboutResumeLink />}>
		{page}
	</ProjectsLayout>
);
// 라우트 전환 reveal / 플로팅 맨 위로 / 커서 / Hire Me 없이 렌더한다 (_app.jsx 참고).
AboutPage.minimalShell = true;

export async function getServerSideProps() {
	try {
		const res = await fetch(`${API_BASE_URL}/api/about`);
		if (res.status === 404) {
			// 프로필이 아직 세팅되지 않은 합법적 데이터 상태 — 빈 About 으로 graceful 렌더
			return { props: { about: EMPTY_ABOUT } };
		}
		if (!res.ok) {
			// 5xx 등 비정상 응답은 시스템 장애이므로 감추지 않고 Next.js 에러 페이지로 드러낸다
			throw new Error(`[about] API returned ${res.status}`);
		}
		const body = await res.json();
		return { props: { about: body?.data ?? EMPTY_ABOUT } };
	} catch (err) {
		console.error('[about] fetch failed', err);
		throw err;
	}
}

export default AboutPage;
