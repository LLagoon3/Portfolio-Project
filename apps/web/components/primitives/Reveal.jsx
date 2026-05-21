import { motion } from 'framer-motion';

// 진입 시 opacity 0→1, translateY 24→0. once: true 로 한 번만 재생.
// reduced-motion 글로벌 룰에 의해 시각적 점프가 일어나도 OK (정상 동작).
export default function Reveal({
	as: Tag = 'div',
	delay = 0,
	className = '',
	children,
	...rest
}) {
	const MotionTag = motion[Tag] || motion.div;
	return (
		<MotionTag
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.15 }}
			transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay }}
			className={className}
			{...rest}
		>
			{children}
		</MotionTag>
	);
}
