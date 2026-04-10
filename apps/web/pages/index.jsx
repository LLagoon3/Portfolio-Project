import Link from 'next/link';
import PagesMetaHead from '../components/PagesMetaHead';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import Button from '../components/reusable/Button';
import AppBanner from '../components/shared/AppBanner';

const API_BASE_URL =
	process.env.API_INTERNAL_URL || 'http://localhost:7341';

export default function Home({ projects }) {
	return (
		<div className="container mx-auto">
			<PagesMetaHead title="Home" />

			<AppBanner />

			<ProjectsGrid projects={projects} />

			<div className="mt-10 sm:mt-15 flex justify-center">
				<Link href="/projects" aria-label="More Projects" passHref>
					<Button
						title="More Projects"
						size="lg"
						className="text-lg sm:text-xl shadow-lg hover:shadow-xl rounded-lg"
					/>
				</Link>
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	try {
		const res = await fetch(`${API_BASE_URL}/api/projects`);
		if (!res.ok) {
			return { props: { projects: [] } };
		}
		const body = await res.json();
		return { props: { projects: body?.data ?? [] } };
	} catch (err) {
		console.error('[home] fetch projects failed', err);
		return { props: { projects: [] } };
	}
}
