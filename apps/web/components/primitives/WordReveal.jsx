import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';

// 단어 단위 stagger reveal.
// children 은 단어/구절 배열로 전달. <br/> 가 필요한 위치에는 { br: true } 항목 사용.
//   ex: <WordReveal items={[{ text: '이석호' }, { br: true }, { text: '포트폴리오' }, { text: '2026.', accent: true }]} />
// reduced-motion 시 framer-motion 분기 없이 평범한 span 으로 즉시 렌더.
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
				// italic accent 단어의 마지막 글자가 inline-block + overflow-hidden 박스 밖으로
				// 살짝 비져나가 잘리는 현상이 있어 paddingRight 로 박스 너비 보강.
				const innerStyle = item.accent
					? {
							color: 'var(--indigo-soft)',
							fontStyle: 'italic',
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

				return (
					<span
						key={idx}
						className="inline-block overflow-hidden align-bottom pb-[0.04em]"
						style={innerStyle}
					>
						{/* hero 영역 전용이라 viewport 감지(whileInView) 대신 mount 즉시 animate.
						    router 전환 시 부모 motion.div (fade) 가 opacity 0 → 1 로 가는 동안
						    IntersectionObserver 가 visible 판단 실패 + once: true 로 평생
						    trigger 안 되던 버그 회피. */}
						<motion.span
							className="inline-block"
							initial={{ y: '105%' }}
							animate={{ y: 0 }}
							transition={{
								duration: 0.9,
								ease: [0.2, 0.7, 0.2, 1],
								delay: delayBase + idx * 0.07,
							}}
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
