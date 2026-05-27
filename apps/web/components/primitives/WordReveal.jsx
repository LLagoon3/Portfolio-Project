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
				// 제외하고 측정해 (Chrome 과 다름) padding-right 가 클수록 안전. 0.5em 으로
				// 우상단 slant + 받침 ㄹ 우측까지 커버.
				const innerStyle = item.accent
					? {
							color: 'var(--indigo-soft)',
							fontStyle: 'italic',
							paddingRight: '0.5em',
							paddingBottom: '0.18em',
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
						<span
							key={idx}
							className="inline-block align-bottom pb-[0.04em]"
							style={innerStyle}
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
						style={innerStyle}
					>
						{/* hero 영역 전용이라 viewport 감지(whileInView) 대신 mount 즉시 animate. */}
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
