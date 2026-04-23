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

	return (
		<div className="bg-secondary-light dark:bg-primary-dark transition duration-300">
			<DefaultLayout>
				{isAdmin ? (
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
				)}
			</DefaultLayout>
			<UseScrollToTop />
		</div>
	);
}

export default MyApp;
