// 프로젝트 페이지 공용 헬퍼.

// admin 의 headerPublishDate 가 'YYYY.MM – YYYY.MM' 형식이라 첫 4자리만 잘라 연도로 사용한다.
// 형식이 깨진 row 는 빈 문자열이 되고, 상위 컴포넌트에서 stats 집계 / 그룹 헤더 등에서 제외된다.
export function parseYear(headerPublishDate) {
	const head = (headerPublishDate ?? '').slice(0, 4);
	return /^\d{4}$/.test(head) ? head : '';
}

// 첫 단락 (빈 줄 split 의 첫 청크) 만 노출 — Overview 는 한 호흡 요약.
export function pickOverview(objectivesDetails) {
	if (!objectivesDetails) return '';
	const first = objectivesDetails.split(/\n\s*\n/)[0]?.trim();
	return first || '';
}

// 상세 화면 상단 사실 목록: 클라이언트 / 역할은 admin 의 전용 필드 (#125) 를 쓰고,
// 기간 / 카테고리는 기본 필드를 쓴다. 빈 값이면 해당 행을 노출하지 않는다.
export function buildHeroMeta(project) {
	const meta = [];

	if (project?.heroClient) {
		meta.push({ label: '클라이언트', value: project.heroClient });
	}
	if (project?.heroRole) {
		meta.push({ label: '역할', value: project.heroRole });
	}
	if (project?.ProjectHeader?.publishDate) {
		meta.push({ label: '기간', value: project.ProjectHeader.publishDate });
	}
	if (project?.category) {
		meta.push({ label: '카테고리', value: project.category });
	}

	return meta;
}
