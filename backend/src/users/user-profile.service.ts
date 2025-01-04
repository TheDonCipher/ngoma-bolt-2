import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { AuditService } from '../audit/audit.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import * as sharp from 'sharp';

@Injectable()
export class UserProfileService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
    private audit: AuditService,
  ) {}

  async getProfile(userId: string) {
    const cacheKey = `profile:${userId}`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true,
          },
        },
        preferences: true,
      },
    });

    if (profile) {
      await this.cache.set(cacheKey, profile, 3600); // Cache for 1 hour
    }

    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto, ipAddress: string) {
    const oldProfile = await this.getProfile(userId);

    const profile = await this.prisma.userProfile.update({
      where: { userId },
      data: {
        bio: dto.bio,
        avatarUrl: dto.avatarUrl,
        bannerUrl: dto.bannerUrl,
        socialLinks: dto.socialLinks,
      },
    });

    await this.audit.createLog({
      userId,
      action: 'UPDATE',
      category: 'USER',
      severity: 'LOW',
      details: {
        component: 'UserProfile',
        before: oldProfile,
        after: profile,
      },
      ipAddress,
      status: 'SUCCESS',
    });

    await this.cache.invalidate(`profile:${userId}`);
    return profile;
  }

  async updateSettings(userId: string, dto: UpdateSettingsDto, ipAddress: string) {
    const oldSettings = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    const settings = await this.prisma.userPreferences.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        ...dto,
      },
    });

    await this.audit.createLog({
      userId,
      action: 'UPDATE',
      category: 'USER',
      severity: 'LOW',
      details: {
        component: 'UserSettings',
        before: oldSettings,
        after: settings,
      },
      ipAddress,
      status: 'SUCCESS',
    });

    await this.cache.invalidate(`profile:${userId}`);
    return settings;
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const optimizedBuffer = await sharp(file.buffer)
      .resize(200, 200)
      .jpeg({ quality: 80 })
      .toBuffer();

    // In production, upload to cloud storage
    const avatarUrl = `avatars/${userId}.jpg`;

    await this.prisma.userProfile.update({
      where: { userId },
      data: { avatarUrl },
    });

    await this.cache.invalidate(`profile:${userId}`);
    return { avatarUrl };
  }

  async deleteAccount(userId: string, ipAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        preferences: true,
      },
    });

    await this.prisma.user.delete({
      where: { id: userId },
    });

    await this.audit.createLog({
      userId,
      action: 'DELETE',
      category: 'USER',
      severity: 'HIGH',
      details: {
        component: 'UserAccount',
        deletedData: user,
      },
      ipAddress,
      status: 'SUCCESS',
    });

    await this.cache.invalidate(`profile:${userId}`);
    return { success: true };
  }
}
