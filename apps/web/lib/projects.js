// 프로젝트 페이지 공용 헬퍼.

// admin 의 headerPublishDate 가 'YYYY.MM – YYYY.MM' 형식이라 첫 4자리만 잘라 연도로 사용한다.
// 형식이 깨진 row 는 빈 문자열이 되고, 상위 컴포넌트에서 stats 집계 / 그룹 헤더 등에서 제외된다.
export function parseYear(headerPublishDate) {
	const head = (headerPublishDate ?? '').slice(0, 4);
	return /^\d{4}$/.test(head) ? head : '';
}
