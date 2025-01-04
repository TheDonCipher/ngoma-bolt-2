import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfile } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async getProfile(userId: string): Promise<UserProfile> {
    const cacheKey = `profile:${userId}`;
    const cached = await this.cache.get<UserProfile>(cacheKey);

    if (cached) {
      return cached;
    }

    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        preferences: true,
        socialLinks: true,
      },
    });

    if (profile) {
      await this.cache.set(cacheKey, profile, 3600); // Cache for 1 hour
    }

    return profile;
  }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.update({
      where: { userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        preferences: true,
        socialLinks: true,
      },
    });

    await this.cache.invalidate(`profile:${userId}`);
    return profile;
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.update({
      where: { userId },
      data: {
        avatarUrl,
        updatedAt: new Date(),
      },
    });

    await this.cache.invalidate(`profile:${userId}`);
    return profile;
  }

  async updatePrivacySettings(userId: string, settings: any): Promise<void> {
    await this.prisma.userPreferences.update({
      where: { userId },
      data: {
        privacySettings: settings,
        updatedAt: new Date(),
      },
    });

    await this.cache.invalidate(`profile:${userId}`);
  }
}
