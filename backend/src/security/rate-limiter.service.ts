import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateLimiterService {
  private limiters: Map<string, RateLimiterMemory>;

  constructor(private configService: ConfigService) {
    this.limiters = new Map();

    // Password recovery rate limiter
    this.limiters.set('password-recovery', new RateLimiterMemory({
      points: 5, // 5 attempts
      duration: 3600, // per hour
    }));

    // Login rate limiter
    this.limiters.set('login', new RateLimiterMemory({
      points: 10, // 10 attempts
      duration: 900, // per 15 minutes
    }));

    // API rate limiter
    this.limiters.set('api', new RateLimiterMemory({
      points: this.configService.get('RATE_LIMIT_MAX'),
      duration: this.configService.get('RATE_LIMIT_WINDOW'),
    }));
  }

  async checkLimit(type: string, key: string): Promise<void> {
    const limiter = this.limiters.get(type);
    if (!limiter) {
      throw new Error(`Rate limiter not found for type: ${type}`);
    }

    try {
      await limiter.consume(key);
    } catch (error) {
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  async resetLimit(type: string, key: string): Promise<void> {
    const limiter = this.limiters.get(type);
    if (limiter) {
      await limiter.delete(key);
    }
  }
}
