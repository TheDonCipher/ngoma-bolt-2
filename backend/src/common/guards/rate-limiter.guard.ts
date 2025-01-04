import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private rateLimiter: RateLimiterMemory;

  constructor(private configService: ConfigService) {
    this.rateLimiter = new RateLimiterMemory({
      points: configService.get('RATE_LIMIT_MAX', 100),
      duration: configService.get('RATE_LIMIT_WINDOW', 900000), // 15 minutes
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = request.ip;

    try {
      await this.rateLimiter.consume(key);
      return true;
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too Many Requests',
        retryAfter: Math.ceil(error.msBeforeNext / 1000),
      }, HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}
