import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketService } from '../websocket/websocket.service';
import { CacheService } from '../cache/cache.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { Badge } from '@prisma/client';

@Injectable()
export class BadgesService {
  constructor(
    private prisma: PrismaService,
    private websocket: WebsocketService,
    private cache: CacheService,
  ) {}

  async getUserBadges(address: string): Promise<Badge[]> {
    const cacheKey = `badges:${address}`;
    const cached = await this.cache.get<Badge[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const badges = await this.prisma.badge.findMany({
      where: {
        user: {
          address: address.toLowerCase(),
        },
      },
      include: {
        rewards: true,
      },
    });

    await this.cache.set(cacheKey, badges, 3600); // Cache for 1 hour
    return badges;
  }

  async getUserProgress(address: string, type: string) {
    const cacheKey = `progress:${address}:${type}`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const progress = await this.prisma.badgeProgress.findFirst({
      where: {
        user: {
          address: address.toLowerCase(),
        },
        type,
      },
    });

    await this.cache.set(cacheKey, progress, 300); // Cache for 5 minutes
    return progress;
  }

  async updateProgress(dto: UpdateProgressDto) {
    const { address, type, amount } = dto;

    // Update progress
    const progress = await this.prisma.badgeProgress.upsert({
      where: {
        user_type: {
          userId: address,
          type,
        },
      },
      update: {
        currentValue: {
          increment: amount,
        },
      },
      create: {
        user: {
          connect: {
            address: address.toLowerCase(),
          },
        },
        type,
        currentValue: amount,
      },
    });

    // Check for badge unlocks
    await this.checkBadgeUnlocks(address, type, progress.currentValue);

    // Invalidate cache
    await this.cache.invalidate(`progress:${address}:${type}`);
    await this.cache.invalidate(`badges:${address}`);

    return progress;
  }

  async getLeaderboard(type: string) {
    const cacheKey = `leaderboard:${type}`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const leaderboard = await this.prisma.badgeProgress.findMany({
      where: { type },
      orderBy: { currentValue: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            address: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    await this.cache.set(cacheKey, leaderboard, 300); // Cache for 5 minutes
    return leaderboard;
  }

  private async checkBadgeUnlocks(
    address: string,
    type: string,
    currentValue: number,
  ) {
    const thresholds = {
      COLLECTOR: [5, 15, 30, 50],
      LISTENER: [200, 500, 1000, 2000],
      SPECIAL: [1, 3, 5, 10],
    };

    const nextThreshold = thresholds[type].find(t => t > currentValue);
    if (!nextThreshold) return;

    // Check if badge should be unlocked
    const shouldUnlock = currentValue >= nextThreshold;
    if (!shouldUnlock) return;

    // Create badge
    const badge = await this.prisma.badge.create({
      data: {
        user: {
          connect: {
            address: address.toLowerCase(),
          },
        },
        type,
        level: this.getBadgeLevel(type, currentValue),
        unlockedAt: new Date(),
      },
    });

    // Notify user
    this.websocket.emitToUser(address, 'badge:unlocked', badge);
  }

  private getBadgeLevel(type: string, value: number): string {
    const levels = {
      COLLECTOR: {
        5: 'bronze',
        15: 'silver',
        30: 'gold',
        50: 'platinum',
      },
      LISTENER: {
        200: 'bronze',
        500: 'silver',
        1000: 'gold',
        2000: 'platinum',
      },
      SPECIAL: {
        1: 'bronze',
        3: 'silver',
        5: 'gold',
        10: 'platinum',
      },
    };

    const thresholds = Object.keys(levels[type])
      .map(Number)
      .sort((a, b) => b - a);

    for (const threshold of thresholds) {
      if (value >= threshold) {
        return levels[type][threshold];
      }
    }

    return 'bronze';
  }
}
