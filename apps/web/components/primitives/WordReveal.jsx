import { useState } from 'react';
import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';

// 단어 단위 stagger reveal.
// children 은 단어/구절 배열로 전달. <br/> 가 필요한 위치에는 { br: true } 항목 사용.
//   ex: <WordReveal items={[{ text: '이석호' }, { br: true }, { text: '포트폴리오' }, { text: '2026.', accent: true }]} />
// reduced-motion 시 framer-motion 분기 없이 평범한 span 으로 즉시 렌더.
//
// slide-up reveal 동안 overflow-hidden 으로 y:105% 위치 글리프를 가린다. italic
// accent 의 우상단 slant + 받침 descender 가 박스 밖으로 잘리는 cutoff 문제 (#143)
// 는 모든 stagger 애니메이션 종료 후 overflow-hidden 을 풀어 해소 — 마지막 motion
// span 의 onAnimationComplete 콜백으로 트리거 (setTimeout 추정보다 정확).
export default function WordReveal({
	items = [],
	className = '',
	style,
	delayBase = 0,
}) {
	const reduced = useReducedMotion();
	const [revealed, setRevealed] = useState(false);

	// 마지막 'text' 아이템의 인덱스 (br 제외) — 이 아이템의 애니메이션 완료 시점이
	// 전체 reveal 종료 시점.
	const lastTextIdx = (() => {
		for (let i = items.length - 1; i >= 0; i -= 1) {
			if (!items[i]?.br) return i;
		}
		return -1;
	})();

	return (
		<div className={`bold-word-reveal ${className}`} style={style}>
			{items.map((item, idx) => {
				if (item.br) return <br key={`br-${idx}`} />;
				// italic accent: Safari 는 inline-block 너비를 italic glyph 의 우측 overhang
				// 제외하고 측정 (Chrome 과 다름). outer 에만 paddingRight 0.35em 로
				// overflow:hidden padding-box 안에 italic 우측 들어오게 보호.
				const next = items[idx + 1];
				const accentInnerStyle = item.accent
					? {
							color: 'var(--indigo-soft)',
							fontStyle: 'italic',
							paddingRight: '0.35em',
							textRendering: 'optimizeLegibility',
						}
					: undefined;
				// 다음 단어와 공백 분리. accent 의 paddingRight 가 이미 우측 간격을
				// 만들므로, 다음 단어도 accent 면 sep 를 빼서 padding + sep 누적 회피.
				// noSep (한국어 토씨 붙임) 와 다음 br 인 경우도 sep 미부착.
				const sep =
					idx < items.length - 1 &&
					!next?.br &&
					!item.noSep &&
					!(item.accent && next?.accent)
						? ' '
						: '';

				if (reduced) {
					return (
						<span
							key={idx}
							className="inline-block align-bottom pb-[0.04em]"
							style={accentInnerStyle}
						>
							{item.text}
							{sep}
						</span>
					);
				}

				const isLast = idx === lastTextIdx;
				return (
					<span
						key={idx}
						className={`inline-block align-bottom pb-[0.04em] ${revealed ? '' : 'overflow-hidden'}`}
						style={accentInnerStyle}
					>
						{/* hero 영역 전용이라 viewport 감지(whileInView) 대신 mount 즉시 animate.
						    Safari italic clipping 회피 — inner motion.span 의 inline-block
						    측정도 italic overhang 포함하지 않으므로 동일 padding 을 inner 에
						    도 적용 (outer 와 중첩되어도 텍스트 위치는 그대로). */}
						<motion.span
							className="inline-block"
							initial={{ y: '105%' }}
							animate={{ y: 0 }}
							transition={{
								duration: 0.9,
								ease: [0.2, 0.7, 0.2, 1],
								delay: delayBase + idx * 0.07,
							}}
							onAnimationComplete={isLast ? () => setRevealed(true) : undefined}
						>
							{item.text}
						</motion.span>
						{sep}
					</span>
				);
			})}
		</div>
	);
}
