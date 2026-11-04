// /about 화면 전용 순수 헬퍼. API 값의 빈/누락 처리와 수치 라벨 표기를 컴포넌트와 분리해 테스트한다.

// 이름 / 한 줄 소개가 비어 있을 때 쓰던 기존 About 화면의 기본값을 그대로 유지한다.
export const DEFAULT_NAME = '이석호';
export const DEFAULT_TAGLINE =
	'서비스의 동작 원리와 운영 구조를 함께 이해하며, 성능·안정성·운영 효율을 개선하는 백엔드 개발자입니다.';

const isObject = (value) => value !== null && typeof value === 'object';
const list = (value) => (Array.isArray(value) ? value : []);
const text = (value) => (typeof value === 'string' ? value.trim() : '');

// API 가 일부 필드를 null / 누락으로 내려도 화면이 깨지지 않게 모양만 맞춘다.
// 값은 고치거나 다시 정렬하지 않는다: 배열 순서, 수치, 문구는 API 그대로 둔다.
export function normalizeAbout(about) {
	const source = isObject(about) ? about : {};
	return {
		name: text(source.name) || DEFAULT_NAME,
		tagline: text(source.tagline) || DEFAULT_TAGLINE,
		profileImage: text(source.profileImage) || null,
		availability: text(source.availability) || null,
		// 빈 단락만 건너뛴다. 단락 본문(Markdown)은 손대지 않는다.
		bio: list(source.bio).filter((paragraph) => typeof paragraph === 'string' && paragraph.trim()),
		stats: list(source.stats).filter(isObject),
		principles: list(source.principles).filter(isObject),
		journey: list(source.journey).filter(isObject),
		// 기존 화면처럼 기술이 하나도 없는 그룹은 숨긴다.
		stacks: list(source.stacks).filter((group) => isObject(group) && list(group.techs).length > 0),
	};
}

const LATIN = /[A-Za-z]/;
const TITLE_WORD = /^[A-Z][a-z]+$/;

// 수치 라벨의 대소문자만 문장형으로 정리한다. 단어, 순서, 약어는 API 값 그대로다.
//   'SELECTED PROJECTS'         → 'Selected projects'   (전부 대문자인 두 단어 이상)
//   'API Performance'           → 'API performance'     (첫 단어 뒤의 Title 형태 단어만 낮춤)
//   'Open Source Contributions' → 'Open source contributions'
// 이미 소문자로 시작하는 단어가 섞인 라벨('Uptime with Grafana')은 의도한 표기로 보고 그대로 둔다.
// 한 단어짜리 대문자 라벨('API', 'MAU')과 한글 라벨도 그대로 둔다.
export function formatStatLabel(label) {
	const value = typeof label === 'string' ? label : String(label ?? '');
	const words = value.split(/\s+/).filter((word) => LATIN.test(word));
	if (!words.length || words.some((word) => /^[^A-Za-z]*[a-z]/.test(word))) return value;

	if (!/[a-z]/.test(value)) {
		if (words.length < 2) return value;
		return value.toLowerCase().replace(LATIN, (letter) => letter.toUpperCase());
	}

	let first = true;
	return value.replace(/\S+/g, (word) => {
		if (!LATIN.test(word)) return word;
		if (first) {
			first = false;
			return word;
		}
		return TITLE_WORD.test(word) ? word.toLowerCase() : word;
	});
}
