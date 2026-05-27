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
				// 제외하고 측정 (Chrome 과 다름). paddingRight 0.5em 로 우측 보강.
				// 단, accent 가 연속되면 누적 + sep 공백 합쳐 단어 간격이 너무 커지므로,
				// '연속 accent run 의 마지막' 에만 paddingRight 적용. 중간 accent 는
				// padding 없이 sep 공백만으로 정상 단어 간격 유지.
				const next = items[idx + 1];
				const isLastOfAccentRun =
					item.accent && (!next || next.br || !next.accent);
				const accentInnerStyle = item.accent
					? {
							color: 'var(--indigo-soft)',
							fontStyle: 'italic',
							paddingRight: isLastOfAccentRun ? '0.5em' : '0',
							textRendering: 'optimizeLegibility',
						}
					: undefined;
				// 다음 단어와 공백 분리. noSep 가 true 면 공백 없이 직접 붙임
				// (예: '이석호' + '입니다' 처럼 한국어 토씨와 함께 가는 경우).
				const sep =
					idx < items.length - 1 && !items[idx + 1]?.br && !item.noSep
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
							style={
								item.accent
									? { paddingRight: isLastOfAccentRun ? '0.5em' : '0' }
									: undefined
							}
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
