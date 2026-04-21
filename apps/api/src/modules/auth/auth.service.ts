import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './strategies/jwt.strategy';

export interface TokenResult {
  token: string;
  expiresInSec: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async login(password: string): Promise<TokenResult> {
    const hash = this.config.get<string>('ADMIN_PASSWORD_HASH');
    if (!hash) {
      throw new UnauthorizedException('admin credentials are not configured');
    }
    const ok = await bcrypt.compare(password, hash);
    if (!ok) {
      throw new UnauthorizedException('invalid password');
    }

    const expiresInInput = this.config.get<string>('JWT_EXPIRES_IN') ?? '2h';
    const expiresInSec = parseExpiresInSec(expiresInInput);
    const payload: JwtPayload = { sub: 'admin' };
    const token = await this.jwt.signAsync(payload, { expiresIn: expiresInSec });
    return { token, expiresInSec };
  }
}

// '2h', '30m', '3600' 같은 입력을 초 단위로 정규화. JWT 서명·쿠키 maxAge 모두 같은 값을 쓴다.
function parseExpiresInSec(input: string): number {
  const match = /^(\d+)\s*([smhd])?$/i.exec(input.trim());
  if (!match) return 2 * 60 * 60;
  const value = parseInt(match[1], 10);
  const unit = (match[2] ?? 's').toLowerCase();
  const unitSec: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return value * (unitSec[unit] ?? 1);
}
