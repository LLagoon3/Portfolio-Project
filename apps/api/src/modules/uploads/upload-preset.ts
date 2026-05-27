// 업로드 슬롯별 resize/crop 프리셋.
// - thumbnail: 프로젝트 카드 썸네일. 4:5 로 중앙 crop + 1200×1500 까지 다운스케일
//   (Bold 카드 / Hero 프레임이 4:5 aspectRatio + objectFit:cover 라 동일 비율로
//   pre-crop. 과거 16:9 프리셋이 카드 프레임에서 이중 크롭되며 확대돼 보이던 문제 해소)
// - gallery: 프로젝트 상세 갤러리. 비율 유지하되 장축 1600px 이하로만 다운스케일
// - profile: About 프로필. 1:1 중앙 crop + 512×512 까지 다운스케일

export enum UploadPreset {
  THUMBNAIL = 'thumbnail',
  GALLERY = 'gallery',
  PROFILE = 'profile',
}

export interface PresetSpec {
  width?: number;
  height?: number;
  fit: 'cover' | 'inside';
}

const SPEC: Record<UploadPreset, PresetSpec> = {
  [UploadPreset.THUMBNAIL]: { width: 1200, height: 1500, fit: 'cover' },
  [UploadPreset.GALLERY]: { width: 1600, height: 1600, fit: 'inside' },
  [UploadPreset.PROFILE]: { width: 512, height: 512, fit: 'cover' },
};

export function resolvePreset(input: unknown): UploadPreset {
  if (typeof input !== 'string' || input.length === 0) {
    return UploadPreset.GALLERY;
  }
  const lower = input.toLowerCase();
  const all = Object.values(UploadPreset);
  if ((all as string[]).includes(lower)) {
    return lower as UploadPreset;
  }
  throw new Error(`Unknown upload preset: ${input}`);
}

export function getPresetSpec(preset: UploadPreset): PresetSpec {
  return SPEC[preset];
}
