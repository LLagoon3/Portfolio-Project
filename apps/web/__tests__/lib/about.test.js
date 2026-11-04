import { DEFAULT_NAME, DEFAULT_TAGLINE, formatStatLabel, normalizeAbout } from '../../lib/about';

describe('formatStatLabel', () => {
	it.each([
		['SELECTED PROJECTS', 'Selected projects'],
		['API Performance', 'API performance'],
		['Open Source Contributions', 'Open source contributions'],
		['QUERY CUT', 'Query cut'],
		['OpenClaw Contributions', 'OpenClaw contributions'],
		['Node.js Services', 'Node.js services'],
	])('%s → %s (대소문자만 문장형)', (label, expected) => {
		expect(formatStatLabel(label)).toBe(expected);
	});

	it.each([
		'Uptime with Grafana', // 소문자로 시작하는 단어가 있으면 의도한 표기로 보고 유지
		'API', // 한 단어 대문자 약어
		'MAU',
		'주요 프로젝트',
		'API 응답 시간',
		'iOS Apps',
		'',
	])('%p 는 그대로 둠', (label) => {
		expect(formatStatLabel(label)).toBe(label);
	});

	it('문자열이 아닌 값도 문자열로 다룸', () => {
		expect(formatStatLabel(undefined)).toBe('');
		expect(formatStatLabel(7)).toBe('7');
	});
});

describe('normalizeAbout', () => {
	it('API 값과 배열 순서를 바꾸지 않음', () => {
		const about = {
			name: '이석호',
			tagline: 'Backend Developer',
			profileImage: '/uploads/p.jpg',
			availability: null,
			bio: ['# 제목\n\n첫 단락', '둘째'],
			stats: [{ label: 'B', value: '2' }, { label: 'A', value: 1 }],
			principles: [{ title: 'Z', body: 'z' }, { title: 'A', body: 'a' }],
			journey: [{ year: '2024', title: 'old' }, { year: '2026', title: 'new' }],
			stacks: [{ title: 'Backend', techs: ['NestJS', 'Express'] }],
			email: 'unused@example.com',
		};
		expect(normalizeAbout(about)).toEqual({
			name: '이석호',
			tagline: 'Backend Developer',
			profileImage: '/uploads/p.jpg',
			availability: null,
			bio: about.bio,
			stats: about.stats,
			principles: about.principles,
			journey: about.journey,
			stacks: about.stacks,
		});
	});

	it('null / 누락 / 잘못된 모양은 기존 기본값과 빈 목록으로', () => {
		expect(normalizeAbout(null)).toEqual({
			name: DEFAULT_NAME,
			tagline: DEFAULT_TAGLINE,
			profileImage: null,
			availability: null,
			bio: [],
			stats: [],
			principles: [],
			journey: [],
			stacks: [],
		});
		const result = normalizeAbout({
			name: '  ',
			tagline: '',
			profileImage: '',
			availability: '  ',
			bio: ['', '  ', null, '내용'],
			stats: null,
			principles: [null, { title: 'A' }],
			journey: 'x',
			stacks: [{ title: '빈 그룹', techs: [] }, { title: '누락' }, null, { title: 'Ops', techs: ['Docker'] }],
		});
		expect(result.name).toBe(DEFAULT_NAME);
		expect(result.tagline).toBe(DEFAULT_TAGLINE);
		expect(result.profileImage).toBeNull();
		expect(result.availability).toBeNull();
		expect(result.bio).toEqual(['내용']);
		expect(result.stats).toEqual([]);
		expect(result.principles).toEqual([{ title: 'A' }]);
		expect(result.journey).toEqual([]);
		expect(result.stacks).toEqual([{ title: 'Ops', techs: ['Docker'] }]);
	});
});
