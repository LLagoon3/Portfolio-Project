import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ADMIN_COOKIE_NAME, JwtPayload } from './strategies/jwt.strategy';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: '어드민 비밀번호 로그인' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: '비밀번호 불일치' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: true }> {
    const { token, expiresInSec } = await this.authService.login(dto.password);
    res.cookie(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: this.isProd(),
      sameSite: 'lax',
      path: '/',
      maxAge: expiresInSec * 1000,
    });
    return { ok: true };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: '어드민 로그아웃 (쿠키 만료)' })
  logout(@Res({ passthrough: true }) res: Response): { ok: true } {
    res.clearCookie(ADMIN_COOKIE_NAME, {
      httpOnly: true,
      secure: this.isProd(),
      sameSite: 'lax',
      path: '/',
    });
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '로그인 상태 확인 (쿠키 기반)' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401 })
  me(@Req() req: Request): { ok: true; sub: string } {
    const user = (req as Request & { user?: JwtPayload }).user;
    return { ok: true, sub: user?.sub ?? 'admin' };
  }

  private isProd(): boolean {
    return this.config.get<string>('NODE_ENV') === 'production';
  }
}
