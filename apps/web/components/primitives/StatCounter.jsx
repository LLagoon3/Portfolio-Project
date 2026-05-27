import CountUp from 'react-countup';
import useReducedMotion from '../../hooks/useReducedMotion';

// 숫자 값 + 단위 카운트업. react-countup 래퍼 + value 안의 첫 숫자 토큰 추출.
// reduced-motion 시 즉시 end 값 표시.
//
//   '75%'         → 0→75 + suffix '%'
//   '10x'         → 0→10 + suffix 'x'
//   '99.98'       → 0.00→99.98
//   '8+ Years'    → 0→8 + suffix '+ Years'
//   '1108ms saved'→ 0→1108 + suffix 'ms saved'
//   'v1.2'        → prefix 'v' + 1.2
//   '-86%'        → 0→-86 + suffix '%'
//   'N/A'         → plain text (숫자 없음 → 폴백)
//   6 (number)    → 0→6
export default function StatCounter({
	value,
	// react-countup 기본 easing 이 ease-out (초반 빠르게 시작 → 종반 천천히 종료).
	// duration 1.5s 는 종반 감속 구간이 짧아 거의 안 느껴져서 2.5s 로 키움.
	duration = 2.5,
	accentSuffix = null,
}) {
	const reduced = useReducedMotion();

	const str = String(value ?? '');
	const match = str.match(/^(.*?)(-?\d+(?:\.\d+)?)(.*)$/);
	if (!match) {
		return (
			<>
				<span>{str}</span>
				{accentSuffix && (
					<span style={{ color: 'var(--indigo-soft)' }}>{accentSuffix}</span>
				)}
			</>
		);
	}

	const [, prefix, numStr, suffix] = match;
	const end = parseFloat(numStr);
	const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;

	const formatted = reduced ? (
		<>
			{prefix}
			{end.toFixed(decimals)}
			{suffix}
		</>
	) : (
		<CountUp
			end={end}
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
