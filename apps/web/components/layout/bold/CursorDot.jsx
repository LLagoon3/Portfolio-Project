import useCursorDot from '../../../hooks/useCursorDot';

// 우선순위 z-[70]. mix-blend-mode: difference 로 텍스트 위에서도 대비.
// touch / coarse pointer / reduced-motion 환경에서는 useCursorDot 가 조기 return,
// 결과적으로 mousemove 가 안 잡혀서 opacity 0 으로 유지.
export default function CursorDot() {
	const ref = useCursorDot();
	return (
		<div
			ref={ref}
			aria-hidden="true"
			className="fixed left-0 top-0 w-2 h-2 rounded-full pointer-events-none z-[70]"
			style={{
				background: 'var(--indigo-soft)',
				mixBlendMode: 'difference',
				transform: 'translate(-50%, -50%)',
				transition: 'transform 0.12s ease-out, width 0.25s, height 0.25s, opacity 0.25s',
				opacity: 0,
			}}
		/>
	);
}
