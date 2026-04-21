import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MulterError } from 'multer';
import { HttpExceptionFilter } from './http-exception.filter';

interface CapturedResponse {
  status: jest.Mock;
  json: jest.Mock;
  payload?: unknown;
  statusCode?: number;
}

function buildHost(
  url = '/x',
): { host: ArgumentsHost; captured: CapturedResponse } {
  const captured: CapturedResponse = {
    status: jest.fn().mockImplementation(function (this: CapturedResponse, code: number) {
      this.statusCode = code;
      return this;
    }),
    json: jest.fn().mockImplementation(function (this: CapturedResponse, body: unknown) {
      this.payload = body;
      return this;
    }),
  };
  // status/json 을 this 로 바인딩
  captured.status = captured.status.bind(captured);
  captured.json = captured.json.bind(captured);

  const host = {
    switchToHttp: () => ({
      getResponse: () => captured,
      getRequest: () => ({ method: 'POST', url }),
    }),
  } as unknown as ArgumentsHost;
  return { host, captured };
}

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    // 500 로그 노이즈 억제
    jest
      .spyOn(
        (filter as unknown as { logger: { error: jest.Mock } }).logger,
        'error',
      )
      .mockImplementation(() => undefined);
  });

  it('HttpException 은 본래 status code 와 message 유지', () => {
    const { host, captured } = buildHost();
    filter.catch(new BadRequestException('bad input'), host);

    expect(captured.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect((captured.payload as { error: { message: string } }).error.message).toBe(
      'bad input',
    );
  });

  it('MulterError LIMIT_FILE_SIZE 는 400 + 한글 안내 메시지로 매핑', () => {
    const { host, captured } = buildHost();
    filter.catch(new MulterError('LIMIT_FILE_SIZE'), host);

    expect(captured.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect((captured.payload as { error: { message: string } }).error.message).toContain(
      '허용 한도를 초과',
    );
  });

  it('그 외 MulterError 도 400 + 원본 메시지', () => {
    const { host, captured } = buildHost();
    filter.catch(new MulterError('LIMIT_UNEXPECTED_FILE'), host);

    expect(captured.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(
      (captured.payload as { error: { message: string } }).error.message,
    ).toMatch(/unexpected/i);
  });

  it('일반 Error 는 500 으로 fallback', () => {
    const { host, captured } = buildHost();
    filter.catch(new Error('boom'), host);

    expect(captured.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect((captured.payload as { error: { message: string } }).error.message).toBe('boom');
  });

  it('HttpException 의 response 가 객체면 message 필드를 추출', () => {
    const { host, captured } = buildHost();
    filter.catch(
      new HttpException({ message: ['a', 'b'] }, HttpStatus.UNPROCESSABLE_ENTITY),
      host,
    );

    expect(captured.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect((captured.payload as { error: { message: string } }).error.message).toBe('a, b');
  });
});
