import Image from 'next/image';
import { FiClock, FiTag } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import PagesMetaHead from '../../components/PagesMetaHead';
import RelatedProjects from '../../components/projects/RelatedProjects';

const API_BASE_URL =
	process.env.API_INTERNAL_URL || 'http://localhost:7341';

function ProjectSingle(props) {
	return (
		<div className="container mx-auto">
			<PagesMetaHead title={props.project.title} />

			{/* Header */}
			<div>
				<p className="font-general-medium text-left text-3xl sm:text-4xl font-bold text-primary-dark dark:text-primary-light mt-14 sm:mt-20 mb-7">
					{props.project.ProjectHeader.title}
				</p>
				<div className="flex">
					<div className="flex items-center mr-10">
						<FiClock className="text-xl text-ternary-dark dark:text-ternary-light" />
						<span className="font-general-regular ml-2 leading-none text-primary-dark dark:text-primary-light">
							{props.project.ProjectHeader.publishDate}
						</span>
					</div>
					<div className="flex items-center">
						<FiTag className="w-4 h-4 text-ternary-dark dark:text-ternary-light" />
						<span className="font-general-regular ml-2 leading-none text-primary-dark dark:text-primary-light">
							{props.project.ProjectHeader.tags}
						</span>
					</div>
				</div>
			</div>

			{/* Gallery */}
			<div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-10 mt-12">
				{props.project.ProjectImages.map((project) => {
					return (
						<div className="mb-10 sm:mb-0" key={project.id}>
							<Image
								src={project.img}
								className="rounded-xl cursor-pointer shadow-lg sm:shadow-none"
								alt={project.title}
								sizes="100vw"
								style={{ width: '100%', height: 'auto' }}
								width={100}
								height={90}
							/>
						</div>
					);
				})}
			</div>

			{/* Info */}
			<div className="block sm:flex gap-0 sm:gap-10 mt-14">
				<div className="w-full sm:w-1/3 text-left">
					{/* Single project client details */}
					<div className="mb-7">
						<p className="font-general-regular text-2xl font-semibold text-secondary-dark dark:text-secondary-light mb-2">
							{props.project.ProjectInfo.ClientHeading}
						</p>
						<ul className="leading-loose">
							{props.project.ProjectInfo.CompanyInfo.map(
								(info) => {
									return (
										<li
											className="font-general-regular text-ternary-dark dark:text-ternary-light"
											key={info.id}
										>
											<span>{info.title}: </span>
											{info.title === 'Website' ? (
												<a
													href={info.details}
													target="_blank"
													rel="noopener noreferrer"
													className="hover:underline hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer duration-300"
													aria-label={`${info.title}: ${info.details}`}
												>
													{info.details}
												</a>
											) : (
												<span>{info.details}</span>
											)}
										</li>
									);
								}
							)}
						</ul>
					</div>

					{/* Single project objectives */}
					<div className="mb-7">
						<p className="font-general-regular text-2xl font-semibold text-ternary-dark dark:text-ternary-light mb-2">
							{props.project.ProjectInfo.ObjectivesHeading}
						</p>
						<p className="font-general-regular text-primary-dark dark:text-ternary-light">
							{props.project.ProjectInfo.ObjectivesDetails}
						</p>
					</div>

					{/* Single project technologies */}
					<div className="mb-7">
						<p className="font-general-regular text-2xl font-semibold text-ternary-dark dark:text-ternary-light mb-2">
							{props.project.ProjectInfo.Technologies[0].title}
						</p>
						<p className="font-general-regular text-primary-dark dark:text-ternary-light">
							{props.project.ProjectInfo.Technologies[0].techs.join(
								', '
							)}
						</p>
					</div>

					{/* Single project social sharing */}
					<div>
						<p className="font-general-regular text-2xl font-semibold text-ternary-dark dark:text-ternary-light mb-2">
							{props.project.ProjectInfo.SocialSharingHeading}
						</p>
						{/* <div className="flex items-center gap-3 mt-5">
							{props.project.ProjectInfo.SocialSharing.map(
								(social, index) => {
									<Link
										key={index}
										href={social.url}
										target="__blank"
										passHref={true}
										aria-label="Share Project"
										className="bg-ternary-light dark:bg-ternary-dark text-gray-400 hover:text-primary-dark dark:hover:text-primary-light p-2 rounded-lg shadow-sm duration-500"
									>
										<span className="text-lg lg:text-2xl">
											{social.icon}
										</span>
									</Link>;
								}
							)}
						</div> */}
					</div>
				</div>

				{/*  Single project right section details */}
				<div className="w-full sm:w-2/3 text-left mt-10 sm:mt-0">
					<p className="text-primary-dark dark:text-primary-light text-2xl font-bold mb-7">
						{props.project.ProjectInfo.ProjectDetailsHeading}
					</p>
					{props.project.ProjectInfo.ProjectDetails.map((details) => {
						return (
							<div
								key={details.id}
								className="prose prose-lg dark:prose-invert max-w-none mb-5 font-general-regular text-ternary-dark dark:text-ternary-light prose-headings:text-primary-dark dark:prose-headings:text-primary-light prose-strong:text-primary-dark dark:prose-strong:text-primary-light"
							>
								<ReactMarkdown>{details.details}</ReactMarkdown>
							</div>
						);
					})}
				</div>
			</div>

			<RelatedProjects projects={props.relatedProjects} />
		</div>
	);
}

export async function getServerSideProps({ query }) {
	const { url } = query;
	try {
		const res = await fetch(`${API_BASE_URL}/api/projects/${url}`);
		if (res.status === 404) {
			return { notFound: true };
		}
		if (!res.ok) {
			return { notFound: true };
		}
		const body = await res.json();
		const project = body?.data;
		if (!project) {
			return { notFound: true };
		}

		let relatedProjects = [];
		try {
			const category = encodeURIComponent(project.category);
			const relRes = await fetch(
				`${API_BASE_URL}/api/projects?category=${category}`
			);
			if (relRes.ok) {
				const relBody = await relRes.json();
				relatedProjects = (relBody?.data ?? [])
					.filter((p) => p.url !== url)
					.slice(0, 4);
			}
		} catch (relErr) {
			console.error('[project detail] fetch related failed', relErr);
		}

		return { props: { project, relatedProjects } };
	} catch (err) {
		console.error('[project detail] fetch failed', err);
		return { notFound: true };
	}
}

export default ProjectSingle;
