import StatCounter from './StatCounter';

// AboutCounters / BoldProjectDetailImpact 등 stat 카운터 노출처에서 공용 사용.
// value 가 순수 숫자 / 소수 ('333' / '99.98') 면 react-countup 으로 카운트업.
// 단위·기호가 섞이면 ('333ms' / '8+ Years' / '1108ms saved' 등) admin 이 입력한
// 형식을 그대로 보존해서 plain 으로 노출. 카운트업 + 단위 조합은 admin 의 의도
// 형식을 깰 수 있고 (예: '333ms saved' 면 saved 까지 suffix 로 들어가 어색),
// 단위 분리·합성 휴리스틱은 케이스마다 비결정적이라 보수적으로 처리.
export default function StatCounterOrText({ value }) {
	const str = String(value ?? '');
	if (/^-?\d+(?:\.\d+)?$/.test(str)) {
		const numeric = parseFloat(str);
		const decimals = str.includes('.') ? str.split('.')[1].length : 0;
		return <StatCounter end={numeric} decimals={decimals} />;
	}
	return <span>{str}</span>;
}
