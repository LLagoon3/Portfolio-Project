// /contact 화면 전용 순수 헬퍼. API 값 정리, 폼 검증, 전송 본문, 서버 오류 문구를 컴포넌트와 분리해 테스트한다.

// 기존 Bold 폼과 같은 네 가지 문의 종류. 첫 항목이 기본 선택이다.
export const TOPICS = ['신입 채용', '외주 · 협업', '기술 잡담', '기타'];

// 백엔드 CreateContactDto 의 길이 제한 (name 100 / email 255).
export const NAME_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 255;

export const EMPTY_FORM = {
	name: '',
	email: '',
	company: '',
	message: '',
};

const isObject = (value) => value !== null && typeof value === 'object';
const list = (value) => (Array.isArray(value) ? value : []);
const text = (value) => (typeof value === 'string' ? value.trim() : '');

// API 가 일부 필드를 null / 누락으로 내려도 화면이 깨지지 않게 모양만 맞춘다.
// 빈 값은 null / 빈 배열로 두어 화면에서 생략하고, 대체 문구(기본 이메일 / 지역 등)는 만들지 않는다.
// 순서와 문구(FAQ 답변 Markdown 포함)는 API 그대로 둔다.
export function normalizeContact(contact) {
	const source = isObject(contact) ? contact : {};
	return {
		email: text(source.email) || null,
		address: text(source.address) || null,
		availability: text(source.availability) || null,
		socials: list(source.socials)
			.filter(isObject)
			.map((social) => ({ label: text(social.label), url: text(social.url) }))
			.filter((social) => social.label || social.url),
		faqs: list(source.faqs)
			.filter(isObject)
			.map((faq) => ({
				question: text(faq.question),
				answer: typeof faq.answer === 'string' ? faq.answer : '',
			}))
			.filter((faq) => faq.question || faq.answer.trim()),
	};
}

const SAFE_LINK = /^(https?:\/\/|mailto:)/i;
const EXTERNAL_LINK = /^https?:\/\//i;

// 소셜 URL 은 어드민 자유 입력이다. http(s) / mailto 만 링크로 만들고, 그 밖의 주소(javascript: 등)는
// 링크 없이 이름만 보여 준다. http(s) 는 새 탭으로 연다.
export function socialLink(url) {
	const value = text(url);
	if (!SAFE_LINK.test(value)) return null;
	return { href: value, external: EXTERNAL_LINK.test(value) };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 필드별 오류 문구. 값은 앞뒤 공백을 뺀 뒤 검사한다 (전송 본문과 같은 기준).
export function validateField(name, value) {
	const trimmed = text(value);
	switch (name) {
		case 'name':
			if (!trimmed) return '이름을 입력해 주세요';
			if (trimmed.length > NAME_MAX_LENGTH) return `이름은 ${NAME_MAX_LENGTH}자 이내로 입력해 주세요`;
			return '';
		case 'email':
			if (!trimmed) return '이메일을 입력해 주세요';
			if (trimmed.length > EMAIL_MAX_LENGTH) return `이메일은 ${EMAIL_MAX_LENGTH}자 이내로 입력해 주세요`;
			if (!EMAIL_PATTERN.test(trimmed)) return '이메일 형식을 확인해 주세요';
			return '';
		case 'message':
			return trimmed ? '' : '메시지를 입력해 주세요';
		default:
			return '';
	}
}

export const REQUIRED_FIELDS = ['name', 'email', 'message'];

export function validateForm(form) {
	const errors = {};
	REQUIRED_FIELDS.forEach((name) => {
		const message = validateField(name, form[name]);
		if (message) errors[name] = message;
	});
	return errors;
}

// 기존 Bold 폼과 같은 전송 본문: 소속이 있으면 메시지 앞에 "[소속] ..." 한 단락을 붙인다.
export function buildContactPayload(form, topic) {
	const company = text(form.company);
	return {
		name: text(form.name),
		email: text(form.email),
		message: (company ? `[소속] ${company}\n\n` : '') + text(form.message),
		topic,
	};
}

const joinMessage = (value) => {
	if (typeof value === 'string') return value.trim();
	if (Array.isArray(value)) {
		return value
			.filter((item) => typeof item === 'string' && item.trim())
			.map((item) => item.trim())
			.join(', ');
	}
	return '';
};

// 실패 응답 본문에서 사람이 읽을 문구를 꺼낸다. 이 API 의 { error: { message } } 와
// Nest 기본 { message: string | string[] }, 문자열 error 를 모두 받는다. 못 찾으면 빈 문자열.
export function extractErrorMessage(body) {
	if (typeof body === 'string') return body.trim();
	if (!isObject(body)) return '';
	return (
		joinMessage(body.message) ||
		(isObject(body.error) ? joinMessage(body.error.message) : joinMessage(body.error)) ||
		''
	);
}

export const SUBMIT_FAILED = '메시지를 보내지 못했습니다.';
export const RETRY_LATER = '잠시 후 다시 시도해 주세요.';
export const NETWORK_FAILED = '네트워크 연결을 확인한 뒤 다시 시도해 주세요.';

// 실패 응답 → 화면 문구. 4xx 는 서버가 알려 준 입력 문제를 그대로 보여 주고, 5xx 와 읽을 수 없는 본문은
// 내부 사정 대신 다시 시도 안내만 둔다.
export function describeSubmitFailure(status, body) {
	const detail = status < 500 ? extractErrorMessage(body) : '';
	return `${SUBMIT_FAILED} ${detail || RETRY_LATER}`;
}
