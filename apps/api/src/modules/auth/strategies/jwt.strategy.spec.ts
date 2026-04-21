import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('JWT_SECRET 가 없으면 생성자에서 실패한다', () => {
    const config = { get: jest.fn().mockReturnValue(undefined) } as unknown as ConfigService;
    expect(() => new JwtStrategy(config)).toThrow(/JWT_SECRET/);
  });

  it('JWT_SECRET 가 있으면 정상 생성된다', () => {
    const config = { get: jest.fn().mockReturnValue('secret') } as unknown as ConfigService;
    expect(() => new JwtStrategy(config)).not.toThrow();
  });

  it('validate 는 payload 를 그대로 반환한다', () => {
    const config = { get: jest.fn().mockReturnValue('secret') } as unknown as ConfigService;
    const strategy = new JwtStrategy(config);

    expect(strategy.validate({ sub: 'admin' })).toEqual({ sub: 'admin' });
  });
});
