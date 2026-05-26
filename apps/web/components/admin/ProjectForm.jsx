import { useState } from 'react';
import Button from '../reusable/Button';
import FormInput from '../reusable/FormInput';
import AdminFormSection from './AdminFormSection';
import DynamicList from './DynamicList';
import ImageUploader from './ImageUploader';

const DEFAULT_VALUES = {
	title: '',
	url: '',
	category: '',
	thumbnailImg: '',
	headerPublishDate: '',
	headerTags: '',
	clientHeading: 'About Project',
	objectivesHeading: 'Objective',
	objectivesDetails: '',
	projectDetailsHeading: 'Challenge',
	socialSharingHeading: '',
	// Phase 2 (선택) — Bold Hero / Impact / Quote 섹션.
	heroSubtitle: '',
	heroAccentWord: '',
	quote: { text: '', author: '' },
	stats: [],
	links: [],
	images: [],
	companyInfo: [],
	// 공개 상세 페이지가 Technologies[0] 을 직접 참조하므로 최소 1 그룹을 기본으로 유지한다.
	technologies: [{ title: 'Tools & Technologies', techs: [] }],
	details: [],
};

function toFormState(initial) {
	const merged = { ...DEFAULT_VALUES, ...(initial ?? {}) };
	// Phase 2 — api 응답의 ProjectInfo.Impact / ProjectInfo.Quote / ProjectInfo.Links 도 흡수.
	// upsert 응답은 ProjectDetailDto 형식이므로 ProjectInfo 안에서 꺼낸다.
	const apiImpact = initial?.ProjectInfo?.Impact ?? initial?.stats ?? [];
	const apiQuote = initial?.ProjectInfo?.Quote ?? initial?.quote ?? null;
	const apiLinks = initial?.ProjectInfo?.Links ?? initial?.links ?? [];
	return {
		...merged,
		heroSubtitle: merged.heroSubtitle ?? '',
		heroAccentWord: merged.heroAccentWord ?? '',
		quote: {
			text: apiQuote?.text ?? '',
			author: apiQuote?.author ?? '',
		},
		stats: apiImpact.map((s, i) => ({
			_key: `stat-${i}-${Math.random()}`,
			label: s.label ?? '',
			value: s.value ?? '',
			sub: s.sub ?? '',
		})),
		links: apiLinks.map((l, i) => ({
			_key: `link-${i}-${Math.random()}`,
			label: l.label ?? '',
			url: l.url ?? '',
		})),
		images: (merged.images ?? []).map((img, i) => ({
			_key: `img-${i}-${Math.random()}`,
			title: img.title ?? '',
			img: img.img ?? '',
		})),
		companyInfo: (merged.companyInfo ?? []).map((info, i) => ({
			_key: `ci-${i}-${Math.random()}`,
			title: info.title ?? '',
			details: info.details ?? '',
		})),
		technologies: (merged.technologies ?? []).map((tech, i) => ({
			_key: `tech-${i}-${Math.random()}`,
			title: tech.title ?? '',
			techs: (tech.techs ?? []).join(', '),
		})),
		details: (merged.details ?? []).map((d, i) => ({
			_key: `d-${i}-${Math.random()}`,
			kind: d.kind ?? '',
			title: d.title ?? '',
			details: d.details ?? '',
		})),
	};
}

