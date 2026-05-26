import { useEffect, useState } from 'react';

// lg+ 좌측 컬럼 sticky 섹션 네비. main content 와 별도 column 이라 침범 없음.
// active 추적은 scroll 위치 기반 — viewport 상단 30% 라인 기준 가장 최근에 통과한 섹션을
// active 로. IntersectionObserver 의 intersectionRatio 방식은 섹션 높이가 들쭉날쭉하면
// 짧은 섹션 (예: Gallery 3-image) 을 skip 하는 문제가 있어 교체.
export default function BoldProjectDetailSideNav({ sections = [] }) {
	const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

	useEffect(() => {
		const ids = sections.map((s) => s.id).filter(Boolean);
		if (ids.length === 0) return undefined;

		const handleScroll = () => {
			if (typeof window === 'undefined') return;
			const refLine = window.innerHeight * 0.3;
			let currentId = ids[0];
			for (const id of ids) {
				const el = document.getElementById(id);
				if (!el) continue;
				const top = el.getBoundingClientRect().top;
				// 섹션의 top 이 refLine 보다 위 (top < refLine) 면 그 섹션이 진입 또는 통과 중.
				// ids 순서를 따라가면서 가장 최근에 통과한 섹션을 active 로 잡음.
				if (top < refLine) {
					currentId = id;
				} else {
					break;
				}
			}
			setActiveId(currentId);
		};

		// rAF 로 throttle — scroll 이벤트 빈도 ↓
		let raf = 0;
		const onScroll = () => {
			if (raf) return;
			raf = window.requestAnimationFrame(() => {
				raf = 0;
				handleScroll();
			});
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		handleScroll();
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			if (raf) window.cancelAnimationFrame(raf);
		};
	}, [sections]);

	const handleClick = (e, id) => {
		e.preventDefault();
		const target = document.getElementById(id);
		if (target) {
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};

	return (
		<aside
			className="sticky top-32"
			aria-label="섹션 네비"
		>
			<nav className="flex flex-col gap-3">
				{sections.map((s, idx) => {
					const active = s.id === activeId;
					return (
						<a
							key={s.id}
							href={`#${s.id}`}
							onClick={(e) => handleClick(e, s.id)}
							className="bold-interactive flex items-center gap-3 group"
							style={{
								fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
								fontSize: '0.7rem',
								letterSpacing: '0.14em',
								color: active ? 'var(--paper)' : 'var(--paper-faint)',
								textTransform: 'uppercase',
								transition: 'color 0.3s',
							}}
						>
							<span
								style={{
									display: 'inline-block',
									width: active ? '28px' : '14px',
									height: '1px',
									background: active ? 'var(--paper)' : 'var(--line-strong)',
									transition: 'width 0.3s, background 0.3s',
								}}
								aria-hidden="true"
							/>
							<span>
								{String(idx + 1).padStart(2, '0')} {s.label}
							</span>
						</a>
					);
				})}
			</nav>
		</aside>
	);
}
