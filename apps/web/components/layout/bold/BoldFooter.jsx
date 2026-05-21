// Bold 페이지 공통 푸터. 한 줄 좌우 분할.
export default function BoldFooter() {
	const year = new Date().getFullYear();
	return (
		<footer
			className="py-10 border-t mt-0"
			style={{ borderColor: 'var(--line)' }}
		>
			<div
				className="flex items-center justify-between text-xs gap-4"
				style={{
					fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
					color: 'var(--paper-faint)',
				}}
			>
				<span>© {year} SEOKHO LEE — LAGOON PORTFOLIO</span>
				<span>BUILT IN SEOUL ✦</span>
			</div>
		</footer>
	);
}
