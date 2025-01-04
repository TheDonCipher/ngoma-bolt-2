import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WebsocketService } from '../websocket/websocket.service';
import { EmailService } from '../email/email.service';
import { NotificationType, NotificationPriority } from './types';
import { RedisService } from '../cache/redis.service';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private websocket: WebsocketService,
    private email: EmailService,
    private redis: RedisService,
  ) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    priority: NotificationPriority = 'MEDIUM',
    metadata?: Record<string, any>,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        priority,
        metadata,
        timestamp: new Date(),
      },
    });

    // Send real-time notification
    this.websocket.sendToUser(userId, 'notification:new', notification);

    // Store in Redis for quick access
    await this.redis.setex(
      `notification:${notification.id}`,
      86400, // 24 hours
      JSON.stringify(notification),
    );

    // Send email for high priority notifications
    if (priority === 'HIGH') {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.email) {
        await this.email.sendNotificationEmail(user.email, title, message);
      }
    }

    return notification;
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

    await this.redis.del(`notification:${notificationId}`);
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async updateUserPreferences(userId: string, preferences: any) {
    await this.prisma.notificationPreferences.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences,
      },
    });
  }
}
