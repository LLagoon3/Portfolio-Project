import { useEffect, useRef, useState } from 'react';
import ProjectsIcon from '../../projects/minimal/ProjectsIcon';
import {
	EMAIL_MAX_LENGTH,
	EMPTY_FORM,
	NAME_MAX_LENGTH,
	NETWORK_FAILED,
	REQUIRED_FIELDS,
	SUBMIT_FAILED,
	TOPICS,
	buildContactPayload,
	describeSubmitFailure,
	validateField,
	validateForm,
} from '../../../lib/contact';
import styles from './Contact.module.css';

export const CONTACT_ENDPOINT = '/api/contact';
export const SUBMIT_SUCCESS = '문의가 접수되었습니다';

const FIELD_IDS = {
	name: 'contact-name',
	email: 'contact-email',
	company: 'contact-company',
	message: 'contact-message',
};
const errorId = (name) => `${FIELD_IDS[name]}-error`;

// 응답 본문은 JSON 이 아닐 수도 있다 (프록시 오류 페이지 등). 읽지 못하면 null.
async function readBody(res) {
	try {
		return await res.json();
	} catch {
		return null;
	}
}

// 기존 /api/contact 계약 그대로 보내는 문의 폼. 성공 문구는 실제 응답이 성공일 때만 보여 주고,
// 입력값은 상태에만 두며 저장소에 남기지 않는다.
export default function ContactForm() {
	const [form, setForm] = useState(EMPTY_FORM);
	const [topic, setTopic] = useState(TOPICS[0]);
	const [errors, setErrors] = useState({});
	const [pending, setPending] = useState(false);
	const [result, setResult] = useState(null); // { type: 'success' | 'error', message }
	// JS 가 붙기 전(또는 꺼진 상태)에는 보내기를 막아, 기본 GET 제출로 입력값이 주소에 실리지 않게 한다.
	const [hydrated, setHydrated] = useState(false);
	const pendingRef = useRef(false);
	const submitRef = useRef(null);
	const fieldRefs = useRef({});

	useEffect(() => setHydrated(true), []);

	// 보내는 동안 버튼이 비활성화되며 포커스를 잃었다면, 끝난 뒤 다시 버튼으로 돌려 키보드 위치를 지킨다.
	const restoreFocusRef = useRef(false);
	useEffect(() => {
		if (pending || !restoreFocusRef.current) return;
		restoreFocusRef.current = false;
		const active = document.activeElement;
		if (!active || active === document.body) submitRef.current?.focus();
	}, [pending]);

	const clearResult = () => setResult((current) => (current ? null : current));

	const updateField = (name, value) => {
		setForm((current) => ({ ...current, [name]: value }));
		clearResult();
		// 이미 오류가 보이는 필드는 고치는 즉시 다시 확인한다.
		if (errors[name]) {
			setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
		}
	};

	const handleBlur = (name) => {
		if (!REQUIRED_FIELDS.includes(name)) return;
		if (!form[name].trim() && !errors[name]) return;
		setErrors((current) => ({ ...current, [name]: validateField(name, form[name]) }));
	};

	const handleTopicChange = (value) => {
		setTopic(value);
		clearResult();
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (pendingRef.current) return;

		const nextErrors = validateForm(form);
		setErrors(nextErrors);
		const firstInvalid = REQUIRED_FIELDS.find((name) => nextErrors[name]);
		if (firstInvalid) {
			setResult(null);
			fieldRefs.current[firstInvalid]?.focus();
			return;
		}

		pendingRef.current = true;
		restoreFocusRef.current = document.activeElement === submitRef.current;
		setPending(true);
		setResult(null);
		try {
			let res;
			try {
				res = await fetch(CONTACT_ENDPOINT, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(buildContactPayload(form, topic)),
				});
			} catch {
				setResult({ type: 'error', message: `${SUBMIT_FAILED} ${NETWORK_FAILED}` });
				return;
			}
			if (!res.ok) {
				const body = await readBody(res);
				setResult({ type: 'error', message: describeSubmitFailure(res.status, body) });
				return;
			}
			setForm(EMPTY_FORM);
			setTopic(TOPICS[0]);
			setErrors({});
			setResult({ type: 'success', message: SUBMIT_SUCCESS });
		} finally {
			pendingRef.current = false;
			setPending(false);
		}
	};

	const fieldProps = (name) => ({
		id: FIELD_IDS[name],
		name,
		ref: (node) => {
			fieldRefs.current[name] = node;
		},
		value: form[name],
		onChange: (event) => updateField(name, event.target.value),
		onBlur: () => handleBlur(name),
		'aria-invalid': errors[name] ? true : undefined,
		'aria-describedby': errors[name] ? errorId(name) : undefined,
	});

	const fieldError = (name) =>
		errors[name] ? (
			<p className={styles.error} id={errorId(name)}>
				{errors[name]}
			</p>
		) : null;

	return (
		<form className={styles.form} aria-labelledby="contact-form-title" noValidate onSubmit={handleSubmit}>
			<fieldset className={styles.topicGroup}>
				<legend>문의 종류</legend>
				<div className={styles.topics}>
					{TOPICS.map((value) => (
						<label key={value} className={styles.topic}>
							<input
								type="radio"
								name="topic"
								value={value}
								checked={topic === value}
								onChange={() => handleTopicChange(value)}
							/>
							{value}
						</label>
					))}
				</div>
			</fieldset>

			<div className={styles.fields}>
				<div className={styles.field}>
					<label htmlFor={FIELD_IDS.name}>이름</label>
					<input
						{...fieldProps('name')}
						type="text"
						autoComplete="name"
						maxLength={NAME_MAX_LENGTH}
						required
					/>
					{fieldError('name')}
				</div>
				<div className={styles.field}>
					<label htmlFor={FIELD_IDS.email}>이메일</label>
					<input
						{...fieldProps('email')}
						type="email"
						autoComplete="email"
						inputMode="email"
						spellCheck={false}
						maxLength={EMAIL_MAX_LENGTH}
						required
					/>
					{fieldError('email')}
				</div>
				<div className={`${styles.field} ${styles.fieldFull}`}>
					<label htmlFor={FIELD_IDS.company}>
						소속<span className={styles.optional}>(선택)</span>
					</label>
					<input {...fieldProps('company')} type="text" autoComplete="organization" />
				</div>
				<div className={`${styles.field} ${styles.fieldFull}`}>
					<label htmlFor={FIELD_IDS.message}>메시지</label>
					<textarea {...fieldProps('message')} rows={6} required />
					{fieldError('message')}
				</div>
			</div>

			<div className={styles.actions}>
				<button
					ref={submitRef}
					type="submit"
					className={styles.submit}
					disabled={!hydrated || pending}
				>
					{pending ? '보내는 중…' : '메시지 보내기'}
					<ProjectsIcon name="arrowRight" />
				</button>
				<noscript>
					<p className={styles.note}>메시지를 보내려면 JavaScript를 켜 주세요</p>
				</noscript>
			</div>

			<div className={styles.resultWrap}>
				<p className={styles.result} role="status" aria-live="polite">
					{result?.type === 'success' ? (
						<>
							<ProjectsIcon name="check" className={styles.resultIcon} />
							{result.message}
						</>
					) : null}
				</p>
				{result?.type === 'error' ? (
					<p className={styles.failure} role="alert">
						{result.message}
					</p>
				) : null}
			</div>
		</form>
	);
}
