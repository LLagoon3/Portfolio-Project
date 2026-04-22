import { Injectable, Logger } from '@nestjs/common';
import { readdir, rm, stat } from 'node:fs/promises';
import { basename, join, posix } from 'node:path';
import { UPLOADS_ROOT, UPLOADS_URL_PREFIX } from './uploads.controller';

// `/uploads/<filename>` URL 에서 파일명 추출. prefix 일치 + 하위 경로·상위 참조 방지.
export function resolveUploadFilename(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  if (!url.startsWith(`${UPLOADS_URL_PREFIX}/`)) return null;
  const filename = url.slice(UPLOADS_URL_PREFIX.length + 1);
  if (filename.length === 0) return null;
  // 슬래시 포함 시 서브디렉터리 참조로 간주하고 거부 (flat 구조만 허용)
  if (filename.includes('/') || filename.includes('\\')) return null;
  // '.' / '..' 같은 상위 탐색 금지
  if (filename === '.' || filename === '..') return null;
  if (filename !== basename(filename)) return null;
  return filename;
}

// 입력 URL 배열에서 /uploads 관리 대상 파일명만 뽑아 집합으로 반환.
// 외부 URL(http*) 과 `/images/*` 같은 수동 관리 자산은 제외된다.
export function collectReferencedFilenames(urls: (string | null | undefined)[]): Set<string> {
  const set = new Set<string>();
  for (const url of urls) {
    const filename = resolveUploadFilename(url);
    if (filename) set.add(filename);
  }
  return set;
}

@Injectable()
export class UploadsStorageService {
  private readonly logger = new Logger(UploadsStorageService.name);

  /**
   * /uploads/* URL 한 개의 실제 파일을 디스크에서 삭제한다.
   * - prefix 가 /uploads/ 가 아니면 no-op (외부 URL / 수동 자산 보호)
   * - 파일이 이미 없으면 경고 로그만 남기고 통과
   * @returns 실제로 삭제했는지 여부
   */
  async deleteByUrl(url: string | null | undefined): Promise<boolean> {
    const filename = resolveUploadFilename(url);
    if (!filename) return false;
    const absPath = join(UPLOADS_ROOT, filename);
    try {
      await rm(absPath, { force: false });
      return true;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'ENOENT') {
        this.logger.warn(`[deleteByUrl] 파일이 이미 없음: ${absPath}`);
        return false;
      }
      this.logger.error(`[deleteByUrl] 삭제 실패: ${absPath}`, err as Error);
      throw err;
    }
  }

  /**
   * 현재 DB 가 참조하는 /uploads 파일명 집합을 받아, 디스크 상에서
   * 그 집합에 없는 모든 파일(= orphan) 의 정보를 반환한다.
   */
  async listOrphans(
    referenced: Set<string>,
  ): Promise<{ filename: string; path: string; bytes: number }[]> {
    let entries: string[];
    try {
      entries = await readdir(UPLOADS_ROOT);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw err;
    }
    const orphans: { filename: string; path: string; bytes: number }[] = [];
    for (const entry of entries) {
      if (referenced.has(entry)) continue;
      const abs = join(UPLOADS_ROOT, entry);
      try {
        const s = await stat(abs);
        if (!s.isFile()) continue;
        orphans.push({ filename: entry, path: abs, bytes: s.size });
      } catch (err) {
        this.logger.warn(`[listOrphans] stat 실패: ${abs} - ${(err as Error).message}`);
      }
    }
    return orphans;
  }

  // 테스트/디버그 편의를 위해 정적 URL 변환 헬퍼도 노출.
  static toUrl(filename: string): string {
    return posix.join(UPLOADS_URL_PREFIX, filename);
  }
}
