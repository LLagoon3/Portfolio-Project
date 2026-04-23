import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import ProjectSingle from './ProjectSingle';
import ProjectsFilter from './ProjectsFilter';

const gridVariants = {
	hidden: { opacity: 1 },
	visible: {
		opacity: 1,
		transition: { delayChildren: 0.1, staggerChildren: 0.1 },
	},
};

function ProjectsGrid({ projects = [] }) {
	const [searchProject, setSearchProject] = useState('');
	const [selectProject, setSelectProject] = useState('');

	const categories = [...new Set(projects.map((p) => p.category))].sort();

	const normalizedSearch = searchProject.trim().toLowerCase();
	const filteredProjects = projects.filter((project) => {
		const matchesCategory =
			!selectProject || project.category === selectProject;
		const matchesSearch =
			!normalizedSearch ||
			project.title.toLowerCase().includes(normalizedSearch);
		return matchesCategory && matchesSearch;
	});

	return (
		<section className="py-5 sm:py-10 mt-5 sm:mt-10">
			<div className="text-center">
				<p className="font-general-medium text-2xl sm:text-4xl mb-1 text-ternary-dark dark:text-ternary-light">
					Projects portfolio
				</p>
			</div>

			<div className="mt-10 sm:mt-16">
				<h3
					className="
                        font-general-regular
                        text-center text-secondary-dark
                        dark:text-ternary-light
                        text-md
                        sm:text-xl
                        mb-3
                        "
				>
					프로젝트를 검색하거나 카테고리로 필터링하세요
				</h3>
				<div
					className="
                        flex
                        justify-between
                        border-b border-primary-light
                        dark:border-secondary-dark
                        pb-3
                        gap-3
                        "
				>
					<div className="flex justify-between gap-2">
						<span
							className="
                                hidden
                                sm:block
                                bg-primary-light
                                dark:bg-ternary-dark
                                p-2.5
                                shadow-sm
                                rounded-xl
                                cursor-pointer
                                "
						>
							<FiSearch className="text-ternary-dark dark:text-ternary-light w-5 h-5"></FiSearch>
						</span>
						<input
							value={searchProject}
							onChange={(e) => {
								setSearchProject(e.target.value);
							}}
							className="
                                font-general-medium
                                pl-3
                                pr-1
                                sm:px-4
                                py-2
                                border
                            border-gray-200
                                dark:border-secondary-dark
                                rounded-lg
                                text-sm
                                sm:text-md
                                bg-secondary-light
                                dark:bg-ternary-dark
                                text-primary-dark
                                dark:text-ternary-light
                                "
							id="name"
							name="name"
							type="search"
							placeholder="프로젝트 검색"
							aria-label="프로젝트 검색"
						/>
					</div>

					<ProjectsFilter setSelectProject={setSelectProject} categories={categories} />
				</div>
			</div>

			{/* 자체 AnimatePresence 로 감싸 상위 _app.jsx 의 initial={false}
			    가 PresenceContext 를 통해 내려와 stagger 첫 렌더 애니메이션을
			    차단하는 것을 우회한다. */}
			<AnimatePresence>
				<motion.div
					key="projects-grid"
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 sm:gap-5"
					variants={gridVariants}
					initial="hidden"
					animate="visible"
				>
					{filteredProjects.map((project) => (
						<ProjectSingle key={project.id ?? project.url} {...project} />
					))}
				</motion.div>
			</AnimatePresence>
		</section>
	);
}

export default ProjectsGrid;
