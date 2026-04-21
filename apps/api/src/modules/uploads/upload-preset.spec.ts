import { getPresetSpec, resolvePreset, UploadPreset } from './upload-preset';

describe('upload-preset', () => {
  describe('resolvePreset', () => {
    it('빈/누락 입력은 기본값 gallery', () => {
      expect(resolvePreset(undefined)).toBe(UploadPreset.GALLERY);
      expect(resolvePreset('')).toBe(UploadPreset.GALLERY);
      expect(resolvePreset(null)).toBe(UploadPreset.GALLERY);
    });

    it('thumbnail / gallery / profile 모두 허용 (대소문자 무시)', () => {
      expect(resolvePreset('thumbnail')).toBe(UploadPreset.THUMBNAIL);
      expect(resolvePreset('GALLERY')).toBe(UploadPreset.GALLERY);
      expect(resolvePreset('Profile')).toBe(UploadPreset.PROFILE);
    });

    it('알 수 없는 값은 예외', () => {
      expect(() => resolvePreset('banner')).toThrow(/unknown/i);
    });
  });

  describe('getPresetSpec', () => {
    it('thumbnail 은 16:9 (1600×900) cover', () => {
      expect(getPresetSpec(UploadPreset.THUMBNAIL)).toEqual({
        width: 1600,
        height: 900,
        fit: 'cover',
      });
    });

    it('profile 은 1:1 (512×512) cover', () => {
      expect(getPresetSpec(UploadPreset.PROFILE)).toEqual({
        width: 512,
        height: 512,
        fit: 'cover',
      });
    });

    it('gallery 는 장축 1600 까지 비율 유지(inside)', () => {
      const spec = getPresetSpec(UploadPreset.GALLERY);
      expect(spec.fit).toBe('inside');
      expect(spec.width).toBe(1600);
      expect(spec.height).toBe(1600);
    });
  });
});
