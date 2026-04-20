import ProjectSingle from './ProjectSingle';

function RelatedProjects({ projects = [] }) {
	if (projects.length === 0) return null;

	return (
		<div className="mt-10 pt-10 sm:pt-14 sm:mt-20 border-t-2 border-primary-light dark:border-secondary-dark">
			<p className="font-general-regular text-primary-dark dark:text-primary-light text-3xl font-bold mb-10 sm:mb-14 text-left">
				Related Projects
			</p>

			<div className={`grid grid-cols-1 gap-10 ${
				projects.length === 1 ? 'sm:grid-cols-1' :
				projects.length === 2 ? 'sm:grid-cols-2' :
				projects.length === 3 ? 'sm:grid-cols-3' :
				'sm:grid-cols-4'
			}`}>
				{projects.map((project) => (
					<ProjectSingle key={project.id} {...project} />
				))}
			</div>
		</div>
	);
}

export default RelatedProjects;
