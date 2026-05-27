// 프로젝트 페이지 공용 헬퍼.

// admin 의 headerPublishDate 가 'YYYY.MM – YYYY.MM' 형식이라 첫 4자리만 잘라 연도로 사용한다.
// 형식이 깨진 row 는 빈 문자열이 되고, 상위 컴포넌트에서 stats 집계 / 그룹 헤더 등에서 제외된다.
export function parseYear(headerPublishDate) {
	const head = (headerPublishDate ?? '').slice(0, 4);
	return /^\d{4}$/.test(head) ? head : '';
}

// admin 명시 값이 있으면 그대로, 없으면 title 마지막 공백 토큰 폴백.
export function pickHeroAccentWord(project) {
	if (project?.heroAccentWord && project.heroAccentWord.trim()) {
		return project.heroAccentWord.trim();
	}
	const tokens = (project?.title ?? '').trim().split(/\s+/);
	return tokens[tokens.length - 1] || '';
}

// 첫 단락 (빈 줄 split 의 첫 청크) 만 노출 — Overview 는 한 호흡 요약.
export function pickOverview(objectivesDetails) {
	if (!objectivesDetails) return '';
	const first = objectivesDetails.split(/\n\s*\n/)[0]?.trim();
	return first || '';
}

// Hero meta strip: Client / Role 은 admin 의 전용 필드 (#125) 사용.
// 이전엔 companyInfo 의 title 키워드 (role/역할/담당, client/...) 매칭 폴백이
// 있었으나 명명 의존 + 직관성 부족으로 제거. 빈 값이면 해당 칸 미노출.
export function buildHeroMeta(project) {
	const meta = [];

	if (project?.heroClient) {
		meta.push({ label: 'Client', value: project.heroClient });
	}
	if (project?.heroRole) {
		meta.push({ label: 'Role', value: project.heroRole });
	}
	if (project?.ProjectHeader?.publishDate) {
		meta.push({ label: 'Timeline', value: project.ProjectHeader.publishDate });
	}
	if (project?.category) {
		meta.push({ label: 'Category', value: project.category });
	}

	return meta;
}
