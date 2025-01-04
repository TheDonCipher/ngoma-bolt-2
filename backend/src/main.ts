import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RateLimiterGuard } from './common/guards/rate-limiter.guard';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as sanitize from 'sanitize-html';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
  });

  // Input sanitization
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    sanitize: true,
    sanitizeOptions: {
      allowedTags: sanitize.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        ...sanitize.defaults.allowedAttributes,
        img: ['src', 'alt'],
      },
    },
  }));

  // Rate limiting
  app.useGlobalGuards(new RateLimiterGuard());

  // Performance
  app.use(compression());

  // Error Handling & Logging
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // API Documentation
  const config = new DocumentBuilder()
    .setTitle('Afrobeats NFT API')
    .setDescription('The Afrobeats NFT platform API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
