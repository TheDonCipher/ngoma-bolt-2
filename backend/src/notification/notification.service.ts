import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketService } from '../websocket/websocket.service';
import { EmailService } from '../email/email.service';
import { CacheService } from '../cache/cache.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { NotificationType, NotificationPriority } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private websocket: WebsocketService,
    private email: EmailService,
    private cache: CacheService,
  ) {}

  async createNotification(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        priority: dto.priority,
        metadata: dto.metadata,
      },
    });

    // Send real-time notification via WebSocket
    this.websocket.emitToUser(dto.userId, 'notification:new', notification);

    // Check user preferences for email notifications
    const preferences = await this.prisma.notificationPreferences.findUnique({
      where: { userId: dto.userId },
    });

    if (
      preferences?.email.enabled &&
      preferences.email.types.includes(dto.type) &&
      (dto.priority === NotificationPriority.HIGH || preferences.email.frequency === 'INSTANT')
    ) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });

      if (user?.email) {
        await this.email.sendNotificationEmail(
          user.email,
          dto.title,
          dto.message,
        );
      }
    }

    // Invalidate cache
    await this.cache.invalidate(`notifications:${dto.userId}`);

    return notification;
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const cacheKey = `notifications:${userId}:${page}:${limit}`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({
        where: { userId },
      }),
    ]);

    const result = {
      items: notifications,
      total,
      page,
      pageSize: limit,
      hasMore: (page * limit) < total,
    };

    await this.cache.set(cacheKey, result, 300); // Cache for 5 minutes
    return result;
  }

  async markAsRead(userId: string, notificationId: string) {
    await this.prisma.notification.update({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        readAt: new Date(),
      },
    });

    await this.cache.invalidate(`notifications:${userId}:*`);
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    await this.prisma.notificationPreferences.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        ...dto,
      },
    });

    await this.cache.invalidate(`preferences:${userId}`);
  }

  async getUnreadCount(userId: string): Promise<number> {
    const cacheKey = `notifications:${userId}:unread`;
    const cached = await this.cache.get<number>(cacheKey);

    if (cached !== null) {
      return cached;
    }

    const count = await this.prisma.notification.count({
      where: {
        userId,
        readAt: null,
      },
    });

    await this.cache.set(cacheKey, count, 60); // Cache for 1 minute
    return count;
  }
}
