import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadsController, UPLOADS_URL_PREFIX } from './uploads.controller';

const fakeFile = (
  overrides: Partial<Express.Multer.File> = {},
): Express.Multer.File =>
  ({
    fieldname: 'file',
    originalname: 'a.png',
    encoding: '7bit',
    mimetype: 'image/png',
    size: 1234,
    destination: '/app/uploads',
    filename: 'abc-uuid.png',
    path: '/app/uploads/abc-uuid.png',
    buffer: Buffer.alloc(0),
    stream: undefined as never,
    ...overrides,
  }) as Express.Multer.File;

describe('UploadsController', () => {
  let controller: UploadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadsController],
      providers: [
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get(UploadsController);
  });

  it('정상 업로드 시 URL / bytes / mime 를 반환한다', () => {
    const result = controller.upload(fakeFile());
    expect(result.url).toBe(`${UPLOADS_URL_PREFIX}/abc-uuid.png`);
    expect(result.bytes).toBe(1234);
    expect(result.mime).toBe('image/png');
  });

  it('file 이 undefined 면 BadRequestException', () => {
    expect(() => controller.upload(undefined)).toThrow(BadRequestException);
  });
});
