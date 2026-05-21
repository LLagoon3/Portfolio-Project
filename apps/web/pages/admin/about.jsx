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

// 신규 DynamicList 항목 key 가 고유하도록 카운터 사용 (Math.random 보다 안정).
let __keyCounter = 0;
const nextKey = (prefix) => `${prefix}-${++__keyCounter}-${Date.now()}`;

function toFormState(about) {
	return {
		name: about?.name ?? '',
		tagline: about?.tagline ?? '',
		profileImage: about?.profileImage ?? '',
		bio: (about?.bio ?? []).map((paragraph) => ({
			_key: nextKey('bio'),
			paragraph,
		})),
		address: about?.address ?? '',
		email: about?.email ?? '',
		phone: about?.phone ?? '',
		// Bold 리디자인 후속 — 신규 5개 필드.
		availability: about?.availability ?? '',
		stats: (about?.stats ?? []).map((s) => ({
			_key: nextKey('stat'),
			label: s.label ?? '',
			value: s.value ?? '',
			sub: s.sub ?? '',
		})),
		principles: (about?.principles ?? []).map((p) => ({
			_key: nextKey('principle'),
			title: p.title ?? '',
			body: p.body ?? '',
		})),
		journey: (about?.journey ?? []).map((j) => ({
			_key: nextKey('journey'),
			year: j.year ?? '',
			title: j.title ?? '',
			role: j.role ?? '',
			body: j.body ?? '',
		})),
		stacks: (about?.stacks ?? []).map((stack) => ({
			_key: nextKey('stack'),
			value: stack,
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
				address: form.address.trim() || null,
				email: form.email.trim() || null,
				phone: form.phone.trim() || null,
				availability: form.availability.trim() || null,
				stats: form.stats
					.filter((s) => s.label.trim() && s.value.trim())
					.map((s) => ({
						label: s.label.trim(),
						value: s.value.trim(),
						sub: s.sub.trim() || null,
					})),
				principles: form.principles
					.filter((p) => p.title.trim() && p.body.trim())
					.map((p) => ({ title: p.title.trim(), body: p.body.trim() })),
				journey: form.journey
					.filter((j) => j.year.trim() && j.title.trim() && j.body.trim())
					.map((j) => ({
						year: j.year.trim(),
						title: j.title.trim(),
						role: j.role.trim() || null,
						body: j.body.trim(),
					})),
				stacks: form.stacks
					.map((s) => s.value.trim())
					.filter((v) => v.length > 0),
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

	const inputClass =
		'w-full px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-general-regular';

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
					title="연락처"
					description="공개 /contact 페이지 하단 Contact details 에 노출됩니다. 각 항목은 선택이며 비워두면 해당 줄이 숨겨집니다."
				>
					<label
						className="block text-lg text-primary-dark dark:text-primary-light mb-1 font-general-regular"
						htmlFor="about-address"
					>
						주소
					</label>
					<input
						id="about-address"
						name="address"
						type="text"
						placeholder="Seoul, South Korea"
						aria-label="Address"
						className="w-full px-5 py-2 mb-4 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-ternary-dark rounded-md shadow-sm text-md font-general-regular"
						value={form.address}
						onChange={(e) => set('address', e.target.value)}
					/>
					<label
						className="block text-lg text-primary-dark dark:text-primary-light mb-1 font-general-regular"
						htmlFor="about-email"
					>
						이메일
					</label>
					<input
						id="about-email"
						name="email"
						type="email"
						placeholder="me@example.com"
						aria-label="Email"
						className="w-full px-5 py-2 mb-4 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-ternary-dark rounded-md shadow-sm text-md font-general-regular"
						value={form.email}
						onChange={(e) => set('email', e.target.value)}
					/>
					<label
						className="block text-lg text-primary-dark dark:text-primary-light mb-1 font-general-regular"
						htmlFor="about-phone"
					>
						전화번호
					</label>
					<input
						id="about-phone"
						name="phone"
						type="text"
						placeholder="+82 10-1234-5678"
						aria-label="Phone"
						className="w-full px-5 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-ternary-dark rounded-md shadow-sm text-md font-general-regular"
						value={form.phone}
						onChange={(e) => set('phone', e.target.value)}
					/>
				</AdminFormSection>

				<AdminFormSection
					title="Bio 단락"
					description="입력 순서가 그대로 공개 페이지 노출 순서가 됩니다. 각 단락은 마크다운을 지원합니다."
				>
					<DynamicList
						items={form.bio}
						onChange={(next) => set('bio', next)}
						emptyItem={() => ({ _key: nextKey('bio'), paragraph: '' })}
						addLabel="단락 추가"
						renderItem={(item, _idx, onItemChange) => (
							<textarea
								className={inputClass}
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

				{/* === Bold 리디자인 후속 5개 섹션 === */}
				<AdminFormSection
					title="Hero Status (Availability)"
					description="About 페이지 Hero 우측 상단 status 한 줄. 비워두면 'About — 2026' 만 표시됩니다."
				>
					<input
						id="about-availability"
						type="text"
						placeholder="예: 신입 채용 검토 중"
						aria-label="Availability"
						className="w-full px-5 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-ternary-dark rounded-md shadow-sm text-md font-general-regular"
						value={form.availability}
						onChange={(e) => set('availability', e.target.value)}
					/>
				</AdminFormSection>

				<AdminFormSection
					title="In Numbers (Stats)"
					description="About 의 '측정된 흔적' 섹션. label/value 가 비어있는 항목은 저장 시 자동 제거됩니다."
				>
					<DynamicList
						items={form.stats}
						onChange={(next) => set('stats', next)}
						emptyItem={() => ({
							_key: nextKey('stat'),
							label: '',
							value: '',
							sub: '',
						})}
						addLabel="지표 추가"
						renderItem={(item, _idx, onItemChange) => (
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
								<input
									className={inputClass}
									placeholder="Label (예: Shipped Projects)"
									aria-label="Stat label"
									value={item.label}
									onChange={(e) => onItemChange({ label: e.target.value })}
								/>
								<input
									className={inputClass}
									placeholder="Value (예: 6)"
									aria-label="Stat value"
									value={item.value}
									onChange={(e) => onItemChange({ value: e.target.value })}
								/>
								<input
									className={inputClass}
									placeholder="설명 (선택)"
									aria-label="Stat sub"
									value={item.sub}
									onChange={(e) => onItemChange({ sub: e.target.value })}
								/>
							</div>
						)}
					/>
				</AdminFormSection>

				<AdminFormSection
					title="Principles"
					description="About 의 '작업을 이끄는 원칙' 섹션. title/body 둘 다 있어야 저장됩니다."
				>
					<DynamicList
						items={form.principles}
						onChange={(next) => set('principles', next)}
						emptyItem={() => ({
							_key: nextKey('principle'),
							title: '',
							body: '',
						})}
						addLabel="원칙 추가"
						renderItem={(item, _idx, onItemChange) => (
							<div className="flex flex-col gap-2">
								<input
									className={inputClass}
									placeholder="원칙 제목 (예: 원인을 끝까지 파고든다)"
									aria-label="Principle title"
									value={item.title}
									onChange={(e) => onItemChange({ title: e.target.value })}
								/>
								<textarea
									className={inputClass}
									rows={3}
									placeholder="원칙 본문"
									aria-label="Principle body"
									value={item.body}
									onChange={(e) => onItemChange({ body: e.target.value })}
								/>
							</div>
						)}
					/>
				</AdminFormSection>

				<AdminFormSection
					title="Journey"
					description="About 의 '지나온 길' 타임라인. year/title/body 셋 다 있어야 저장됩니다. year 는 '2026.01 — Now' 같은 자유 표현."
				>
					<DynamicList
						items={form.journey}
						onChange={(next) => set('journey', next)}
						emptyItem={() => ({
							_key: nextKey('journey'),
							year: '',
							title: '',
							role: '',
							body: '',
						})}
						addLabel="경력 추가"
						renderItem={(item, _idx, onItemChange) => (
							<div className="flex flex-col gap-2">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
									<input
										className={inputClass}
										placeholder="Year (예: 2026.01 — Now)"
										aria-label="Journey year"
										value={item.year}
										onChange={(e) => onItemChange({ year: e.target.value })}
									/>
									<input
										className={inputClass}
										placeholder="Title (예: 통합 로그 시스템)"
										aria-label="Journey title"
										value={item.title}
										onChange={(e) => onItemChange({ title: e.target.value })}
									/>
								</div>
								<input
									className={inputClass}
									placeholder="Role (선택, 예: 백엔드 · 외주)"
									aria-label="Journey role"
									value={item.role}
									onChange={(e) => onItemChange({ role: e.target.value })}
								/>
								<textarea
									className={inputClass}
									rows={3}
									placeholder="Body"
									aria-label="Journey body"
									value={item.body}
									onChange={(e) => onItemChange({ body: e.target.value })}
								/>
							</div>
						)}
					/>
				</AdminFormSection>

				<AdminFormSection
					title="Tech Stack"
					description="About 의 'Tech Stack' 그리드. 한 칸에 한 항목씩 입력. 비워둔 항목은 저장 시 자동 제거."
				>
					<DynamicList
						items={form.stacks}
						onChange={(next) => set('stacks', next)}
						emptyItem={() => ({ _key: nextKey('stack'), value: '' })}
						addLabel="스택 추가"
						renderItem={(item, _idx, onItemChange) => (
							<input
								className={inputClass}
								placeholder="예: NestJS"
								aria-label="Tech stack"
								value={item.value}
								onChange={(e) => onItemChange({ value: e.target.value })}
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
