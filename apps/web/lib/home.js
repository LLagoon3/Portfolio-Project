// 홈 화면 전용 순수 헬퍼. 컴포넌트와 분리해 정책(노출 개수/검색/소개 문단)을 테스트한다.

// 홈은 API 정렬 순서 그대로 앞의 6개만 노출한다. 전체 목록은 /projects 에서 본다.
export const HOME_PROJECT_LIMIT = 6;

// bio 가 비었거나 설명 단락이 없을 때 쓰는 공개 소개 문장.
export const ABOUT_SUMMARY_FALLBACK =
	'데이터가 쌓였을 때의 성능, 동시에 발생하는 요청의 정합성, 문제가 생겼을 때 원인을 추적할 수 있는 구조를 함께 고려합니다.';

// 검색은 제목 또는 카테고리 부분 일치. 결과에는 원래 목록 기준 번호(1부터)를 함께 담아
// 검색 중에도 카드 번호가 바뀌지 않게 한다.
export function selectHomeProjects(projects, query = '', limit = HOME_PROJECT_LIMIT) {
	const list = Array.isArray(projects) ? projects : [];
	const q = String(query ?? '')
		.trim()
		.toLocaleLowerCase();

	const numbered = list
		.filter((project) => project && typeof project === 'object')
		.map((project, index) => ({ project, number: index + 1 }));

	const matched = q
		? numbered.filter(({ project }) =>
				[project.title, project.category].some(
					(field) =>
						typeof field === 'string' &&
						field.toLocaleLowerCase().includes(q),
				),
			)
		: numbered;

	return matched.slice(0, limit);
}

// 어드민 bio 는 마크다운으로 입력될 수 있어 제목 줄과 굵게 표시만 걷어낸 평문으로 만든다.
function toPlainParagraph(raw) {
	if (typeof raw !== 'string') return '';
	return raw
		.split('\n')
		.filter((line) => !line.trim().startsWith('#'))
		.join(' ')
		.replace(/\*\*(.+?)\*\*/g, '$1')
		.replace(/\s+/g, ' ')
		.trim();
}

// bio[0] 은 About 제목과 같은 한 줄 소개라 홈에서는 반복하지 않고,
// 이어지는 설명 단락(성능·정합성·원인 추적)을 쓴다. 없으면 공개 소개 문장으로 대체.
export function pickAboutSummary(bio) {
	if (!Array.isArray(bio)) return ABOUT_SUMMARY_FALLBACK;
	const paragraphs = bio.map(toPlainParagraph).filter(Boolean);
	return paragraphs[1] || ABOUT_SUMMARY_FALLBACK;
}
