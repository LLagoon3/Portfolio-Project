import Image from 'next/image';
import Link from 'next/link';

function RelatedProjects({ projects = [] }) {
	if (projects.length === 0) return null;

	return (
		<div className="mt-10 pt-10 sm:pt-14 sm:mt-20 border-t-2 border-primary-light dark:border-secondary-dark">
			<p className="font-general-regular text-primary-dark dark:text-primary-light text-3xl font-bold mb-10 sm:mb-14 text-left">
				Related Projects
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-4 gap-10">
				{projects.map((project) => (
					<Link
						key={project.id}
						href="/projects/[url]"
						as={`/projects/${project.url}`}
						aria-label={project.title}
						passHref
					>
						<div className="rounded-xl shadow-lg hover:shadow-xl cursor-pointer bg-secondary-light dark:bg-ternary-dark">
							<Image
								src={project.img}
								className="rounded-t-xl"
								width={400}
								height={400}
								sizes="100vw"
								style={{ width: '100%', height: 'auto' }}
								alt={project.title}
							/>
							<div className="text-center px-4 py-4">
								<p className="font-general-medium text-lg text-ternary-dark dark:text-ternary-light">
									{project.title}
								</p>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

export default RelatedProjects;
