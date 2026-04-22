import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// jest.mock 으로 UPLOADS_ROOT 를 테스트별 임시 디렉터리로 주입할 수 있도록 도와주는 헬퍼.
// 테스트 내부에서 process.env.UPLOADS_ROOT 를 바꾸면 uploads.controller 모듈이 이미
// 로드된 상태에서는 값 캐싱이 이루어지므로, jest.isolateModules 로 모듈을 새로 로드한다.

describe('UploadsStorageService', () => {
  let tempRoot: string;

  beforeEach(() => {
    tempRoot = mkdtempSync(join(tmpdir(), 'uploads-storage-spec-'));
    process.env.UPLOADS_ROOT = tempRoot;
  });

  afterEach(() => {
    rmSync(tempRoot, { recursive: true, force: true });
    delete process.env.UPLOADS_ROOT;
    jest.resetModules();
  });

  function loadService(): {
    svc: import('./uploads-storage.service').UploadsStorageService;
    collectReferencedFilenames: (typeof import('./uploads-storage.service'))['collectReferencedFilenames'];
    resolveUploadFilename: (typeof import('./uploads-storage.service'))['resolveUploadFilename'];
  } {
    let mod!: typeof import('./uploads-storage.service');
    jest.isolateModules(() => {
      mod = require('./uploads-storage.service');
    });
    return {
      svc: new mod.UploadsStorageService(),
      collectReferencedFilenames: mod.collectReferencedFilenames,
      resolveUploadFilename: mod.resolveUploadFilename,
    };
  }

  describe('resolveUploadFilename', () => {
    it('/uploads/xxxx.jpg → xxxx.jpg', () => {
      const { resolveUploadFilename } = loadService();
      expect(resolveUploadFilename('/uploads/abc.jpg')).toBe('abc.jpg');
    });

    it('외부 URL / 다른 prefix 는 null', () => {
      const { resolveUploadFilename } = loadService();
      expect(resolveUploadFilename('https://cdn.example.com/a.jpg')).toBeNull();
      expect(resolveUploadFilename('/images/profile.jpeg')).toBeNull();
      expect(resolveUploadFilename('')).toBeNull();
      expect(resolveUploadFilename(null)).toBeNull();
    });

    it('서브디렉터리 참조(..slash) 는 null', () => {
      const { resolveUploadFilename } = loadService();
      expect(resolveUploadFilename('/uploads/../secret')).toBeNull();
      expect(resolveUploadFilename('/uploads/sub/file.jpg')).toBeNull();
    });
  });

  describe('collectReferencedFilenames', () => {
    it('/uploads/* 만 집합에 포함, 외부/수동자산은 제외', () => {
      const { collectReferencedFilenames } = loadService();
      const set = collectReferencedFilenames([
        '/uploads/a.jpg',
        '/uploads/b.jpg',
        '/images/c.jpg',
        'https://cdn/d.jpg',
        null,
        undefined,
        '/uploads/a.jpg', // 중복
      ]);
      expect(Array.from(set).sort()).toEqual(['a.jpg', 'b.jpg']);
    });
  });

  describe('deleteByUrl', () => {
    it('실제 파일을 삭제하고 true 반환', async () => {
      const { svc } = loadService();
      const path = join(tempRoot, 'x.jpg');
      writeFileSync(path, Buffer.from('hi'));
      const result = await svc.deleteByUrl('/uploads/x.jpg');
      expect(result).toBe(true);
      expect(existsSync(path)).toBe(false);
    });

    it('/uploads 접두어 아니면 false (no-op)', async () => {
      const { svc } = loadService();
      const result = await svc.deleteByUrl('https://cdn/x.jpg');
      expect(result).toBe(false);
    });

    it('이미 없는 파일이면 false 반환 + 경고', async () => {
      const { svc } = loadService();
      const result = await svc.deleteByUrl('/uploads/missing.jpg');
      expect(result).toBe(false);
    });

    it('빈/유효하지 않은 URL 은 false', async () => {
      const { svc } = loadService();
      expect(await svc.deleteByUrl(null)).toBe(false);
      expect(await svc.deleteByUrl('')).toBe(false);
      expect(await svc.deleteByUrl('/uploads/..')).toBe(false);
    });
  });

  describe('listOrphans', () => {
    it('참조 집합에 없는 파일만 반환, 참조된 것은 제외', async () => {
      const { svc } = loadService();
      writeFileSync(join(tempRoot, 'keep-1.jpg'), Buffer.from('1'));
      writeFileSync(join(tempRoot, 'keep-2.jpg'), Buffer.from('22'));
      writeFileSync(join(tempRoot, 'orphan-a.jpg'), Buffer.from('333'));
      writeFileSync(join(tempRoot, 'orphan-b.jpg'), Buffer.from('4444'));

      const orphans = await svc.listOrphans(new Set(['keep-1.jpg', 'keep-2.jpg']));
      expect(orphans.map((o) => o.filename).sort()).toEqual([
        'orphan-a.jpg',
        'orphan-b.jpg',
      ]);
      expect(orphans.every((o) => o.bytes > 0)).toBe(true);
    });

    it('업로드 디렉터리가 없으면 빈 배열', async () => {
      rmSync(tempRoot, { recursive: true, force: true });
      const { svc } = loadService();
      const orphans = await svc.listOrphans(new Set());
      expect(orphans).toEqual([]);
    });
  });
});
