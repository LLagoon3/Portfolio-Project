import { motion } from 'framer-motion';

// 단어 단위 stagger reveal.
// children 은 단어/구절 배열로 전달. <br/> 가 필요한 위치에는 { br: true } 항목 사용.
//   ex: <WordReveal items={[{ text: '이석호' }, { br: true }, { text: '포트폴리오' }, { text: '2026.', accent: true }]} />
export default function WordReveal({
	items = [],
	className = '',
	style,
	delayBase = 0,
}) {
	return (
		<div className={`bold-word-reveal ${className}`} style={style}>
			{items.map((item, idx) => {
				if (item.br) return <br key={`br-${idx}`} />;
				return (
					<span
						key={idx}
						className="inline-block overflow-hidden align-bottom pb-[0.04em]"
						style={item.accent ? { color: 'var(--indigo-soft)', fontStyle: 'italic' } : undefined}
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
						{/* 단어 사이 여백 (마지막은 제외) */}
						{idx < items.length - 1 && !items[idx + 1]?.br ? ' ' : ''}
					</span>
				);
			})}
		</div>
	);
}
