import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ADMIN_COOKIE_NAME } from './strategies/jwt.strategy';

interface FakeResponse {
  cookie: jest.Mock;
  clearCookie: jest.Mock;
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let config: { get: jest.Mock };

  const buildRes = (): FakeResponse => ({
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  });

  beforeEach(async () => {
    authService = { login: jest.fn() } as unknown as jest.Mocked<AuthService>;
    config = { get: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    controller = module.get(AuthController);
  });

  describe('login', () => {
    it('성공 시 HttpOnly 쿠키를 심고 { ok: true } 를 반환한다', async () => {
      authService.login.mockResolvedValue({
        token: 'jwt-token',
        expiresInSec: 7200,
      });
      config.get.mockReturnValue('development');
      const res = buildRes();

      const result = await controller.login(
        { password: 'super-secret' },
        res as never,
      );

      expect(authService.login).toHaveBeenCalledWith('super-secret');
      expect(res.cookie).toHaveBeenCalledWith(
        ADMIN_COOKIE_NAME,
        'jwt-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 7_200_000,
          secure: false,
        }),
      );
      expect(result).toEqual({ ok: true });
    });

    it('production 에서는 secure 쿠키를 심는다', async () => {
      authService.login.mockResolvedValue({ token: 't', expiresInSec: 60 });
      config.get.mockReturnValue('production');
      const res = buildRes();

      await controller.login({ password: 'p' }, res as never);

      expect(res.cookie).toHaveBeenCalledWith(
        ADMIN_COOKIE_NAME,
        't',
        expect.objectContaining({ secure: true }),
      );
    });
  });

  describe('logout', () => {
    it('쿠키를 제거하고 { ok: true } 를 반환한다', () => {
      config.get.mockReturnValue('production');
      const res = buildRes();

      const result = controller.logout(res as never);

      expect(res.clearCookie).toHaveBeenCalledWith(
        ADMIN_COOKIE_NAME,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
        }),
      );
      expect(result).toEqual({ ok: true });
    });
  });

  describe('me', () => {
    it('req.user.sub 를 그대로 돌려준다', () => {
      const req = { user: { sub: 'admin' } } as never;
      expect(controller.me(req)).toEqual({ ok: true, sub: 'admin' });
    });

    it('req.user 가 비어있으면 기본값 admin 을 돌려준다 (방어적)', () => {
      const req = {} as never;
      expect(controller.me(req)).toEqual({ ok: true, sub: 'admin' });
    });
  });
});
