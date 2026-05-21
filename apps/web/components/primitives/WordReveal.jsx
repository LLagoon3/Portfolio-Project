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
				const innerStyle = item.accent
					? { color: 'var(--indigo-soft)', fontStyle: 'italic' }
					: undefined;
				const sep = idx < items.length - 1 && !items[idx + 1]?.br ? ' ' : '';

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
						<motion.span
							className="inline-block"
							initial={{ y: '105%' }}
							whileInView={{ y: 0 }}
							viewport={{ once: true, amount: 0.4 }}
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
