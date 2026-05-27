import { useEffect } from 'react';

// 우상단 inline 토스트. visible 가 true 일 때 잠시 노출 후 onClose 콜백으로 자동 dismiss.
// reduced-motion 영향 — transition 짧게라 글로벌 룰이 자동 비활성.
export default function Toast({ visible, message, onClose, duration = 2000 }) {
	useEffect(() => {
		if (!visible) return undefined;
		const t = setTimeout(() => onClose?.(), duration);
		return () => clearTimeout(t);
	}, [visible, duration, onClose]);

	return (
		<div
			role="status"
			aria-live="polite"
			className="fixed z-[80] left-1/2 -translate-x-1/2 bottom-8 px-4 py-2.5 rounded-2xl text-sm pointer-events-none text-center"
			style={{
				background: 'var(--paper)',
				color: 'var(--ink)',
				fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
				boxShadow: '0 8px 30px -10px rgba(0,0,0,0.3)',
				whiteSpace: 'pre-line',
				opacity: visible ? 1 : 0,
				transform: visible
					? 'translate(-50%, 0)'
					: 'translate(-50%, 12px)',
				transition: 'opacity 0.2s ease, transform 0.2s ease',
			}}
		>
			{message}
		</div>
	);
}