function toSubmitPayload(form) {
	const quoteText = form.quote?.text?.trim() ?? '';
	const quoteAuthor = form.quote?.author?.trim() ?? '';
	return {
		title: form.title.trim(),
		url: form.url.trim(),
		category: form.category.trim(),
		thumbnailImg: form.thumbnailImg.trim(),
		headerPublishDate: form.headerPublishDate.trim(),
		headerTags: form.headerTags.trim(),
		clientHeading: form.clientHeading.trim(),
		objectivesHeading: form.objectivesHeading.trim(),
		objectivesDetails: form.objectivesDetails.trim(),
		projectDetailsHeading: form.projectDetailsHeading.trim(),
		socialSharingHeading: form.socialSharingHeading.trim() || undefined,
		heroSubtitle: form.heroSubtitle.trim() || null,
		heroAccentWord: form.heroAccentWord.trim() || null,
		// Phase 2: text 비면 quote 자체 미전송 (api 가 null 로 cascade delete).
		quote: quoteText ? { text: quoteText, author: quoteAuthor || null } : null,
		stats: form.stats
			.map((s) => ({
				label: s.label.trim(),
				value: s.value.trim(),
				sub: s.sub?.trim() ? s.sub.trim() : null,
			}))
			.filter((s) => s.label && s.value),
		links: form.links
			.map((l) => ({
				label: l.label.trim(),
				url: l.url.trim(),
			}))
			.filter((l) => l.label && l.url),
		images: form.images.map((img) => ({ title: img.title, img: img.img })),
		companyInfo: form.companyInfo.map((info) => ({
			title: info.title,
			details: info.details,
		})),
		technologies: form.technologies.map((tech) => ({
			title: tech.title,
			techs: tech.techs
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean),
		})),
		details: form.details.map((d) => ({
			kind: d.kind?.trim() || null,
			title: d.title?.trim() || null,
			details: d.details,
		})),
	};
}

