import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';

// 단어 단위 stagger reveal.
// children 은 단어/구절 배열로 전달. <br/> 가 필요한 위치에는 { br: true } 항목 사용.
//   ex: <WordReveal items={[{ text: '이석호' }, { br: true }, { text: '포트폴리오' }, { text: '2026.', accent: true }]} />
// reduced-motion 시 framer-motion 분기 없이 평범한 span 으로 즉시 렌더.
//
// 과거 slide-up (y:105%→0 + overflow-hidden) 방식은 italic 한글의 우상단 slant +
// 받침 descender 가 박스 밖으로 잘리는 cutoff 가 SPA 전환 / 폰트 metric 정착 직전
// 측정 등의 시점에서 영구히 남는 문제가 있었다 (#143). overflow-hidden 자체를
// 제거하고 opacity + 작은 y 페이드인으로 변경 — 어떤 박스도 글리프를 clip 하지
// 않으므로 italic 잘림 0.
export default function WordReveal({
	items = [],
	className = '',
	style,
	delayBase = 0,
}) {
	const reduced = useReducedMotion();

	return (
		<div className={`bold-word-reveal ${className}`} style={style}>
			{items.map((item, idx) => {
				if (item.br) return <br key={`br-${idx}`} />;
				const innerStyle = item.accent
					? {
							color: 'var(--indigo-soft)',
							fontStyle: 'italic',
							// 옆 단어와 시각 간격 — italic 의 우측 slant 가 옆으로 침범하지 않게.
							paddingRight: '0.1em',
						}
					: undefined;
				// 다음 단어와 공백 분리. 단 noSep 가 true 면 공백 없이 직접 붙임
				// (예: '이석호' + '입니다' 처럼 한국어 토씨와 함께 가는 경우).
				const sep =
					idx < items.length - 1 && !items[idx + 1]?.br && !item.noSep
						? ' '
						: '';

				if (reduced) {
					return (
						<span key={idx} style={innerStyle}>
							{item.text}
							{sep}
						</span>
					);
				}

				return (
					<motion.span
						key={idx}
						style={innerStyle}
						initial={{ opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.7,
							ease: [0.2, 0.7, 0.2, 1],
							delay: delayBase + idx * 0.07,
						}}
					>
						{item.text}
						{sep}
					</motion.span>
				);
			})}
		</div>
	);
}
