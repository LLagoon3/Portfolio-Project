import { useEffect, useState } from 'react';

// lg+ 좌측 sticky 섹션 네비. IntersectionObserver 로 active 추적, 모바일은 hide.
export default function BoldProjectDetailSideNav({ sections = [] }) {
	const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

	useEffect(() => {
		const ids = sections.map((s) => s.id).filter(Boolean);
		const els = ids
			.map((id) => document.getElementById(id))
			.filter(Boolean);
		if (els.length === 0) return undefined;

		const observer = new IntersectionObserver(
			(entries) => {
				// 화면 중앙 근처에 가장 가까운 entry 를 active 로 잡음.
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
				if (visible[0]) {
					setActiveId(visible[0].target.id);
				}
			},
			{
				rootMargin: '-30% 0px -50% 0px',
				threshold: [0, 0.25, 0.5, 0.75, 1],
			},
		);
		els.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
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
			className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-30"
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
