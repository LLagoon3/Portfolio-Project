import '../styles/globals.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import DefaultLayout from '../components/layout/DefaultLayout';
import UseScrollToTop from '../hooks/useScrollToTop';

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	// 어드민 라우트는 폼 편집 중 라우트 왕복이 잦아 페이지 전환 애니메이션을
	// 태우지 않는다. 공개 페이지에만 fade + subtle y-slide 트랜지션 적용.
	const isAdmin = router.pathname.startsWith('/admin');

	// per-page layout override (Next.js Pages Router 권장 패턴).
	// 페이지에서 `Page.getLayout = (page) => <BoldLayout>{page}</BoldLayout>` 식으로 override.
	// 미지정 시 DefaultLayout fallback — 기존 페이지 영향 0.
	const getLayout =
		Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

	const inner = isAdmin ? (
		<Component {...pageProps} />
	) : (
		<AnimatePresence mode="wait" initial={false}>
			<motion.div
				key={router.asPath}
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -8 }}
				transition={{ duration: 0.25, ease: 'easeOut' }}
			>
				<Component {...pageProps} />
			</motion.div>
		</AnimatePresence>
	);

	return (
		<div className="bg-secondary-light dark:bg-primary-dark transition duration-300">
			{getLayout(inner)}
			<UseScrollToTop />
		</div>
	);
}

export default MyApp;
