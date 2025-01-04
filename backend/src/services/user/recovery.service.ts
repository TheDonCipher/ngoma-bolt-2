import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RateLimiterService } from '../security/rate-limiter.service';
import { generateToken, hashPassword } from '../../utils/auth';

@Injectable()
export class RecoveryService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private rateLimiter: RateLimiterService,
  ) {}

  async initiatePasswordReset(email: string): Promise<void> {
    // Rate limiting check
    await this.rateLimiter.checkLimit('password-reset', email);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return;
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiry

    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    await this.emailService.sendPasswordResetEmail(email, token);
  }

  async validateResetToken(token: string): Promise<boolean> {
    const reset = await this.prisma.passwordReset.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
    });

    return !!reset;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const reset = await this.prisma.passwordReset.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
      include: { user: true },
    });

    if (!reset) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await hashPassword(newPassword);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: reset.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordReset.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
    ]);
  }
}
