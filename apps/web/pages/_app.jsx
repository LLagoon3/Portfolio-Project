import '../styles/globals.css';
import { AnimatePresence } from 'framer-motion';
import DefaultLayout from '../components/layout/DefaultLayout';
import UseScrollToTop from '../hooks/useScrollToTop';

function MyApp({ Component, pageProps }) {
	// per-page layout override (Next.js Pages Router 권장 패턴).
	// 페이지에서 `Page.getLayout = (page) => <BoldLayout>{page}</BoldLayout>` 식으로 override.
	// 미지정 시 DefaultLayout fallback — 기존 페이지 영향 0.
	const getLayout =
		Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

	return (
		<AnimatePresence>
			<div className=" bg-secondary-light dark:bg-primary-dark transition duration-300">
				{getLayout(<Component {...pageProps} />)}
				<UseScrollToTop />
			</div>
		</AnimatePresence>
	);
}

export default MyApp;
