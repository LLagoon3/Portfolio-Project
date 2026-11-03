import { useEffect, useRef, useState } from 'react';
import HomeIcon from './HomeIcon';
import { RESUME_URL } from './HomeHero';
import styles from './Home.module.css';

// about.email 이 없을 때의 fallback (Contact 페이지와 동일한 규칙).
const DEFAULT_EMAIL =
	process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'choonarm3@gmail.com';
const GITHUB_URL = 'https://github.com/LLagoon3';
const TOAST_MS = 3000;

export default function ContactCTA({ email }) {
	const target = (typeof email === 'string' && email.trim()) || DEFAULT_EMAIL;
	const [toast, setToast] = useState('');
	const timerRef = useRef(null);

	useEffect(() => () => clearTimeout(timerRef.current), []);

	// 클립보드가 없거나 거부되면 주소 자체를 보여 줘 직접 옮겨 적을 수 있게 한다.
	const copyEmail = async () => {
		let message;
		try {
			if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
			await navigator.clipboard.writeText(target);
			message = '이메일 주소를 복사했어요';
		} catch {
			message = `이메일: ${target}`;
		}
		setToast(message);
		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => setToast(''), TOAST_MS);
	};

	return (
		<section id="contact" className={styles.contact} aria-labelledby="contact-title">
			<div className={styles.eyebrow}>
				<span className={`${styles.eyebrowNumber} ${styles.mono}`}>03 /</span>
				Contact
			</div>
			<div className={styles.contactTop}>
				<div>
					<h2 id="contact-title" className={`${styles.sectionTitle} ${styles.contactTitle}`}>
						함께할 기회를 기다립니다
					</h2>
					<p className={styles.contactSub}>
						더 나은 서비스를 만드는 팀에 기여하고 싶습니다.
						<br />
						언제든 편하게 연락 주세요.
					</p>
				</div>
				<a className={styles.email} href={`mailto:${target}`}>
					{target}
					<HomeIcon name="external" />
				</a>
			</div>
			<div className={styles.contactLinks}>
				<a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
					GitHub
					<HomeIcon name="external" />
					<span className={styles.srOnly}>(새 탭)</span>
				</a>
				<a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
					이력서
					<HomeIcon name="external" />
					<span className={styles.srOnly}>(새 탭)</span>
				</a>
				<button type="button" className={styles.copyEmail} onClick={copyEmail}>
					이메일 복사
					<HomeIcon name="copy" />
				</button>
			</div>
			<div className={styles.toast} role="status" aria-live="polite">
				{toast}
			</div>
		</section>
	);
}
