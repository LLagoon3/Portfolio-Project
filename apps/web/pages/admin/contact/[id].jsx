import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import AdminFormSection from '../../../components/admin/AdminFormSection';
import AdminLayout from '../../../components/admin/AdminLayout';
import StatusBadge from '../../../components/admin/StatusBadge';
import { AdminApiError, fetchAdmin } from '../../../lib/admin/api';
import { requireAuth } from '../../../lib/admin/requireAuth';

const STATUS_OPTIONS = ['pending', 'read', 'replied'];

function formatDate(iso) {
	try {
		return new Date(iso).toLocaleString('ko-KR');
	} catch {
		return iso;
	}
}

function AdminContactDetail({ initial }) {
	const router = useRouter();
	const [detail, setDetail] = useState(initial);
	const [updating, setUpdating] = useState(false);
	const [error, setError] = useState('');

	async function handleStatusChange(nextStatus) {
		if (nextStatus === detail.status) return;
		setUpdating(true);
		setError('');
		try {
			const updated = await fetchAdmin(
				`/api/admin/contact/${detail.id}/status`,
				{ method: 'PATCH', body: { status: nextStatus } },
			);
			setDetail(updated);
		} catch (err) {
			if (err instanceof AdminApiError && err.status === 401) {
				router.replace('/admin/login');
				return;
			}
			setError(err?.message ?? '상태 변경에 실패했습니다.');
		} finally {
			setUpdating(false);
		}
	}

	return (
		<AdminLayout title={`Contact · ${detail.subject}`}>
			<div className="mb-4">
				<Link
					href="/admin/contact"
					className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
				>
					<FiArrowLeft className="w-4 h-4" />
					목록으로
				</Link>
			</div>

			<AdminFormSection title="메타 정보">
				<dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 font-general-regular">
					<div>
						<dt className="text-xs text-ternary-dark dark:text-ternary-light">이름</dt>
						<dd className="text-primary-dark dark:text-primary-light">{detail.name}</dd>
					</div>
					<div>
						<dt className="text-xs text-ternary-dark dark:text-ternary-light">이메일</dt>
						<dd>
							<a
								href={`mailto:${detail.email}`}
								className="text-indigo-600 dark:text-indigo-400 hover:underline"
							>
								{detail.email}
							</a>
						</dd>
					</div>
					<div>
						<dt className="text-xs text-ternary-dark dark:text-ternary-light">주제</dt>
						<dd className="text-primary-dark dark:text-primary-light">{detail.subject}</dd>
					</div>
					<div>
						<dt className="text-xs text-ternary-dark dark:text-ternary-light">제출 시각</dt>
						<dd className="text-primary-dark dark:text-primary-light">
							{formatDate(detail.createdAt)}
						</dd>
					</div>
					<div>
						<dt className="text-xs text-ternary-dark dark:text-ternary-light">상태</dt>
						<dd className="flex items-center gap-2">
							<StatusBadge status={detail.status} />
							<select
								value={detail.status}
								onChange={(e) => handleStatusChange(e.target.value)}
								disabled={updating}
								className="px-2 py-1 text-xs border border-gray-300 dark:border-primary-dark border-opacity-50 bg-ternary-light dark:bg-ternary-dark rounded disabled:opacity-50"
								aria-label="Change status"
							>
								{STATUS_OPTIONS.map((opt) => (
									<option key={opt} value={opt}>
										{opt}
									</option>
								))}
							</select>
						</dd>
					</div>
				</dl>
				{error && (
					<p className="mt-3 text-sm text-red-500 dark:text-red-400" role="alert">
						{error}
					</p>
				)}
			</AdminFormSection>

			<AdminFormSection title="메시지">
				<pre className="whitespace-pre-wrap font-general-regular text-sm text-primary-dark dark:text-primary-light leading-relaxed">
					{detail.message}
				</pre>
			</AdminFormSection>
		</AdminLayout>
	);
}

const API_BASE_URL = process.env.API_INTERNAL_URL || 'http://localhost:7341';

export const getServerSideProps = requireAuth(async (ctx) => {
	const id = ctx.params?.id;
	const cookieHeader = ctx.req?.headers?.cookie ?? '';
	const res = await fetch(`${API_BASE_URL}/api/admin/contact/${id}`, {
		headers: cookieHeader ? { cookie: cookieHeader } : undefined,
	});
	if (res.status === 404) {
		return { notFound: true };
	}
	if (!res.ok) {
		throw new Error(`[admin contact detail] API returned ${res.status}`);
	}
	const body = await res.json();
	return { props: { initial: body?.data } };
});

export default AdminContactDetail;
