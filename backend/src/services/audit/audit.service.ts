import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLog, AuditAction, AuditCategory, AuditSeverity } from './types';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable()
export class AuditService {
  constructor(
    private prisma: PrismaService,
    private websocket: WebsocketService,
  ) {}

  async logAction(
    userId: string,
    action: AuditAction,
    category: AuditCategory,
    severity: AuditSeverity,
    details: any,
    ip: string,
  ): Promise<void> {
    const log = await this.prisma.auditLog.create({
      data: {
        userId,
        action,
        category,
        severity,
        details,
        ipAddress: ip,
        timestamp: new Date(),
      },
    });

    // Notify admins of critical events in real-time
    if (severity === 'CRITICAL') {
      this.websocket.notifyAdmins('audit:critical', log);
    }
  }

  async getAuditLogs(filters: any) {
    const { startDate, endDate, userId, action, category, severity } = filters;

    return this.prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
        userId: userId ? userId : undefined,
        action: action ? action : undefined,
        category: category ? category : undefined,
        severity: severity ? severity : undefined,
      },
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async cleanupOldLogs(retentionDays: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    await this.prisma.auditLog.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
        severity: {
          not: 'CRITICAL', // Keep critical logs longer
        },
      },
    });
  }
}
