import { BadRequestException } from '@nestjs/common';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { UploadsController, UPLOADS_URL_PREFIX } from './uploads.controller';
import { UploadPreset } from './upload-preset';

// 원본 이미지(실 파일) 를 준비하고 controller.upload() 를 직접 호출해,
// sharp 파이프 결과와 반환 shape 를 검증한다. multer interceptor 는 테스트에서 우회 —
// Express.Multer.File 을 손으로 만들어서 파일시스템 상에 실제 파일을 둔다.

describe('UploadsController', () => {
  let controller: UploadsController;
  let workDir: string;

  beforeEach(() => {
    controller = new UploadsController();
    workDir = mkdtempSync(join(tmpdir(), 'uploads-spec-'));
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  async function seedFile(
    filename: string,
    originalWidth: number,
    originalHeight: number,
    mime: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  ): Promise<Express.Multer.File> {
    const path = join(workDir, filename);
    const buffer = await sharp({
      create: {
        width: originalWidth,
        height: originalHeight,
        channels: 3,
        background: { r: 200, g: 100, b: 40 },
      },
    })
      .jpeg({ quality: 90 })
      .toBuffer();
    writeFileSync(path, buffer);
    return {
      fieldname: 'file',
      originalname: `${filename}`,
      encoding: '7bit',
      mimetype: mime,
      size: buffer.length,
      destination: workDir,
      filename,
      path,
      buffer,
      stream: undefined as never,
    } as Express.Multer.File;
  }

  it('file 이 undefined 면 BadRequestException', async () => {
    await expect(controller.upload(undefined)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('알 수 없는 preset 은 BadRequestException', async () => {
    const file = await seedFile('x.jpg', 1920, 1080);
    await expect(controller.upload(file, 'banner')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('thumbnail preset 은 16:9 로 중앙 crop 된다 (1920×1080 → 1600×900)', async () => {
    const file = await seedFile('t.jpg', 1920, 1080);
    const result = await controller.upload(file, UploadPreset.THUMBNAIL);
    expect(result.url).toBe(`${UPLOADS_URL_PREFIX}/t.jpg`);
    expect(result.mime).toBe('image/jpeg');
    expect(result.preset).toBe(UploadPreset.THUMBNAIL);
    expect(result.width).toBe(1600);
    expect(result.height).toBe(900);
  });

  it('thumbnail 은 cover 이므로 작은 원본도 목표 크기로 업스케일', async () => {
    const file = await seedFile('small.jpg', 800, 450);
    const result = await controller.upload(file, UploadPreset.THUMBNAIL);
    expect(result.width).toBe(1600);
    expect(result.height).toBe(900);
  });

  it('profile preset 은 1:1 로 중앙 crop 된다', async () => {
    const file = await seedFile('p.jpg', 1200, 800);
    const result = await controller.upload(file, UploadPreset.PROFILE);
    expect(result.width).toBe(512);
    expect(result.height).toBe(512);
  });

  it('gallery preset 은 비율 유지 + 장축 1600 으로 다운스케일', async () => {
    const file = await seedFile('g.jpg', 3200, 1000);
    const result = await controller.upload(file, UploadPreset.GALLERY);
    expect(result.width).toBe(1600);
    expect(result.height).toBe(500);
  });

  it('gallery 는 inside 이므로 원본이 작으면 확대하지 않는다', async () => {
    const file = await seedFile('gs.jpg', 800, 300);
    const result = await controller.upload(file, UploadPreset.GALLERY);
    expect(result.width).toBe(800);
    expect(result.height).toBe(300);
  });

  it('preset 미지정이면 기본값 gallery 적용', async () => {
    const file = await seedFile('d.jpg', 3200, 1000);
    const result = await controller.upload(file);
    expect(result.preset).toBe(UploadPreset.GALLERY);
    expect(result.width).toBe(1600);
  });
});
