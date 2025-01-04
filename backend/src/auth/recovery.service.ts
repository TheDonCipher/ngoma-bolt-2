import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { AuditService } from '../audit/audit.service';
import { RateLimiterService } from '../security/rate-limiter.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class RecoveryService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
    private audit: AuditService,
    private rateLimiter: RateLimiterService,
  ) {}

  async initiateRecovery(email: string, ipAddress: string): Promise<void> {
    // Rate limiting check
    await this.rateLimiter.checkLimit('password-recovery', ipAddress);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiry

    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    await this.email.sendPasswordResetEmail(email, token);

    await this.audit.createLog({
      userId: user.id,
      action: 'INITIATE_RECOVERY',
      category: 'SECURITY',
      severity: 'MEDIUM',
      details: {
        component: 'PasswordRecovery',
        metadata: { email },
      },
      ipAddress,
      status: 'SUCCESS',
    });
  }

  async validateToken(token: string): Promise<boolean> {
    const reset = await this.prisma.passwordReset.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
    });

    return !!reset;
  }

  async resetPassword(
    token: string,
    newPassword: string,
    ipAddress: string,
  ): Promise<void> {
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

    const hashedPassword = await bcrypt.hash(newPassword, 12);

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

    await this.audit.createLog({
      userId: reset.userId,
      action: 'RESET_PASSWORD',
      category: 'SECURITY',
      severity: 'HIGH',
      details: {
        component: 'PasswordRecovery',
      },
      ipAddress,
      status: 'SUCCESS',
    });
  }
}
