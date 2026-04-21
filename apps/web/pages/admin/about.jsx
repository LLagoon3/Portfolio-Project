import { useRouter } from 'next/router';
import { useState } from 'react';
import AdminFormSection from '../../components/admin/AdminFormSection';
import AdminLayout from '../../components/admin/AdminLayout';
import DynamicList from '../../components/admin/DynamicList';
import ImageUploader from '../../components/admin/ImageUploader';
import Button from '../../components/reusable/Button';
import FormInput from '../../components/reusable/FormInput';
import { AdminApiError, fetchAdmin } from '../../lib/admin/api';
import { requireAuth } from '../../lib/admin/requireAuth';

function toFormState(about) {
	return {
		name: about?.name ?? '',
		tagline: about?.tagline ?? '',
		profileImage: about?.profileImage ?? '',
		bio: (about?.bio ?? []).map((paragraph, i) => ({
			_key: `bio-${i}-${Math.random()}`,
			paragraph,
		})),
	};
}

function AdminAboutEditor({ initialAbout }) {
	const router = useRouter();
	const [form, setForm] = useState(() => toFormState(initialAbout));
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');

	function set(name, value) {
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	async function handleSubmit(event) {
		event.preventDefault();
		if (submitting) return;
		setError('');
		setMessage('');
		setSubmitting(true);
		try {
			const payload = {
				name: form.name.trim(),
				tagline: form.tagline.trim() || null,
				profileImage: form.profileImage.trim(),
				bio: form.bio
					.map((b) => b.paragraph.trim())
					.filter((p) => p.length > 0),
			};
			const saved = await fetchAdmin('/api/admin/about', {
				method: 'PUT',
				body: payload,
			});
			setForm(toFormState(saved));
			setMessage('저장되었습니다.');
		} catch (err) {
			if (err instanceof AdminApiError && err.status === 401) {
				router.replace('/admin/login');
				return;
			}
			setError(err?.message ?? '저장에 실패했습니다.');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<AdminLayout title="About">
			<form onSubmit={handleSubmit}>
				<AdminFormSection
					title="프로필"
					description="공개 /about 페이지 상단에 노출되는 정보입니다."
				>
					<FormInput
						inputLabel="이름"
						labelFor="about-name"
						inputType="text"
						inputId="about-name"
						inputName="name"
						ariaLabelName="Name"
						placeholderText="Lagoon"
						value={form.name}
						onChange={(e) => set('name', e.target.value)}
					/>
					<label
						className="block text-lg text-primary-dark dark:text-primary-light mb-1 font-general-regular"
						htmlFor="about-tagline"
					>
						태그라인 (선택)
					</label>
					<input
						id="about-tagline"
						name="tagline"
						type="text"
						placeholder="Backend Developer"
						aria-label="Tagline"
						className="w-full px-5 py-2 mb-4 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-ternary-dark rounded-md shadow-sm text-md font-general-regular"
						value={form.tagline}
						onChange={(e) => set('tagline', e.target.value)}
					/>
					<label className="block text-lg text-primary-dark dark:text-primary-light mb-1 font-general-regular">
						프로필 이미지 (1:1 자동 crop)
					</label>
					<ImageUploader
						value={form.profileImage}
						onChange={(url) => set('profileImage', url)}
						previewAlt={form.name ? `${form.name} profile` : 'Profile preview'}
						preset="profile"
					/>
				</AdminFormSection>

				<AdminFormSection
					title="Bio 단락"
					description="입력 순서가 그대로 공개 페이지 노출 순서가 됩니다. 각 단락은 마크다운을 지원합니다."
				>
					<DynamicList
						items={form.bio}
						onChange={(next) => set('bio', next)}
						emptyItem={() => ({ _key: `bio-${Date.now()}`, paragraph: '' })}
						addLabel="단락 추가"
						renderItem={(item, _idx, onItemChange) => (
							<textarea
								className="w-full px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-mono"
								rows={6}
								placeholder="단락 본문 (마크다운 가능)"
								aria-label="Bio paragraph"
								value={item.paragraph}
								onChange={(e) => onItemChange({ paragraph: e.target.value })}
								required
							/>
						)}
					/>
				</AdminFormSection>

				{error && (
					<p className="font-general-regular text-sm text-red-500 dark:text-red-400 mb-3" role="alert">
						{error}
					</p>
				)}
				{message && (
					<p className="font-general-regular text-sm text-green-600 dark:text-green-400 mb-3" role="status">
						{message}
					</p>
				)}
				<div className="flex justify-end gap-2">
					<Button
						title={submitting ? '저장 중…' : '저장'}
						type="submit"
						variant="primary"
						disabled={submitting}
						ariaLabel="Save about"
					/>
				</div>
			</form>
		</AdminLayout>
	);
}

const API_BASE_URL = process.env.API_INTERNAL_URL || 'http://localhost:7341';

export const getServerSideProps = requireAuth(async (ctx) => {
	const cookieHeader = ctx.req?.headers?.cookie ?? '';
	const res = await fetch(`${API_BASE_URL}/api/about`, {
		headers: cookieHeader ? { cookie: cookieHeader } : undefined,
	});
	if (res.status === 404) {
		return { props: { initialAbout: null } };
	}
	if (!res.ok) {
		throw new Error(`[admin about] API returned ${res.status}`);
	}
	const body = await res.json();
	return { props: { initialAbout: body?.data ?? null } };
});

export default AdminAboutEditor;
