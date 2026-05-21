import BoldLayout from '../components/layout/bold/BoldLayout';
import PagesMetaHead from '../components/PagesMetaHead';
import AboutHero from '../components/about/bold/AboutHero';
import AboutBioSection from '../components/about/bold/AboutBioSection';
import AboutCounters from '../components/about/bold/AboutCounters';
import AboutPrinciples from '../components/about/bold/AboutPrinciples';
import AboutJourney from '../components/about/bold/AboutJourney';
import AboutBrands from '../components/about/bold/AboutBrands';
import AboutContactCTA from '../components/about/bold/AboutContactCTA';

const API_BASE_URL = process.env.API_INTERNAL_URL || 'http://localhost:7341';

const EMPTY_ABOUT = {
	name: '',
	tagline: null,
	profileImage: '/images/profile.jpeg',
	bio: [],
};

function About({ about }) {
	return (
		<>
			<PagesMetaHead title="About Me" />
			<AboutHero
				name={about.name}
				tagline={about.tagline}
				profileImage={about.profileImage}
			/>
			<AboutBioSection bio={about.bio} />
			<AboutCounters />
			<AboutPrinciples />
			<AboutJourney />
			<AboutBrands />
			<AboutContactCTA />
		</>
	);
}

About.getLayout = (page) => <BoldLayout>{page}</BoldLayout>;

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

export default About;
