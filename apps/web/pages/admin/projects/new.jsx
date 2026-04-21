import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProjectForm from '../../../components/admin/ProjectForm';
import { AdminApiError, fetchAdmin } from '../../../lib/admin/api';
import { requireAuth } from '../../../lib/admin/requireAuth';

function AdminProjectsNew() {
	const router = useRouter();

	async function handleSubmit(payload) {
		try {
			const created = await fetchAdmin('/api/admin/projects', {
				method: 'POST',
				body: payload,
			});
			router.replace(`/admin/projects/${created.id}/edit`);
		} catch (err) {
			if (err instanceof AdminApiError && err.status === 401) {
				router.replace('/admin/login');
				return;
			}
			throw err;
		}
	}

	return (
		<AdminLayout title="New Project">
			<ProjectForm submitLabel="생성" onSubmit={handleSubmit} />
		</AdminLayout>
	);
}

export const getServerSideProps = requireAuth();

export default AdminProjectsNew;
