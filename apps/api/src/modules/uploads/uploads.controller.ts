import {
  BadRequestException,
  Controller,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import type { Request } from 'express';
import { diskStorage } from 'multer';
import sharp from 'sharp';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { getPresetSpec, resolvePreset, UploadPreset } from './upload-preset';

export const UPLOADS_ROOT = process.env.UPLOADS_ROOT ?? '/app/uploads';
export const UPLOADS_URL_PREFIX = '/uploads';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

type FileFilterCallback = (err: Error | null, acceptFile: boolean) => void;

function ensureUploadsRoot(): void {
  if (!existsSync(UPLOADS_ROOT)) {
    mkdirSync(UPLOADS_ROOT, { recursive: true });
  }
}

export interface UploadResultDto {
  url: string;
  bytes: number;
  mime: string;
  width: number;
  height: number;
  preset: UploadPreset;
}

@ApiTags('Admin · Uploads')
@Controller('api/admin/uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  @Post()
  @ApiOperation({
    summary: '이미지 업로드 (multipart/form-data, field name: file) + preset 기반 서버 리사이즈',
  })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'preset', enum: UploadPreset, required: false })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400 })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          ensureUploadsRoot();
          cb(null, UPLOADS_ROOT);
        },
        filename: (_req, _file, cb) => {
          // 서버 리사이즈 후 항상 JPEG 로 재인코딩하므로 확장자도 .jpg 로 통일한다.
          cb(null, `${randomUUID()}.jpg`);
        },
      }),
      fileFilter: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback,
      ): void => {
        if (!ALLOWED_MIME.has(file.mimetype)) {
          cb(new BadRequestException(`허용되지 않은 이미지 형식: ${file.mimetype}`), false);
          return;
        }
        cb(null, true);
      },
      limits: {
        fileSize: parseInt(
          process.env.UPLOAD_MAX_BYTES ?? String(5 * 1024 * 1024),
          10,
        ),
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Query('preset') presetQuery?: string,
  ): Promise<UploadResultDto> {
    if (!file) {
      throw new BadRequestException('업로드된 파일이 없습니다.');
    }

    let preset: UploadPreset;
    try {
      preset = resolvePreset(presetQuery);
    } catch (err) {
      await rm(file.path, { force: true });
      throw new BadRequestException((err as Error).message);
    }

    const spec = getPresetSpec(preset);
    try {
      const buffer = await sharp(file.path)
        .rotate() // EXIF orientation 적용
        .resize({
          width: spec.width,
          height: spec.height,
          fit: spec.fit,
          // cover(썸네일/프로필) 는 공개 페이지 레이아웃 일관성을 위해 목표 크기까지
          // 업스케일 허용. inside(갤러리) 는 원본 > 1600 일 때만 축소하고 그 이하는
          // 원본 품질 유지.
          withoutEnlargement: spec.fit === 'inside',
        })
        .jpeg({ quality: 88, mozjpeg: true })
        .toBuffer({ resolveWithObject: true });

      await sharp(buffer.data).toFile(file.path);
      const stats = await stat(file.path);

      return {
        url: join(UPLOADS_URL_PREFIX, file.filename).replace(/\\/g, '/'),
        bytes: stats.size,
        mime: 'image/jpeg',
        width: buffer.info.width,
        height: buffer.info.height,
        preset,
      };
    } catch (err) {
      // 처리 실패 시 디스크에 깨진 파일을 남기지 않는다.
      await rm(file.path, { force: true });
      throw err;
    }
  }
}
