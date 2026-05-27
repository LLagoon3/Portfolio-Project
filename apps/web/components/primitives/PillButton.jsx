import Link from 'next/link';

// 둥근 풀-필 CTA. variant: 'cta' (indigo solid) | 'ghost' (border + transparent).
// as: 'a' (기본 — 외부/anchor) | 'link' (Next.js 내부 라우팅) | 'button'.
export default function PillButton({
	variant = 'cta',
	as = 'a',
	href,
	onClick,
	type,
	target,
	rel,
	className = '',
	ariaLabel,
	children,
}) {
	const isCTA = variant === 'cta';
	const ctaStyle = {
		background: 'var(--indigo)',
		color: 'white',
	};
	const ghostStyle = {
		border: '1px solid var(--line-strong)',
		color: 'var(--paper)',
		background: 'rgba(255, 255, 255, 0.02)',
	};
	// 'bold-pill' 클래스로 hover 시 자식 svg 가 살짝 미세 이동 (globals.css 에서 정의).
	const baseClass = `bold-interactive bold-pill inline-flex items-center gap-2 font-general-medium text-[15px] rounded-full transition-all duration-300 ${
		isCTA
			? 'px-[1.4rem] py-[0.85rem] hover:-translate-y-[2px]'
			: 'px-[1.3rem] py-[0.8rem]'
	} ${className}`;
	const style = isCTA ? ctaStyle : ghostStyle;

	const sharedProps = {
		className: baseClass,
		style,
		onClick,
		'aria-label': ariaLabel,
	};

	if (as === 'button') {
		return (
			<button type={type || 'button'} {...sharedProps}>
				{children}
			</button>
		);
	}
	if (as === 'link') {
		return (
			<Link href={href} {...sharedProps}>
				{children}
			</Link>
		);
	}
	return (
		<a href={href} target={target} rel={rel} {...sharedProps}>
			{children}
		</a>
	);
}
