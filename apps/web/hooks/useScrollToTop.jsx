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
				className="scrollToTop"
				onClick={backToTop}
				style={{
					height: 40,
					width: 40,
					padding: 7,
					borderRadius: 50,
					right: 50,
					bottom: 50,
					display: showScroll ? 'flex' : 'none',
				}}
			/>
		</>
	);
}

export default useScrollToTop;
