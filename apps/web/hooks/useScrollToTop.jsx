import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { FiChevronUp } from 'react-icons/fi';

function useScrollToTop() {
	const [showScroll, setShowScroll] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const handleScroll = () => {
			setShowScroll(window.pageYOffset > 400);
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const backToTop = useCallback(() => {
		if (typeof window === 'undefined') return;
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, []);

	return (
		<AnimatePresence>
			{showScroll && (
				<motion.button
					type="button"
					onClick={backToTop}
					aria-label="Back to top"
					initial={{ opacity: 0, scale: 0.85 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.85 }}
					transition={{ duration: 0.18, ease: 'easeOut' }}
					className="scrollToTop fixed right-12 bottom-12 h-10 w-10 p-2 rounded-full cursor-pointer bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 flex items-center justify-center"
				>
					<FiChevronUp />
				</motion.button>
			)}
		</AnimatePresence>
	);
}

export default useScrollToTop;
