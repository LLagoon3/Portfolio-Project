import Reveal from '../../primitives/Reveal';
import Chip from '../../primitives/Chip';

const SORT_OPTIONS = [
	{ key: 'newest', label: '최신순' },
	{ key: 'oldest', label: '오래된순' },
	{ key: 'az', label: 'A → Z' },
	{ key: 'cat', label: '카테고리' },
];

export default function BoldProjectsControls({
	categories,
	activeCategory,
	onCategoryChange,
	search,
	onSearchChange,
	sort,
	onSortChange,
	view,
	onViewChange,
}) {
	return (
		<Reveal>
			<div
				className="py-8 lg:py-10 border-t flex flex-col gap-5"
				style={{ borderColor: 'var(--line)' }}
			>
				{/* category chips */}
				<div className="flex flex-wrap items-center gap-2">
					{categories.map((c) => (
						<Chip
							key={c.key}
							label={c.label}
							count={c.count}
							active={c.key === activeCategory}
							onClick={() => onCategoryChange(c.key)}
						/>
					))}
				</div>

				{/* search + sort + view toggle */}
				<div className="flex flex-col sm:flex-row sm:items-center gap-3">
					<input
						type="search"
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder="제목·카테고리 검색"
						aria-label="프로젝트 검색"
						className="flex-1 min-w-0"
						style={{
							background: 'transparent',
							border: '1px solid var(--line-strong)',
							borderRadius: '12px',
							color: 'var(--paper)',
							padding: '0.65rem 1rem',
							fontSize: '14px',
							fontFamily: 'inherit',
						}}
					/>
					<select
						value={sort}
						onChange={(e) => onSortChange(e.target.value)}
						aria-label="정렬"
						className="bold-interactive"
						style={{
							background: 'transparent',
							border: '1px solid var(--line-strong)',
							borderRadius: '12px',
							color: 'var(--paper)',
							padding: '0.65rem 1rem',
							fontSize: '14px',
							fontFamily: 'inherit',
							cursor: 'pointer',
						}}
					>
						{SORT_OPTIONS.map((o) => (
							<option key={o.key} value={o.key} style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
								{o.label}
							</option>
						))}
					</select>
					<div className="flex items-center gap-1" role="tablist" aria-label="보기 전환">
						<ViewToggle current={view} value="grid" onClick={onViewChange} aria-label="Grid view">
							<svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
								<rect x="3" y="3" width="7" height="7" />
								<rect x="14" y="3" width="7" height="7" />
								<rect x="3" y="14" width="7" height="7" />
								<rect x="14" y="14" width="7" height="7" />
							</svg>
						</ViewToggle>
						<ViewToggle current={view} value="list" onClick={onViewChange} aria-label="List view">
							<svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
								<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
							</svg>
						</ViewToggle>
					</div>
				</div>
			</div>
		</Reveal>
	);
}

function ViewToggle({ current, value, onClick, children, ...rest }) {
	const active = current === value;
	return (
		<button
			type="button"
			role="tab"
			aria-selected={active}
			onClick={() => onClick(value)}
			className="bold-interactive inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
			style={{
				background: active ? 'var(--paper)' : 'transparent',
				color: active ? 'var(--ink)' : 'var(--paper)',
				border: `1px solid ${active ? 'var(--paper)' : 'var(--line-strong)'}`,
			}}
			{...rest}
		>
			{children}
		</button>
	);
}
