import {
	TOPICS,
	buildContactPayload,
	describeSubmitFailure,
	extractErrorMessage,
	normalizeContact,
	socialLink,
	validateField,
	validateForm,
} from '../../lib/contact';

describe('normalizeContact', () => {
	it('있는 값은 그대로(앞뒤 공백만 정리), 순서와 FAQ Markdown 은 손대지 않음', () => {
		const answer = '## 제목\n\n- 첫째\n- [링크](https://example.com)\n';
		expect(
			normalizeContact({
				email: ' me@example.com ',
				address: '충청북도 청주시 흥덕구, 2순환로 1228',
				availability: '  신입 포지션을 찾고 있습니다 ',
				socials: [
					{ label: 'GitHub', url: 'https://github.com/LLagoon3' },
					{ label: 'Blog', url: 'https://blog.example.com' },
				],
				faqs: [
					{ question: '두 번째로 등록한 질문', answer },
					{ question: '첫 번째 질문', answer: '답변' },
				],
				phone: '010-0000-0000',
			}),
		).toEqual({
			email: 'me@example.com',
			address: '충청북도 청주시 흥덕구, 2순환로 1228',
			availability: '신입 포지션을 찾고 있습니다',
			socials: [
				{ label: 'GitHub', url: 'https://github.com/LLagoon3' },
				{ label: 'Blog', url: 'https://blog.example.com' },
			],
			faqs: [
				{ question: '두 번째로 등록한 질문', answer },
				{ question: '첫 번째 질문', answer: '답변' },
			],
		});
	});

	it('null / 누락 / 빈 문자열 / 잘못된 모양은 대체 문구 없이 비움', () => {
		const empty = { email: null, address: null, availability: null, socials: [], faqs: [] };
		expect(normalizeContact(undefined)).toEqual(empty);
		expect(normalizeContact(null)).toEqual(empty);
		expect(normalizeContact({ email: '   ', address: '', availability: 3, socials: null, faqs: 'x' })).toEqual(empty);
		expect(
			normalizeContact({
				socials: [null, 'x', { label: ' ', url: '' }, { url: 'https://only-url.example' }],
				faqs: [null, { question: ' ', answer: '  ' }, { answer: '답만 있음' }, { question: '질문만' }],
			}),
		).toEqual({
			...empty,
			socials: [{ label: '', url: 'https://only-url.example' }],
			faqs: [
				{ question: '', answer: '답만 있음' },
				{ question: '질문만', answer: '' },
			],
		});
	});
});

describe('socialLink', () => {
	it('http(s) 는 새 탭, mailto 는 같은 탭, 그 밖의 주소는 링크로 만들지 않음', () => {
		expect(socialLink('https://github.com/LLagoon3')).toEqual({ href: 'https://github.com/LLagoon3', external: true });
		expect(socialLink('HTTP://example.com')).toEqual({ href: 'HTTP://example.com', external: true });
		expect(socialLink('mailto:me@example.com')).toEqual({ href: 'mailto:me@example.com', external: false });
		['javascript:alert(1)', ' javascript:alert(1)', 'data:text/html,x', 'github.com/LLagoon3', '//evil.example', '', null].forEach(
			(url) => expect(socialLink(url)).toBeNull(),
		);
	});
});

describe('폼 검증', () => {
	it('필수 값은 앞뒤 공백을 뺀 뒤 확인하고, 이메일 형식과 API 길이 제한(이름 100 / 이메일 255)을 지킴', () => {
		expect(validateField('name', '   ')).toBe('이름을 입력해 주세요');
		expect(validateField('name', ' 홍길동 ')).toBe('');
		expect(validateField('name', 'a'.repeat(100))).toBe('');
		expect(validateField('name', 'a'.repeat(101))).toBe('이름은 100자 이내로 입력해 주세요');
		expect(validateField('email', '')).toBe('이메일을 입력해 주세요');
		['plain', 'a@b', 'a b@c.d', '@c.d'].forEach((value) =>
			expect(validateField('email', value)).toBe('이메일 형식을 확인해 주세요'),
		);
		expect(validateField('email', ' hong@example.com ')).toBe('');
		expect(validateField('email', `${'a'.repeat(244)}@example.com`)).toBe('이메일은 255자 이내로 입력해 주세요');
		expect(validateField('message', '\n  \n')).toBe('메시지를 입력해 주세요');
		expect(validateField('company', '')).toBe('');

		expect(validateForm({ name: '', email: 'x', company: '', message: ' ' })).toEqual({
			name: '이름을 입력해 주세요',
			email: '이메일 형식을 확인해 주세요',
			message: '메시지를 입력해 주세요',
		});
		expect(validateForm({ name: 'a', email: 'a@b.co', company: '', message: 'm' })).toEqual({});
	});
});

describe('buildContactPayload', () => {
	it('기존 계약: 값은 trim, 소속이 있으면 "[소속] …" 단락을 메시지 앞에, topic 그대로', () => {
		expect(
			buildContactPayload(
				{ name: ' 홍길동 ', email: ' hong@example.com ', company: ' 라군 컴퍼니 ', message: '\n 안녕하세요\n반갑습니다 \n' },
				TOPICS[1],
			),
		).toEqual({
			name: '홍길동',
			email: 'hong@example.com',
			message: '[소속] 라군 컴퍼니\n\n안녕하세요\n반갑습니다',
			topic: '외주 · 협업',
		});
		expect(buildContactPayload({ name: 'a', email: 'a@b.co', company: '   ', message: 'm' }, TOPICS[0])).toEqual({
			name: 'a',
			email: 'a@b.co',
			message: 'm',
			topic: '신입 채용',
		});
		expect(TOPICS).toEqual(['신입 채용', '외주 · 협업', '기술 잡담', '기타']);
	});
});

describe('서버 오류 문구', () => {
	it('문자열 / 배열 / 중첩 error / 문자열 error 를 읽고, 못 읽으면 빈 문자열', () => {
		expect(extractErrorMessage({ message: ' 잘못된 요청 ' })).toBe('잘못된 요청');
		expect(extractErrorMessage({ message: ['email must be an email', '', 'name should not be empty'] })).toBe(
			'email must be an email, name should not be empty',
		);
		expect(extractErrorMessage({ success: false, error: { statusCode: 400, message: 'email must be an email' } })).toBe(
			'email must be an email',
		);
		expect(extractErrorMessage({ error: { message: ['a', 'b'] } })).toBe('a, b');
		expect(extractErrorMessage({ error: 'Bad Request' })).toBe('Bad Request');
		expect(extractErrorMessage('plain text')).toBe('plain text');
		[null, undefined, {}, { message: 3 }, { error: { message: null } }, []].forEach((body) =>
			expect(extractErrorMessage(body)).toBe(''),
		);
	});

	it('4xx 는 서버 문구를, 5xx / 읽을 수 없는 본문은 다시 시도 안내를', () => {
		expect(describeSubmitFailure(400, { error: { message: 'email must be an email' } })).toBe(
			'메시지를 보내지 못했습니다. email must be an email',
		);
		expect(describeSubmitFailure(400, null)).toBe('메시지를 보내지 못했습니다. 잠시 후 다시 시도해 주세요.');
		expect(describeSubmitFailure(500, { error: { message: 'QueryFailedError: secret detail' } })).toBe(
			'메시지를 보내지 못했습니다. 잠시 후 다시 시도해 주세요.',
		);
	});
});
