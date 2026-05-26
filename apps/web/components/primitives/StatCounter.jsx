import CountUp from 'react-countup';
import useReducedMotion from '../../hooks/useReducedMotion';

// react-countup 래퍼. enableScrollSpy 로 viewport 진입 시 자동 시작.
// reduced-motion 시 즉시 end 값 표시.
export default function StatCounter({
	end,
	// react-countup 기본 easing 이 ease-out (초반 빠르게 시작 → 종반 천천히 종료).
	// duration 1.5s 는 종반 감속 구간이 짧아 거의 안 느껴져서 2.5s 로 키움.
	duration = 2.5,
	decimals = 0,
	prefix = '',
	suffix = '',
	accentSuffix = null,
}) {
	const reduced = useReducedMotion();

	const formatted = reduced ? (
		<>
			{prefix}
			{Number(end).toFixed(decimals)}
			{suffix}
		</>
	) : (
		<CountUp
			end={Number(end)}
			duration={duration}
			decimals={decimals}
			prefix={prefix}
			suffix={suffix}
			enableScrollSpy
			scrollSpyOnce
		/>
	);

	return (
		<>
			{formatted}
			{accentSuffix && (
				<span style={{ color: 'var(--indigo-soft)' }}>{accentSuffix}</span>
			)}
		</>
	);
}
