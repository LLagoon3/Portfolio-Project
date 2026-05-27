import {
	buildHeroMeta,
	parseYear,
	pickHeroAccentWord,
	pickOverview,
} from '../../lib/projects';

describe('parseYear', () => {
	it('YYYY.MM – YYYY.MM 형식의 첫 4자리를 연도로 추출', () => {
		expect(parseYear('2026.01 – 2026.03')).toBe('2026');
	});

	it('숫자 4자리로 시작하지 않으면 빈 문자열', () => {
		expect(parseYear('TBD')).toBe('');
		expect(parseYear('미정')).toBe('');
		expect(parseYear('20.01.01')).toBe('');
	});

	it('null / undefined / 빈 문자열은 빈 문자열', () => {
		expect(parseYear(null)).toBe('');
		expect(parseYear(undefined)).toBe('');
		expect(parseYear('')).toBe('');
	});
});

describe('pickHeroAccentWord', () => {
	it('heroAccentWord 가 있으면 그대로 반환 (trim)', () => {
		expect(
			pickHeroAccentWord({ heroAccentWord: '  시스템 ', title: '통합 로그 시스템' }),
		).toBe('시스템');
	});

	it('heroAccentWord 가 없으면 title 의 마지막 공백 토큰', () => {
		expect(pickHeroAccentWord({ title: '통합 로그 시스템' })).toBe('시스템');
		expect(pickHeroAccentWord({ title: '커스텀 웹 프레임워크' })).toBe(
			'프레임워크',
		);
	});

	it('heroAccentWord 가 공백-only 면 title 폴백', () => {
		expect(pickHeroAccentWord({ heroAccentWord: '   ', title: 'A B' })).toBe(
			'B',
		);
	});

	it('title 도 없으면 빈 문자열', () => {
		expect(pickHeroAccentWord({})).toBe('');
		expect(pickHeroAccentWord({ title: '' })).toBe('');
	});
});

describe('pickOverview', () => {
	it('빈 줄로 split 한 첫 단락만 반환', () => {
		const md = '첫 단락 입니다.\n\n둘째 단락은 노출되지 않음.';
		expect(pickOverview(md)).toBe('첫 단락 입니다.');
	});

	it('빈 줄 split 가 없으면 전체 반환 (trim)', () => {
		expect(pickOverview('  단일 단락  ')).toBe('단일 단락');
	});

	it('null / undefined / 빈 문자열은 빈 문자열', () => {
		expect(pickOverview(null)).toBe('');
		expect(pickOverview(undefined)).toBe('');
		expect(pickOverview('')).toBe('');
	});
});

describe('buildHeroMeta', () => {
	it('heroClient / heroRole / Timeline / Category 모두 있으면 4개 행', () => {
		const meta = buildHeroMeta({
			heroClient: 'ACME',
			heroRole: '백엔드',
			category: 'Web Application',
			ProjectHeader: { publishDate: '2026.01 – 2026.03' },
		});
		expect(meta).toEqual([
			{ label: 'Client', value: 'ACME' },
			{ label: 'Role', value: '백엔드' },
			{ label: 'Timeline', value: '2026.01 – 2026.03' },
			{ label: 'Category', value: 'Web Application' },
		]);
	});

	it('각 필드가 없으면 해당 행을 건너뜀 (순서 보존)', () => {
		expect(
			buildHeroMeta({
				heroRole: '백엔드',
				category: 'Backend',
			}),
		).toEqual([
			{ label: 'Role', value: '백엔드' },
			{ label: 'Category', value: 'Backend' },
		]);
	});

	it('모든 필드가 없으면 빈 배열', () => {
		expect(buildHeroMeta({})).toEqual([]);
	});
});
