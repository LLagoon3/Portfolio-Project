import {
  BadRequestException,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import type { Request } from 'express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export const UPLOADS_ROOT = process.env.UPLOADS_ROOT ?? '/app/uploads';
// URL 경로. 공개 static 서빙 (web 컨테이너가 /app/apps/web/public/uploads 로 같은 볼륨 마운트) 기준.
export const UPLOADS_URL_PREFIX = '/uploads';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

// multer FileFilterCallback 시그니처 (acceptFile 은 non-optional).
type FileFilterCallback = (err: Error | null, acceptFile: boolean) => void;

function ensureUploadsRoot(): void {
  if (!existsSync(UPLOADS_ROOT)) {
    mkdirSync(UPLOADS_ROOT, { recursive: true });
  }
}

@ApiTags('Admin · Uploads')
@Controller('api/admin/uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly config: ConfigService) {}

  @Post()
  @ApiOperation({ summary: '이미지 업로드 (multipart/form-data, field name: file)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400, description: 'MIME 또는 크기 검증 실패' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          ensureUploadsRoot();
          cb(null, UPLOADS_ROOT);
        },
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase() || '.bin';
          cb(null, `${randomUUID()}${ext}`);
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
  upload(
    @UploadedFile() file: Express.Multer.File | undefined,
  ): { url: string; bytes: number; mime: string } {
    if (!file) {
      throw new BadRequestException('업로드된 파일이 없습니다.');
    }
    return {
      url: join(UPLOADS_URL_PREFIX, file.filename).replace(/\\/g, '/'),
      bytes: file.size,
      mime: file.mimetype,
    };
  }
}

// multer 의 file size 초과 에러를 400 으로 매핑하고 싶으면 필요 시 exception filter 에서 처리.
// 현재 전역 HttpExceptionFilter 가 이미 HttpException 계열을 일관 포맷으로 변환하므로 따로 두지 않는다.
void HttpException;
void HttpStatus;
