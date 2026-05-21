import CountUp from 'react-countup';
import useReducedMotion from '../../hooks/useReducedMotion';

// react-countup 래퍼. enableScrollSpy 로 viewport 진입 시 자동 시작.
// reduced-motion 시 즉시 end 값 표시.
export default function StatCounter({
	end,
	duration = 1.5,
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
