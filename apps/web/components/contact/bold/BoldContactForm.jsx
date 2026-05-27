import { useState } from 'react';
import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';
import Chip from '../../primitives/Chip';
import PillButton from '../../primitives/PillButton';
import Toast from '../../primitives/Toast';

// 라군 신입에 맞춘 4개 topic. 후속에 백엔드 topicOptions[] 필드 도입 시 props 로 교체.
const TOPICS = ['신입 채용', '외주 · 협업', '기술 잡담', '기타'];

const EMPTY_FORM = {
	name: '',
	email: '',
	company: '',
	message: '',
};

const INPUT_STYLE = {
	background: 'transparent',
	border: '1px solid var(--line-strong)',
	color: 'var(--paper)',
	borderRadius: '12px',
	padding: '0.75rem 1rem',
	fontSize: '15px',
	fontFamily: 'inherit',
	width: '100%',
};

export default function BoldContactForm() {
	const [topic, setTopic] = useState(TOPICS[0]);
	const [form, setForm] = useState(EMPTY_FORM);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [toastVisible, setToastVisible] = useState(false);

	const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (submitting) return;
		setError('');
		setSubmitting(true);
		try {
			const payload = {
				name: form.name.trim(),
				email: form.email.trim(),
				message:
					(form.company.trim()
						? `[소속] ${form.company.trim()}\n\n`
						: '') + form.message.trim(),
				topic,
			};
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				const msg = Array.isArray(data?.message)
					? data.message.join(', ')
					: data?.message || data?.error?.message || '전송에 실패했습니다.';
				throw new Error(msg);
			}
			setToastVisible(true);
			setForm(EMPTY_FORM);
			setTopic(TOPICS[0]);
		} catch (err) {
			setError(err?.message || '전송에 실패했습니다.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section className="py-0">
			<Reveal>
				<Eyebrow className="mb-6">— Send a message</Eyebrow>
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					{/* Topic chips */}
					<div>
						<div
							className="mb-3 text-xs uppercase"
							style={{
								fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
								letterSpacing: '0.12em',
								color: 'var(--paper-faint)',
							}}
						>
							문의 종류
						</div>
						<div className="flex flex-wrap gap-2">
							{TOPICS.map((t) => (
								<Chip
									key={t}
									label={t}
									active={t === topic}
									onClick={() => setTopic(t)}
								/>
							))}
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<input
							type="text"
							required
							placeholder="이름 *"
							aria-label="이름"
							style={INPUT_STYLE}
							value={form.name}
							onChange={(e) => setField('name', e.target.value)}
						/>
						<input
							type="email"
							required
							placeholder="이메일 *"
							aria-label="이메일"
							style={INPUT_STYLE}
							value={form.email}
							onChange={(e) => setField('email', e.target.value)}
						/>
					</div>

					<input
						type="text"
						placeholder="소속 (선택)"
						aria-label="소속"
						style={INPUT_STYLE}
						value={form.company}
						onChange={(e) => setField('company', e.target.value)}
					/>

					<textarea
						required
						rows={6}
						placeholder="메시지 *"
						aria-label="메시지"
						style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: '160px' }}
						value={form.message}
						onChange={(e) => setField('message', e.target.value)}
					/>

					{error && (
						<p
							role="alert"
							className="text-sm"
							style={{ color: '#ef4444' }}
						>
							{error}
						</p>
					)}

					<div className="flex items-center gap-3">
						<PillButton
							variant="cta"
							as="button"
							type="submit"
							ariaLabel="메시지 보내기"
						>
							<span>{submitting ? '보내는 중…' : '메시지 보내기'}</span>
							<svg
								className="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden="true"
							>
								<path d="M5 12h14M13 6l6 6-6 6" />
							</svg>
						</PillButton>
					</div>
				</form>
			</Reveal>
			<Toast
				visible={toastVisible}
				message={'메시지가 전송됐어요.\n곧 회신드릴게요.'}
				onClose={() => setToastVisible(false)}
			/>
		</section>
	);
}
