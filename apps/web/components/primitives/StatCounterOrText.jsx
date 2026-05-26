import StatCounter from './StatCounter';

// AboutCounters / BoldProjectDetailImpact 등 stat 카운터 노출처에서 공용 사용.
// value 안의 첫 숫자 토큰을 추출해 react-countup 으로 카운트업, 앞·뒤 비-숫자는
// prefix/suffix 로 분리해서 admin 입력 형식 그대로 보존.
//   '75%'         → 0→75 + suffix '%'
//   '10x'         → 0→10 + suffix 'x'
//   '99.98'       → 0.00→99.98
//   '8+ Years'    → 0→8 + suffix '+ Years'
//   '1108ms saved'→ 0→1108 + suffix 'ms saved'
//   'v1.2'        → prefix 'v' + 1.2
//   '-86%'        → 0→-86 + suffix '%'
//   'N/A'         → plain text (숫자 없음 → 폴백)
export default function StatCounterOrText({ value }) {
	const str = String(value ?? '');
	const match = str.match(/^(.*?)(-?\d+(?:\.\d+)?)(.*)$/);
	if (!match) return <span>{str}</span>;
	const [, prefix, numStr, suffix] = match;
	const numeric = parseFloat(numStr);
	const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
	return (
		<StatCounter
			end={numeric}
			decimals={decimals}
			prefix={prefix}
			suffix={suffix}
		/>
	);
}
