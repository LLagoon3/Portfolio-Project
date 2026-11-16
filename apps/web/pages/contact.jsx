import PagesMetaHead from '../components/PagesMetaHead';
import ProjectsLayout from '../components/projects/minimal/ProjectsLayout';
import Contact from '../components/contact/minimal/Contact';

const API_BASE_URL =
	process.env.API_INTERNAL_URL || 'http://localhost:7341';

const EMPTY_CONTACT = {
	address: null,
	email: null,
	availability: null,
	socials: [],
	faqs: [],
};

function ContactPage({ contact }) {
	return (
		<>
			<PagesMetaHead title="Contact" />
			<Contact contact={contact} />
		</>
	);
}

// 프로젝트 목록 / 상세 / About 과 같은 정적 레이아웃. 헤더는 Contact 를 현재 페이지로 두고,
// 이 화면 자신이 연락 수단이라 푸터의 연락 안내 줄은 빼고 저작권 / 맨 위로만 둔다.
ContactPage.getLayout = (page) => (
	<ProjectsLayout currentHref="/contact" showFooterCta={false}>
		{page}
	</ProjectsLayout>
);
// 라우트 전환 reveal / 플로팅 맨 위로 / 커서 / Hire Me 없이 렌더한다 (_app.jsx 참고).
ContactPage.minimalShell = true;

export async function getServerSideProps() {
	try {
		const res = await fetch(`${API_BASE_URL}/api/about`);
		if (res.status === 404) {
			// About 프로필이 아직 세팅되지 않은 합법적 상태 — 연락처 섹션을 비워서 렌더
			return { props: { contact: EMPTY_CONTACT } };
		}
		if (!res.ok) {
			throw new Error(`[contact] About API returned ${res.status}`);
		}
		const body = await res.json();
		const data = body?.data;
		return {
			props: {
				contact: {
					address: data?.address ?? null,
					email: data?.email ?? null,
					availability: data?.availability ?? null,
					socials: data?.socials ?? [],
					faqs: data?.faqs ?? [],
				},
			},
		};
	} catch (err) {
		console.error('[contact] fetch failed', err);
		throw err;
	}
}

export default ContactPage;
