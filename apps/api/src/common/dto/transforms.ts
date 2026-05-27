// class-transformer @Transform 헬퍼 공용 — 모듈별 DTO 파일에서 복사돼 있던 것을 lift.
// (이전: apps/api/src/modules/projects/dto/upsert-project.dto.ts:14-24,
//       apps/api/src/modules/about/dto/upsert-about.dto.ts:14-25)

// 입력이 string 이면 trim, 아니면 그대로.
export const trimIfString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

// 입력이 배열이면 각 요소에 trimIfString 적용, 아니면 그대로.
export const trimArray = (value: unknown): unknown =>
  Array.isArray(value) ? value.map(trimIfString) : value;

// 빈 문자열·공백-only 는 null 로 정규화 (선택 필드 공통 규칙).
export const trimToNull = (value: unknown): unknown => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
};
