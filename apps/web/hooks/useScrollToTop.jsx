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
		<>
			<FiChevronUp
				className={`scrollToTop fixed right-12 bottom-12 h-10 w-10 p-2 rounded-full cursor-pointer bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 duration-300 ${showScroll ? 'flex' : 'hidden'}`}
				onClick={backToTop}
			/>
		</>
	);
}

export default useScrollToTop;
