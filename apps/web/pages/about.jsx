import { motion } from 'framer-motion';
import AboutClients from '../components/about/AboutClients';
import AboutCounter from '../components/about/AboutCounter';
import AboutMeBio from '../components/about/AboutMeBio';
import PagesMetaHead from '../components/PagesMetaHead';

const API_BASE_URL =
	process.env.API_INTERNAL_URL || 'http://localhost:7341';

const EMPTY_ABOUT = {
	name: '',
	tagline: null,
	profileImage: '/images/profile.jpeg',
	bio: [],
};

function About({ about }) {
	return (
		<div>
			<PagesMetaHead title="About Me" />

			<motion.div
				initial={false}
				animate={{ opacity: 1, delay: 1 }}
				exit={{ opacity: 0 }}
				className="container mx-auto"
			>
				<AboutMeBio
					name={about.name}
					tagline={about.tagline}
					profileImage={about.profileImage}
					bio={about.bio}
				/>
			</motion.div>

			{/** Counter without paddings */}
			<motion.div
				initial={false}
				animate={{ opacity: 1, delay: 1 }}
				exit={{ opacity: 0 }}
			>
				<AboutCounter />
			</motion.div>

			<motion.div
				initial={false}
				animate={{ opacity: 1, delay: 1 }}
				exit={{ opacity: 0 }}
				className="container mx-auto"
			>
				<AboutClients />
			</motion.div>
		</div>
	);
}

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
