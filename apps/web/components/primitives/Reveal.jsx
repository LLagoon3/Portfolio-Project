import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';

// 진입 시 opacity 0→1, translateY 24→0. once: true 로 한 번만 재생.
// framer-motion 의 whileInView 는 JS 모션이라 globals.css 의
// @media (prefers-reduced-motion: reduce) 영향을 받지 않으므로
// 여기서 직접 분기하여 plain 태그로 즉시 렌더한다.
// amount: viewport 진입 trigger 비율 (0~1). 기본 0.6 — 섹션이 거의 다 보일 때
// trigger 되어 사용자가 시각적으로 인지하는 시점에 애니메이션 시작.
// 페이지 끝의 영역이라 0.6 이 채워지기 어렵다면 호출 측에서 낮춰 즉시 trigger.
export default function Reveal({
	as: Tag = 'div',
	delay = 0,
	amount = 0.6,
	className = '',
	children,
	...rest
}) {
	const reduced = useReducedMotion();
	if (reduced) {
		const Plain = Tag;
		return (
			<Plain className={className} {...rest}>
				{children}
			</Plain>
		);
	}
	const MotionTag = motion[Tag] || motion.div;
	return (
		<MotionTag
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount }}
			transition={{ duration: 1.8, ease: [0.2, 0.7, 0.2, 1], delay }}
			className={className}
			{...rest}
		>
			{children}
		</MotionTag>
	);
}
