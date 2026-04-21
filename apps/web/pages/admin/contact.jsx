import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import StatusBadge from '../../components/admin/StatusBadge';
import { AdminApiError, fetchAdmin } from '../../lib/admin/api';
import { requireAuth } from '../../lib/admin/requireAuth';

const FILTERS = [
	{ key: '', label: 'All' },
	{ key: 'pending', label: 'Pending' },
	{ key: 'read', label: 'Read' },
	{ key: 'replied', label: 'Replied' },
];

const STATUS_OPTIONS = ['pending', 'read', 'replied'];

function formatDate(iso) {
	try {
		return new Date(iso).toLocaleString('ko-KR', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});
	} catch {
		return iso;
	}
}

function AdminContactInbox({ initialPage, initialStatus }) {
	const router = useRouter();
	const [page, setPage] = useState(initialPage);
	const [status, setStatus] = useState(initialStatus);
	const [pendingId, setPendingId] = useState(null);
	const [error, setError] = useState('');

	const applyFilter = useCallback(
		(nextStatus) => {
			router.push(
				nextStatus
					? { pathname: '/admin/contact', query: { status: nextStatus } }
					: { pathname: '/admin/contact' },
			);
		},
		[router],
	);

	const handleStatusChange = useCallback(
		async (item, nextStatus) => {
			if (nextStatus === item.status) return;
			setPendingId(item.id);
			setError('');
			try {
				await fetchAdmin(`/api/admin/contact/${item.id}/status`, {
					method: 'PATCH',
					body: { status: nextStatus },
				});
				setPage((prev) => ({
					...prev,
					items: prev.items.map((row) =>
						row.id === item.id ? { ...row, status: nextStatus } : row,
					),
				}));
			} catch (err) {
				if (err instanceof AdminApiError && err.status === 401) {
					router.replace('/admin/login');
					return;
				}
				setError(err?.message ?? '상태 변경에 실패했습니다.');
			} finally {
				setPendingId(null);
			}
		},
		[router],
	);

	return (
		<AdminLayout title="Contact">
			<div className="flex flex-wrap items-center gap-2 mb-5">
				{FILTERS.map(({ key, label }) => {
					const active = (status ?? '') === key;
					return (
						<button
							key={label}
							type="button"
							onClick={() => applyFilter(key)}
							className={`px-3 py-1.5 rounded-full text-sm font-general-medium duration-300 ${
								active
									? 'bg-indigo-500 text-white'
									: 'bg-ternary-light dark:bg-ternary-dark text-primary-dark dark:text-primary-light hover:bg-indigo-100 dark:hover:bg-secondary-dark'
							}`}
						>
							{label}
						</button>
					);
				})}
				<span className="ml-auto text-sm font-general-regular text-ternary-dark dark:text-ternary-light">
					{page.total}건 (페이지 {page.page})
				</span>
			</div>

			{error && (
				<p className="font-general-regular text-sm text-red-500 dark:text-red-400 mb-3" role="alert">
					{error}
				</p>
			)}

			<AdminTable
				columns={[
					{
						key: 'createdAt',
						label: '시간',
						render: (row) => (
							<span className="text-xs text-ternary-dark dark:text-ternary-light">
								{formatDate(row.createdAt)}
							</span>
						),
					},
					{ key: 'name', label: '이름' },
					{
						key: 'email',
						label: '이메일',
						render: (row) => (
							<a
								href={`mailto:${row.email}`}
								className="text-indigo-600 dark:text-indigo-400 hover:underline"
							>
								{row.email}
							</a>
						),
					},
					{ key: 'subject', label: '주제' },
					{
						key: 'status',
						label: '상태',
						render: (row) => (
							<div className="flex items-center gap-2">
								<StatusBadge status={row.status} />
								<select
									value={row.status}
									disabled={pendingId === row.id}
									onChange={(e) => handleStatusChange(row, e.target.value)}
									className="px-2 py-1 text-xs border border-gray-300 dark:border-primary-dark border-opacity-50 bg-ternary-light dark:bg-ternary-dark rounded font-general-regular disabled:opacity-50"
									aria-label="Change status"
								>
									{STATUS_OPTIONS.map((opt) => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
							</div>
						),
					},
				]}
				rows={page.items}
				actions={(row) => (
					<Link
						href={`/admin/contact/${row.id}`}
						className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
					>
						상세
					</Link>
				)}
				emptyMessage="조건에 맞는 제출 내역이 없습니다."
			/>
		</AdminLayout>
	);
}

const API_BASE_URL = process.env.API_INTERNAL_URL || 'http://localhost:7341';

export const getServerSideProps = requireAuth(async (ctx) => {
	const cookieHeader = ctx.req?.headers?.cookie ?? '';
	const status = typeof ctx.query.status === 'string' ? ctx.query.status : '';
	const params = new URLSearchParams();
	if (status) params.set('status', status);

	const res = await fetch(
		`${API_BASE_URL}/api/admin/contact?${params.toString()}`,
		{ headers: cookieHeader ? { cookie: cookieHeader } : undefined },
	);
	if (!res.ok) {
		throw new Error(`[admin contact] list API returned ${res.status}`);
	}
	const body = await res.json();
	return {
		props: {
			initialPage: body?.data ?? { items: [], total: 0, page: 1, limit: 20 },
			initialStatus: status || null,
		},
	};
});

export default AdminContactInbox;
