import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { UPLOADS_ROOT, UPLOADS_URL_PREFIX } from './modules/uploads/uploads.controller';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  // 어드민 업로드 파일을 /uploads/* 로 정적 서빙. Next.js public 디렉터리 캐싱을
  // 우회하기 위해 api 가 직접 호스팅하고, 프론트에서는 Next rewrite 로 프록시한다.
  app.useStaticAssets(UPLOADS_ROOT, { prefix: UPLOADS_URL_PREFIX });

  // 어드민 JWT 쿠키 파싱용
  app.use(cookieParser());

  // CORS
  const corsOrigin = config.get<string>('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',').map((o) => o.trim()) : true,
    credentials: true,
  });

  // 전역 ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 전역 응답/예외 처리
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('포트폴리오 백엔드 API 문서')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = config.get<number>('PORT') ?? 7341;
  await app.listen(port);
}

bootstrap();
