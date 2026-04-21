import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/admin/AdminLayout';
import ProjectForm from '../../../../components/admin/ProjectForm';
import { AdminApiError, fetchAdmin } from '../../../../lib/admin/api';
import { requireAuth } from '../../../../lib/admin/requireAuth';

function toFormInitial(project) {
	const info = project.ProjectInfo ?? {};
	return {
		title: project.title,
		url: project.url,
		category: project.category,
		thumbnailImg: project.img,
		headerPublishDate: project.ProjectHeader?.publishDate ?? '',
		headerTags: project.ProjectHeader?.tags ?? '',
		clientHeading: info.ClientHeading ?? '',
		objectivesHeading: info.ObjectivesHeading ?? '',
		objectivesDetails: info.ObjectivesDetails ?? '',
		projectDetailsHeading: info.ProjectDetailsHeading ?? 'Challenge',
		socialSharingHeading: info.SocialSharingHeading ?? '',
		images: (project.ProjectImages ?? []).map((img) => ({
			title: img.title,
			img: img.img,
		})),
		companyInfo: (info.CompanyInfo ?? []).map((c) => ({
			title: c.title,
			details: c.details,
		})),
		technologies: (info.Technologies ?? []).map((t) => ({
			title: t.title,
			techs: t.techs ?? [],
		})),
		details: (info.ProjectDetails ?? []).map((d) => ({ details: d.details })),
	};
}

function AdminProjectsEdit({ project }) {
	const router = useRouter();

	async function handleSubmit(payload) {
		try {
			const updated = await fetchAdmin(`/api/admin/projects/${project.id}`, {
				method: 'PUT',
				body: payload,
			});
			// slug 이 바뀌었을 수 있지만 편집 라우트는 id 기반이므로 URL 유지
			router.replace(`/admin/projects/${updated.id}/edit`);
		} catch (err) {
			if (err instanceof AdminApiError && err.status === 401) {
				router.replace('/admin/login');
				return;
			}
			throw err;
		}
	}

	return (
		<AdminLayout title={`Edit · ${project.title}`}>
			<ProjectForm
				initialValue={toFormInitial(project)}
				submitLabel="저장"
				onSubmit={handleSubmit}
			/>
		</AdminLayout>
	);
}

const API_BASE_URL = process.env.API_INTERNAL_URL || 'http://localhost:7341';

export const getServerSideProps = requireAuth(async (ctx) => {
	const id = ctx.params?.id;
	const cookieHeader = ctx.req?.headers?.cookie ?? '';
	const res = await fetch(`${API_BASE_URL}/api/admin/projects/${id}`, {
		headers: cookieHeader ? { cookie: cookieHeader } : undefined,
	});
	if (res.status === 404) {
		return { notFound: true };
	}
	if (!res.ok) {
		throw new Error(`[admin projects edit] API returned ${res.status}`);
	}
	const body = await res.json();
	return { props: { project: body?.data } };
});

export default AdminProjectsEdit;
