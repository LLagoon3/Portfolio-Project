import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const ProjectSingle = ({ url, img, title, category }) => {
	return (
		<motion.div
			initial={false}
			animate={{ opacity: 1, delay: 1 }}
			transition={{
				ease: 'easeInOut',
				duration: 0.7,
				delay: 0.15,
			}}
		>
			<Link
				href="/projects/[url]"
				as={`/projects/${url}`}
				aria-label={title}
				passHref
			>
				<div className="rounded-xl shadow-lg hover:shadow-xl cursor-pointer mb-10 sm:mb-0 bg-secondary-light dark:bg-ternary-dark">
					<div>
						<Image
							src={img}
							className="rounded-t-xl border-none"
							alt={title}
							sizes="100vw"
							style={{ width: '100%', height: 'auto' }}
							width={100}
							height={90}
						/>
					</div>
					<div className="text-center px-4 py-6">
						<p className="font-general-medium text-xl md:text-2xl text-ternary-dark dark:text-ternary-light mb-2">
							{title}
						</p>
						{category && (
							<span className="text-lg text-ternary-dark dark:text-ternary-light">
								{category}
							</span>
						)}
					</div>
				</div>
			</Link>
		</motion.div>
	);
};

export default ProjectSingle;
