import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketService } from '../websocket/websocket.service';
import { CacheService } from '../cache/cache.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { SearchAuditLogsDto } from './dto/search-audit-logs.dto';
import { AuditLog } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(
    private prisma: PrismaService,
    private websocket: WebsocketService,
    private cache: CacheService,
  ) {}

  async createLog(dto: CreateAuditLogDto): Promise<AuditLog> {
    const log = await this.prisma.auditLog.create({
      data: {
        userId: dto.userId,
        action: dto.action,
        category: dto.category,
        severity: dto.severity,
        details: dto.details,
        ipAddress: dto.ipAddress,
        status: dto.status,
        errorMessage: dto.errorMessage,
      },
    });

    // Notify admins of critical events in real-time
    if (dto.severity === 'CRITICAL') {
      this.websocket.notifyAdmins('audit:critical', log);
    }

    // Invalidate cache
    await this.cache.invalidate('audit:logs:*');

    return log;
  }

  async searchLogs(dto: SearchAuditLogsDto) {
    const cacheKey = `audit:logs:${JSON.stringify(dto)}`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const where: any = {};

    if (dto.startDate) {
      where.timestamp = {
        gte: new Date(dto.startDate),
      };
    }

    if (dto.endDate) {
      where.timestamp = {
        ...where.timestamp,
        lte: new Date(dto.endDate),
      };
    }

    if (dto.userId) {
      where.userId = dto.userId;
    }

    if (dto.action) {
      where.action = dto.action;
    }

    if (dto.category) {
      where.category = dto.category;
    }

    if (dto.severity) {
      where.severity = dto.severity;
    }

    if (dto.status) {
      where.status = dto.status;
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (dto.page - 1) * dto.limit,
        take: dto.limit,
        include: {
          user: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    const result = {
      items: logs,
      total,
      page: dto.page,
      pageSize: dto.limit,
      hasMore: (dto.page * dto.limit) < total,
    };

    await this.cache.set(cacheKey, result, 300); // Cache for 5 minutes
    return result;
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

    await this.cache.invalidate('audit:logs:*');
  }

  async exportLogs(format: 'CSV' | 'JSON', filters: SearchAuditLogsDto) {
    const logs = await this.searchLogs({
      ...filters,
      page: 1,
      limit: 1000, // Increased limit for exports
    });

    switch (format) {
      case 'CSV':
        return this.generateCSV(logs.items);
      case 'JSON':
        return JSON.stringify(logs.items, null, 2);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private generateCSV(logs: AuditLog[]): string {
    const headers = [
      'Timestamp',
      'User',
      'Action',
      'Category',
      'Severity',
      'Status',
      'IP Address',
      'Details',
    ].join(',');

    const rows = logs.map(log => [
      log.timestamp.toISOString(),
      log.userId,
      log.action,
      log.category,
      log.severity,
      log.status,
      log.ipAddress,
      JSON.stringify(log.details).replace(/,/g, ';'),
    ].join(','));

    return [headers, ...rows].join('\n');
  }
}
