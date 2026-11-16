import { useEffect, useRef, useState } from 'react';
import ProjectsIcon from '../../projects/minimal/ProjectsIcon';
import ContactForm from './ContactForm';
import ContactMarkdown from './ContactMarkdown';
import { normalizeContact, socialLink } from '../../../lib/contact';
import styles from './Contact.module.css';

export const COPIED = '이메일 주소를 복사했습니다';
export const COPY_FAILED = '복사하지 못했습니다. 주소를 직접 선택해 복사해 주세요.';
const COPY_RESET_MS = 3000;

// 공개 이메일 한 번 + mailto 링크와 분리된 복사 버튼. 메일 앱을 여는 클릭이 클립보드를 건드리지 않게 한다.
// 복사 버튼은 JS 가 붙기 전에는 자리만 잡아 두고(보이지 않음) 동작하지 않는 버튼을 노출하지 않는다.
function EmailDetails({ email }) {
	const [hydrated, setHydrated] = useState(false);
	const [state, setState] = useState('idle'); // 'idle' | 'done' | 'failed'
	const timerRef = useRef(null);

	useEffect(() => {
		setHydrated(true);
		return () => clearTimeout(timerRef.current);
	}, []);

	const report = (ok) => {
		clearTimeout(timerRef.current);
		setState(ok ? 'done' : 'failed');
		if (ok) timerRef.current = setTimeout(() => setState('idle'), COPY_RESET_MS);
	};

	const handleCopy = () => {
		try {
			const clipboard = navigator.clipboard;
			if (!clipboard || typeof clipboard.writeText !== 'function') throw new Error('clipboard unavailable');
			clipboard.writeText(email).then(
				() => report(true),
				() => report(false),
			);
		} catch {
			report(false);
		}
	};

	const done = state === 'done';
	return (
		<>
			<div className={styles.emailLine}>
				<a className={styles.email} href={`mailto:${email}`}>
					{email}
				</a>
				<button
					type="button"
					className={`${styles.copy} ${hydrated ? '' : styles.copyPending}`.trim()}
					onClick={handleCopy}
					disabled={!hydrated}
				>
					<ProjectsIcon name={done ? 'check' : 'copy'} className={styles.copyIcon} />
					{done ? '복사했습니다' : '이메일 복사'}
				</button>
			</div>
			<p className={styles.copyHint} hidden={state !== 'failed'}>
				{COPY_FAILED}
			</p>
			<p className={styles.srOnly} role="status" aria-live="polite">
				{done ? COPIED : state === 'failed' ? COPY_FAILED : ''}
			</p>
		</>
	);
}

function Social({ label, url }) {
	const link = socialLink(url);
	const text = label || url;
	if (!link) return <span className={styles.socialText}>{text}</span>;
	if (!link.external) {
		return (
			<a className={styles.social} href={link.href}>
				{text}
			</a>
		);
	}
	return (
		<a className={styles.social} href={link.href} target="_blank" rel="noopener noreferrer">
			{text}
			<span className={styles.srOnly}> (새 탭)</span>
			<ProjectsIcon name="arrowUpRight" className={styles.socialIcon} />
		</a>
	);
}

// 이메일 / 주소 / 소셜 링크 중 실제로 있는 값만 한 목록으로 둔다.
function Direct({ email, address, socials }) {
	return (
		<div className={styles.directWrap}>
			<h2 className={styles.srOnly}>직접 연락</h2>
			<dl className={styles.direct}>
				{email ? (
					<div className={styles.directRow}>
						<dt>이메일</dt>
						<dd>
							<EmailDetails email={email} />
						</dd>
					</div>
				) : null}
				{address ? (
					<div className={styles.directRow}>
						<dt>주소</dt>
						<dd className={styles.address}>{address}</dd>
					</div>
				) : null}
				{socials.length ? (
					<div className={styles.directRow}>
						<dt>링크</dt>
						<dd>
							<ul className={styles.socials}>
								{socials.map((social, idx) => (
									<li key={`${social.label}-${social.url}-${idx}`}>
										<Social label={social.label} url={social.url} />
									</li>
								))}
							</ul>
						</dd>
					</div>
				) : null}
			</dl>
		</div>
	);
}

// 연락처 화면 본문. 제목과 답장 안내, 실제 공개 연락처, 문의 폼, (있을 때만) 자주 받는 질문 순서다.
// 비어 있는 값은 대체 문구 없이 생략한다.
export default function Contact({ contact }) {
	const { email, address, availability, socials, faqs } = normalizeContact(contact);
	const hasDirect = Boolean(email || address || socials.length);

	return (
		<div className={styles.page}>
			<section
				className={`${styles.intro} ${hasDirect ? '' : styles.introSingle}`.trim()}
				aria-labelledby="contact-title"
			>
				<div className={styles.introText}>
					<h1 id="contact-title" className={styles.title}>
						함께할 기회를 기다립니다
					</h1>
					<p className={styles.lead}>답장은 가능한 한 24시간 안에 드립니다</p>
					{availability ? <p className={styles.availability}>{availability}</p> : null}
				</div>
				{hasDirect ? <Direct email={email} address={address} socials={socials} /> : null}
			</section>

			<section className={styles.section} aria-labelledby="contact-form-title">
				<h2 id="contact-form-title" className={styles.sectionTitle}>
					메시지 보내기
				</h2>
				<div className={styles.sectionBody}>
					<ContactForm />
				</div>
			</section>

			{faqs.length ? (
				<section className={styles.section} aria-labelledby="contact-faq-title">
					<h2 id="contact-faq-title" className={styles.sectionTitle}>
						자주 받는 질문
					</h2>
					<div className={styles.sectionBody}>
						<ul className={styles.faqs}>
							{faqs.map((faq, idx) => (
								<li key={`${faq.question}-${idx}`}>
									{faq.question ? <h3 className={styles.question}>{faq.question}</h3> : null}
									{faq.answer.trim() ? <ContactMarkdown>{faq.answer}</ContactMarkdown> : null}
								</li>
							))}
						</ul>
					</div>
				</section>
			) : null}
		</div>
	);
}
