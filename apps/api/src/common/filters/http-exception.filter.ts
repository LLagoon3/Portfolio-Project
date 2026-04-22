import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MulterError } from 'multer';
import { ApiErrorResponse } from '../dto/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    // Multer 업로드 에러(크기 초과 등)는 사용자 입력 문제이므로 400 으로 매핑한다.
    const isMulter = exception instanceof MulterError;

    let statusCode: number;
    if (isHttp) {
      statusCode = exception.getStatus();
    } else if (isMulter) {
      statusCode = HttpStatus.BAD_REQUEST;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    let message = 'Internal server error';
    if (isHttp) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null && 'message' in res) {
        const m = (res as { message: unknown }).message;
        message = Array.isArray(m) ? m.join(', ') : String(m);
      }
    } else if (isMulter) {
      message =
        exception.code === 'LIMIT_FILE_SIZE'
          ? '파일 크기가 허용 한도를 초과했습니다.'
          : exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    if (statusCode >= 500) {
      this.logger.error(`${request.method} ${request.url} - ${message}`, (exception as Error)?.stack);
    }

    const body: ApiErrorResponse = {
      success: false,
      error: {
        statusCode,
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    };

    response.status(statusCode).json(body);
  }
}
