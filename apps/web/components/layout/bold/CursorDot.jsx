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
				// transform 은 transition 제외 — Safari 가 매 mousemove (60+ Hz) 마다
				// 120ms 보간 애니메이션 실행하다 누적 lag 발생. width/height/opacity 만
				// transition 적용 (변화 빈도 낮음).
				transition: 'width 0.25s, height 0.25s, opacity 0.25s',
				opacity: 0,
				willChange: 'transform',
			}}
		/>
	);
}