function ProjectForm({ initialValue, submitLabel = '저장', onSubmit }) {
	const [form, setForm] = useState(() => toFormState(initialValue));
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	function set(name, value) {
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	async function handleSubmit(event) {
		event.preventDefault();
		if (submitting) return;
		setError('');
		setSubmitting(true);
		try {
			await onSubmit(toSubmitPayload(form));
		} catch (err) {
			console.error('[admin project form] submit failed', err);
			setError(err?.message ?? '저장에 실패했습니다.');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<AdminFormSection title="기본 정보" description="프로젝트 목록·헤더에 노출되는 핵심 필드입니다.">
				<FormInput
					inputLabel="제목"
					labelFor="title"
					inputType="text"
					inputId="title"
					inputName="title"
					ariaLabelName="Title"
					placeholderText="프로젝트 제목"
					value={form.title}
					onChange={(e) => set('title', e.target.value)}
				/>
				<FormInput
					inputLabel="URL slug (예: my-project)"
					labelFor="url"
					inputType="text"
					inputId="url"
					inputName="url"
					ariaLabelName="URL slug"
					placeholderText="my-project"
					value={form.url}
					onChange={(e) => set('url', e.target.value)}
				/>
				<FormInput
					inputLabel="카테고리"
					labelFor="category"
					inputType="text"
					inputId="category"
					inputName="category"
					ariaLabelName="Category"
					placeholderText="Web Application / Backend / ..."
					value={form.category}
					onChange={(e) => set('category', e.target.value)}
				/>
				<label className="block text-lg text-primary-dark dark:text-primary-light mb-1 font-general-regular">
					썸네일 이미지 (16:9 자동 crop)
				</label>
				<ImageUploader
					value={form.thumbnailImg}
					onChange={(url) => set('thumbnailImg', url)}
					previewAlt="Thumbnail preview"
					preset="thumbnail"
					className="mb-4"
				/>
				<FormInput
					inputLabel="게시일 표기"
					labelFor="headerPublishDate"
					inputType="text"
					inputId="headerPublishDate"
					inputName="headerPublishDate"
					ariaLabelName="Publish date"
					placeholderText="2026.01 – 2026.03"
					value={form.headerPublishDate}
					onChange={(e) => set('headerPublishDate', e.target.value)}
				/>
				<FormInput
					inputLabel="헤더 태그"
					labelFor="headerTags"
					inputType="text"
					inputId="headerTags"
					inputName="headerTags"
					ariaLabelName="Header tags"
					placeholderText="Backend / Realtime"
					value={form.headerTags}
					onChange={(e) => set('headerTags', e.target.value)}
				/>
			</AdminFormSection>

			<AdminFormSection
				title="Bold Hero (선택)"
				description="Bold Project Detail 의 거대 타이틀 보강. 미입력 시 web 이 폴백(마지막 단어 accent + Overview 첫 단락)."
			>
				<FormInput
					inputLabel="Hero Subtitle"
					labelFor="heroSubtitle"
					inputType="text"
					inputId="heroSubtitle"
					inputName="heroSubtitle"
					ariaLabelName="Hero subtitle"
					placeholderText="여러 서비스 로그를 한 곳에 모으는 인프라."
					value={form.heroSubtitle}
					onChange={(e) => set('heroSubtitle', e.target.value)}
				/>
				<FormInput
					inputLabel="Hero Accent Word (강조할 단어, 미입력 시 타이틀 마지막 단어)"
					labelFor="heroAccentWord"
					inputType="text"
					inputId="heroAccentWord"
					inputName="heroAccentWord"
					ariaLabelName="Hero accent word"
					placeholderText="시스템"
					value={form.heroAccentWord}
					onChange={(e) => set('heroAccentWord', e.target.value)}
				/>
			</AdminFormSection>

			<AdminFormSection
				title="Quote (선택)"
				description="Bold Project Detail 의 pull quote 섹션. text 가 비면 섹션 자체가 미노출."
			>
				<label
					className="block text-lg text-primary-dark dark:text-primary-light mb-1 font-general-regular"
					htmlFor="quoteText"
				>
					Quote text
				</label>
				<textarea
					id="quoteText"
					name="quoteText"
					rows={3}
					placeholder="6주 안에 결제 로직을 안정화하면서, 운영팀의 새벽 호출이 90% 줄었다."
					aria-label="Quote text"
					className="w-full px-5 py-2 mb-4 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-ternary-dark rounded-md shadow-sm text-md font-general-regular"
					value={form.quote.text}
					onChange={(e) => set('quote', { ...form.quote, text: e.target.value })}
				/>
				<FormInput
					inputLabel="Author (선택)"
					labelFor="quoteAuthor"
					inputType="text"
					inputId="quoteAuthor"
					inputName="quoteAuthor"
					ariaLabelName="Quote author"
					placeholderText="프로젝트 회고"
					value={form.quote.author}
					onChange={(e) => set('quote', { ...form.quote, author: e.target.value })}
				/>
			</AdminFormSection>

			<AdminFormSection
				title="Impact stats (선택, 최대 3개)"
				description="Bold Project Detail 의 Impact 섹션 카운터. value 가 숫자면 자동 카운트업, 단위 섞이면 plain. 빈 배열이면 섹션 미노출."
			>
				<DynamicList
					items={form.stats}
					onChange={(next) => set('stats', next)}
					emptyItem={() => ({
						_key: `stat-${Date.now()}`,
						label: '',
						value: '',
						sub: '',
					})}
					addLabel="Stat 추가"
					maxLength={3}
					renderItem={(item, _idx, onItemChange) => (
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
							<input
								className="px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-general-regular"
								placeholder="Label (예: Latency)"
								aria-label="Stat label"
								value={item.label}
								onChange={(e) => onItemChange({ label: e.target.value })}
								required
							/>
							<input
								className="px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-general-regular"
								placeholder="Value (예: -72%)"
								aria-label="Stat value"
								value={item.value}
								onChange={(e) => onItemChange({ value: e.target.value })}
								required
							/>
							<input
								className="px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-general-regular"
								placeholder="Sub (선택, 예: 검색 평균 응답)"
								aria-label="Stat sub"
								value={item.sub}
								onChange={(e) => onItemChange({ sub: e.target.value })}
							/>
						</div>
					)}
				/>
			</AdminFormSection>

			<AdminFormSection
				title="Links (선택, 최대 10개)"
				description="GitHub / Notion / Demo / 배포 등 외부 링크. Project Detail Hero meta strip 아래 Direct row 로 노출. label·url 둘 다 있어야 저장."
			>
				<DynamicList
					items={form.links}
					onChange={(next) => set('links', next)}
					emptyItem={() => ({
						_key: `link-${Date.now()}`,
						label: '',
						url: '',
					})}
					addLabel="Link 추가"
					maxLength={10}
					renderItem={(item, _idx, onItemChange) => (
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
							<input
								className="px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-general-regular"
								placeholder="라벨 (예: @LLagoon3, Demo ↗)"
								aria-label="Link label"
								value={item.label}
								onChange={(e) => onItemChange({ label: e.target.value })}
							/>
							<input
								className="px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-general-regular sm:col-span-2"
								placeholder="URL"
								aria-label="Link url"
								value={item.url}
								onChange={(e) => onItemChange({ url: e.target.value })}
							/>
						</div>
					)}
				/>
			</AdminFormSection>

			<AdminFormSection title="Objective" description="프로젝트 상세의 목표 영역 문구.">
				<FormInput
					inputLabel="Objective heading"
					labelFor="objectivesHeading"
					inputType="text"
					inputId="objectivesHeading"
					inputName="objectivesHeading"
					ariaLabelName="Objectives heading"
					placeholderText="Objective"
					value={form.objectivesHeading}
					onChange={(e) => set('objectivesHeading', e.target.value)}
				/>
				<label
					className="block text-lg text-primary-dark dark:text-primary-light mb-1 font-general-regular"
					htmlFor="objectivesDetails"
				>
					Objective details
				</label>
				<textarea
					id="objectivesDetails"
					name="objectivesDetails"
					rows={4}
					placeholder="한 줄 소개"
					aria-label="Objective details"
					className="w-full px-5 py-2 mb-4 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-ternary-dark rounded-md shadow-sm text-md font-general-regular"
					value={form.objectivesDetails}
					onChange={(e) => set('objectivesDetails', e.target.value)}
					required
				/>
			</AdminFormSection>

			<AdminFormSection title="About Project 영역" description="Projects 상세의 좌측 메타 블록.">
				<FormInput
					inputLabel="About heading"
					labelFor="clientHeading"
					inputType="text"
					inputId="clientHeading"
					inputName="clientHeading"
					ariaLabelName="Client heading"
					placeholderText="About Project"
					value={form.clientHeading}
					onChange={(e) => set('clientHeading', e.target.value)}
				/>
				<DynamicList
					items={form.companyInfo}
					onChange={(next) => set('companyInfo', next)}
					emptyItem={() => ({ _key: `ci-${Date.now()}`, title: '', details: '' })}
					addLabel="About 항목 추가"
					renderItem={(item, _idx, onItemChange) => (
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
							<input
								className="px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-general-regular sm:col-span-1"
								placeholder="항목 이름 (예: Services)"
								aria-label="Company info title"
								value={item.title}
								onChange={(e) => onItemChange({ title: e.target.value })}
								required
							/>
							<input
								className="px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-general-regular sm:col-span-2"
								placeholder="값 (URL 은 자동으로 링크 렌더링)"
								aria-label="Company info details"
								value={item.details}
								onChange={(e) => onItemChange({ details: e.target.value })}
								required
							/>
						</div>
					)}
				/>
			</AdminFormSection>

			<AdminFormSection title="기술 스택" description="한 줄에 콤마(,) 로 구분해서 입력합니다. 최소 1그룹이 필요합니다.">
				<DynamicList
					items={form.technologies}
					onChange={(next) => set('technologies', next)}
					emptyItem={() => ({
						_key: `tech-${Date.now()}`,
						title: 'Tools & Technologies',
						techs: '',
					})}
					addLabel="기술 그룹 추가"
					minLength={1}
					renderItem={(item, _idx, onItemChange) => (
						<div className="flex flex-col gap-2">
							<input
								className="px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-general-regular"
								placeholder="그룹 제목 (예: Tools & Technologies)"
								aria-label="Technology group title"
								value={item.title}
								onChange={(e) => onItemChange({ title: e.target.value })}
								required
							/>
							<input
								className="px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-general-regular"
								placeholder="콤마로 구분 (Node.js, NestJS, MySQL)"
								aria-label="Technologies comma separated"
								value={item.techs}
								onChange={(e) => onItemChange({ techs: e.target.value })}
							/>
						</div>
					)}
				/>
			</AdminFormSection>

			<AdminFormSection
				title="Challenge 섹션"
				description="Project Detail 의 Process 카드. kind / title 을 직접 입력하면 1 entry = 1 step. 비우면 본문 markdown 의 ## h2 split + 키워드 매칭 폴백."
			>
				<FormInput
					inputLabel="Challenge heading"
					labelFor="projectDetailsHeading"
					inputType="text"
					inputId="projectDetailsHeading"
					inputName="projectDetailsHeading"
					ariaLabelName="Project details heading"
					placeholderText="Challenge"
					value={form.projectDetailsHeading}
					onChange={(e) => set('projectDetailsHeading', e.target.value)}
				/>
				<DynamicList
					items={form.details}
					onChange={(next) => set('details', next)}
					emptyItem={() => ({
						_key: `d-${Date.now()}`,
						kind: '',
						title: '',
						details: '',
					})}
					addLabel="Challenge 단락 추가"
					renderItem={(item, _idx, onItemChange) => (
						<div className="flex flex-col gap-2">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								<input
									className="px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-general-regular"
									placeholder="Kind (예: DECISION / OPS / 구조 결정)"
									aria-label="Process kind"
									value={item.kind}
									onChange={(e) => onItemChange({ kind: e.target.value })}
								/>
								<input
									className="px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-general-regular"
									placeholder="Title (예: 하나의 이벤트 소스)"
									aria-label="Process title"
									value={item.title}
									onChange={(e) => onItemChange({ title: e.target.value })}
								/>
							</div>
							<textarea
								className="w-full px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-mono"
								rows={8}
								placeholder="본문 (마크다운 가능). kind/title 비우면 ## h2 split 폴백"
								aria-label="Challenge markdown block"
								value={item.details}
								onChange={(e) => onItemChange({ details: e.target.value })}
								required
							/>
						</div>
					)}
				/>
			</AdminFormSection>

			<AdminFormSection title="갤러리 이미지" description="프로젝트 상세 상단에 노출되는 이미지 배열. alt 텍스트와 함께 업로드합니다.">
				<DynamicList
					items={form.images}
					onChange={(next) => set('images', next)}
					emptyItem={() => ({ _key: `img-${Date.now()}`, title: '', img: '' })}
					addLabel="이미지 추가"
					renderItem={(item, _idx, onItemChange) => (
						<div className="flex flex-col gap-2">
							<input
								className="px-3 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-secondary-dark rounded-md text-sm font-general-regular"
								placeholder="alt 텍스트"
								aria-label="Image alt"
								value={item.title}
								onChange={(e) => onItemChange({ title: e.target.value })}
								required
							/>
							<ImageUploader
								value={item.img}
								onChange={(url) => onItemChange({ img: url })}
								previewAlt={item.title || 'Gallery preview'}
								preset="gallery"
							/>
						</div>
					)}
				/>
			</AdminFormSection>

			{error && (
				<p className="font-general-regular text-sm text-red-500 dark:text-red-400 mb-3" role="alert">
					{error}
				</p>
			)}
			<div className="flex justify-end gap-2">
				<Button
					title={submitting ? '저장 중…' : submitLabel}
					type="submit"
					variant="primary"
					disabled={submitting}
					ariaLabel="Save project"
				/>
			</div>
		</form>
	);
}

export default ProjectForm;
