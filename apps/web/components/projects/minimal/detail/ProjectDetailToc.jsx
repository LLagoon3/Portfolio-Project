import { useEffect, useState } from 'react';
import styles from './ProjectDetail.module.css';

// 화면 위쪽 30% 선을 지난 마지막 섹션을 현재 섹션으로 본다. 문서 끝에 닿으면 마지막 섹션.
// 서버 HTML 과 첫 렌더는 항상 첫 섹션이라 hydration 결과가 같다.
function useActiveSection(idsKey) {
	const [active, setActive] = useState(() => idsKey.split(' ')[0]);

	useEffect(() => {
		const ids = idsKey.split(' ');
		let frame = 0;
		const update = () => {
			frame = 0;
			const doc = document.documentElement;
			let current = ids[0];
			if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
				current = ids[ids.length - 1];
			} else {
				const line = window.innerHeight * 0.3;
				ids.forEach((id) => {
					const section = document.getElementById(id);
					if (section && section.getBoundingClientRect().top < line) current = id;
				});
			}
			setActive(current);
		};
		const schedule = () => {
			if (!frame) frame = window.requestAnimationFrame(update);
		};
		update();
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule, { passive: true });
		return () => {
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, [idsKey]);

	return active;
}

// 데스크톱(>1050px)은 본문 오른쪽 sticky 목차, 그 아래 폭에서는 같은 nav 가 본문 앞에 인라인으로 놓인다.
export default function ProjectDetailToc({ sections }) {
	const active = useActiveSection(sections.map((section) => section.id).join(' '));

	return (
		<nav className={styles.toc} aria-labelledby="project-toc-label">
			<p id="project-toc-label" className={styles.tocLabel}>
				목차
			</p>
			<ul>
				{sections.map((section) => (
					<li key={section.id}>
						<a href={`#${section.id}`} aria-current={active === section.id ? 'true' : undefined}>
							{section.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
