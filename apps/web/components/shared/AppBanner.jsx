import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiArrowDownCircle } from 'react-icons/fi';
import useThemeSwitcher from '../../hooks/useThemeSwitcher';

const fade = (delay = 0.2) => ({
	initial: false,
	animate: { opacity: 1 },
	transition: { ease: 'easeInOut', duration: 0.9, delay },
});

function AppBanner() {
	const [activeTheme, , mounted] = useThemeSwitcher();

	return (
		<motion.section
			{...fade(0.2)}
			className="flex flex-col sm:justify-between items-center sm:flex-row mt-5 md:mt-2"
		>
			<div className="w-full md:w-1/3 text-left">
				<motion.h1
					{...fade(0.1)}
					className="font-general-semibold text-2xl lg:text-3xl xl:text-4xl text-center sm:text-left text-ternary-dark dark:text-primary-light uppercase"
				>
					Hi, Iam Stoman
				</motion.h1>
				<motion.p
					{...fade(0.2)}
					className="font-general-medium mt-4 text-lg md:text-xl lg:text-2xl xl:text-3xl text-center sm:text-left leading-normal text-gray-500 dark:text-gray-200"
				>
					A Full-Stack Developer & Design Enthusiast
				</motion.p>
				<motion.div
					{...fade(0.3)}
					className="flex justify-center sm:block"
				>
					<a
						download="Stoman-Resume.pdf"
						href="/files/Stoman-Resume.pdf"
						className="font-general-medium flex justify-center items-center w-36 sm:w-48 mt-12 mb-6 sm:mb-0 text-lg border border-indigo-200 dark:border-ternary-dark py-2.5 sm:py-3 shadow-lg rounded-lg bg-indigo-50 focus:ring-1 focus:ring-indigo-900 hover:bg-indigo-500 text-gray-500 hover:text-white duration-500"
						aria-label="Download Resume"
					>
						<FiArrowDownCircle className="ml-0 sm:ml-1 mr-2 sm:mr-3 h-5 w-5 sm:w-6 sm:h-6 duration-100"></FiArrowDownCircle>
						<span className="text-sm sm:text-lg duration-100">
							Download CV
						</span>
					</a>
				</motion.div>
			</div>
			<motion.div
				{...fade(0.2)}
				animate={{ opacity: 1, y: 0 }}
				className="w-full sm:w-2/3 text-right float-right mt-8 sm:mt-0"
			>
				<Image
					src={
						mounted && activeTheme === 'dark'
							? '/images/developer.svg'
							: '/images/developer-dark.svg'
					}
					alt="Developer"
					width={600}
					height={600}
					sizes="100vw"
					style={{ width: '100%', height: 'auto' }}
					priority
				/>
			</motion.div>
		</motion.section>
	);
}

export default AppBanner;
