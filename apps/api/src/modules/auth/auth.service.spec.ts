import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let config: { get: jest.Mock };
  let jwt: jest.Mocked<Pick<JwtService, 'signAsync'>>;

  const PASSWORD = 'super-secret';
  let passwordHash: string;

  beforeAll(async () => {
    passwordHash = await bcrypt.hash(PASSWORD, 4);
  });

  beforeEach(async () => {
    config = { get: jest.fn() };
    jwt = { signAsync: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: config },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('login: 올바른 비밀번호면 토큰과 expiresInSec 를 반환한다', async () => {
    config.get.mockImplementation((key: string) =>
      key === 'ADMIN_PASSWORD_HASH' ? passwordHash : '2h',
    );
    jwt.signAsync.mockResolvedValue('signed.jwt.token');

    const result = await service.login(PASSWORD);

    expect(jwt.signAsync).toHaveBeenCalledWith(
      { sub: 'admin' },
      { expiresIn: 7200 },
    );
    expect(result).toEqual({
      token: 'signed.jwt.token',
      expiresInSec: 7200,
    });
  });

  it('login: 잘못된 비밀번호면 UnauthorizedException', async () => {
    config.get.mockImplementation((key: string) =>
      key === 'ADMIN_PASSWORD_HASH' ? passwordHash : '2h',
    );

    await expect(service.login('wrong')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('login: 해시 env 미설정이면 UnauthorizedException', async () => {
    config.get.mockReturnValue(undefined);
    await expect(service.login(PASSWORD)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('login: JWT_EXPIRES_IN 미설정이면 기본 2h(=7200초) 를 maxAge 로 쓴다', async () => {
    config.get.mockImplementation((key: string) =>
      key === 'ADMIN_PASSWORD_HASH' ? passwordHash : undefined,
    );
    jwt.signAsync.mockResolvedValue('t');

    const result = await service.login(PASSWORD);

    expect(result.expiresInSec).toBe(7200);
    expect(jwt.signAsync).toHaveBeenCalledWith(
      { sub: 'admin' },
      { expiresIn: 7200 },
    );
  });

  it('login: 분 단위 expiresIn 도 초로 정규화된다', async () => {
    config.get.mockImplementation((key: string) => {
      if (key === 'ADMIN_PASSWORD_HASH') return passwordHash;
      if (key === 'JWT_EXPIRES_IN') return '30m';
      return undefined;
    });
    jwt.signAsync.mockResolvedValue('t');

    const result = await service.login(PASSWORD);

    expect(result.expiresInSec).toBe(30 * 60);
  });
});
