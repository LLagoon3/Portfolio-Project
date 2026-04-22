import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminTable from '../../../components/admin/AdminTable';
import { AdminApiError, fetchAdmin } from '../../../lib/admin/api';
import { requireAuth } from '../../../lib/admin/requireAuth';

function AdminProjectsList({ initialProjects }) {
	const router = useRouter();
	const [projects, setProjects] = useState(initialProjects);
	const [pendingId, setPendingId] = useState(null);
	const [error, setError] = useState('');

	const handleDelete = useCallback(
		async (project) => {
			const confirmed = window.confirm(
				`'${project.title}' 프로젝트를 삭제할까요? 연관 이미지·상세·기술 목록도 함께 제거됩니다.`,
			);
			if (!confirmed) return;
			setError('');
			setPendingId(project.id);
			try {
				await fetchAdmin(`/api/admin/projects/${project.id}`, { method: 'DELETE' });
				setProjects((prev) => prev.filter((p) => p.id !== project.id));
			} catch (err) {
				if (err instanceof AdminApiError && err.status === 401) {
					router.replace('/admin/login');
					return;
				}
				setError(err?.message ?? '삭제에 실패했습니다.');
			} finally {
				setPendingId(null);
			}
		},
		[router],
	);

	return (
		<AdminLayout title="Projects">
			<div className="flex items-center justify-between mb-5">
				<p className="font-general-regular text-ternary-dark dark:text-ternary-light">
					총 {projects.length}개 프로젝트
				</p>
				<Link
					href="/admin/projects/new"
					className="inline-flex items-center gap-2 font-general-medium text-sm text-white bg-indigo-500 hover:bg-indigo-600 rounded-md px-4 py-2 duration-300"
				>
					<FiPlus className="w-4 h-4" />
					새 프로젝트
				</Link>
			</div>
			{error && (
				<p className="font-general-regular text-sm text-red-500 dark:text-red-400 mb-3" role="alert">
					{error}
				</p>
			)}
			<AdminTable
				columns={[
					{ key: 'title', label: '제목' },
					{
						key: 'url',
						label: 'URL',
						render: (row) => (
							<Link
								href={`/projects/${row.url}`}
								className="text-indigo-600 dark:text-indigo-400 hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								{row.url}
							</Link>
						),
					},
					{ key: 'category', label: '카테고리' },
				]}
				rows={projects}
				actions={(row) => (
					<>
						<Link
							href={`/admin/projects/${row.id}/edit`}
							className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
						>
							<FiEdit2 className="w-4 h-4" />
							편집
						</Link>
						<button
							type="button"
							onClick={() => handleDelete(row)}
							disabled={pendingId === row.id}
							className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<FiTrash2 className="w-4 h-4" />
							{pendingId === row.id ? '삭제 중…' : '삭제'}
						</button>
					</>
				)}
				emptyMessage="등록된 프로젝트가 없습니다. 새 프로젝트를 만들어보세요."
			/>
		</AdminLayout>
	);
}

const API_BASE_URL = process.env.API_INTERNAL_URL || 'http://localhost:7341';

export const getServerSideProps = requireAuth(async (ctx) => {
	// 목록은 공개 엔드포인트 재사용 (관리자 전용 목록이 따로 필요 없음)
	const cookieHeader = ctx.req?.headers?.cookie ?? '';
	const res = await fetch(`${API_BASE_URL}/api/projects`, {
		headers: cookieHeader ? { cookie: cookieHeader } : undefined,
	});
	if (!res.ok) {
		throw new Error(`[admin projects] list API returned ${res.status}`);
	}
	const body = await res.json();
	return { props: { initialProjects: body?.data ?? [] } };
});

export default AdminProjectsList;
