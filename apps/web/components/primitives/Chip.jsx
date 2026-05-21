// 칩 필터 (active + count 지원). min-h-[40px] 로 터치 타깃 보장.
export default function Chip({
	label,
	count,
	active = false,
	onClick,
	className = '',
}) {
	const baseColor = active ? 'var(--ink)' : 'var(--paper)';
	const bgColor = active ? 'var(--paper)' : 'transparent';
	const borderColor = active ? 'var(--paper)' : 'var(--line-strong)';

	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			className={`bold-interactive inline-flex items-center gap-[0.4rem] font-general-medium text-[13px] px-[1.1rem] py-[0.7rem] rounded-full min-h-[40px] transition-all duration-300 ${className}`}
			style={{
				background: bgColor,
				color: baseColor,
				border: `1px solid ${borderColor}`,
			}}
		>
			<span>{label}</span>
			{typeof count === 'number' && (
				<span
					className="text-[10px]"
					style={{
						fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
						color: active
							? 'color-mix(in oklab, var(--ink) 55%, transparent)'
							: 'color-mix(in oklab, var(--paper) 55%, transparent)',
					}}
				>
					{String(count).padStart(2, '0')}
				</span>
			)}
		</button>
	);
}
