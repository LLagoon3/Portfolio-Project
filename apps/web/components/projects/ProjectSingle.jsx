import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ProjectSingle = ({ url, img, title, category }) => {
	return (
		<motion.div variants={itemVariants}>
			<Link
				href="/projects/[url]"
				as={`/projects/${url}`}
				aria-label={title}
				passHref
			>
				<motion.div
					whileHover={{ y: -4 }}
					transition={{ duration: 0.2, ease: 'easeOut' }}
					className="rounded-xl shadow-lg hover:shadow-xl cursor-pointer mb-10 sm:mb-0 bg-secondary-light dark:bg-ternary-dark"
				>
					{/* thumbnail preset 이 16:9 로 정규화되므로 카드 썸네일도 같은 비율로 고정. */}
					<div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
						<Image
							src={img}
							alt={title}
							fill
							sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
							style={{ objectFit: 'cover' }}
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
				</motion.div>
			</Link>
		</motion.div>
	);
};

export default ProjectSingle;
