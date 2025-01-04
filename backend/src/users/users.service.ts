import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async getUser(address: string): Promise<User> {
    const cacheKey = `user:${address}`;
    const cached = await this.cache.get<User>(cacheKey);

    if (cached) {
      return cached;
    }

    const user = await this.prisma.user.findUnique({
      where: { address: address.toLowerCase() },
      include: {
        artistProfile: true,
        followedArtists: true,
        achievements: true,
        ownedNFTs: true,
      },
    });

    if (user) {
      await this.cache.set(cacheKey, user, 3600); // Cache for 1 hour
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        address: createUserDto.address.toLowerCase(),
      },
    });

    // Invalidate cache
    await this.cache.invalidate(`user:${user.address}`);

    return user;
  }

  async updateUser(address: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { address: address.toLowerCase() },
      data: updateUserDto,
    });

    // Invalidate cache
    await this.cache.invalidate(`user:${address}`);

    return user;
  }

  async getUserNFTs(address: string) {
    const cacheKey = `user:${address}:nfts`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const nfts = await this.prisma.nFT.findMany({
      where: {
        owners: {
          some: {
            address: address.toLowerCase(),
          },
        },
      },
      include: {
        track: {
          include: {
            artist: true,
          },
        },
      },
    });

    await this.cache.set(cacheKey, nfts, 300); // Cache for 5 minutes
    return nfts;
  }

  async getFollowing(address: string) {
    const cacheKey = `user:${address}:following`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const following = await this.prisma.follow.findMany({
      where: {
        follower: {
          address: address.toLowerCase(),
        },
      },
      include: {
        artist: {
          include: {
            user: true,
          },
        },
      },
    });

    await this.cache.set(cacheKey, following, 300); // Cache for 5 minutes
    return following;
  }

  async searchUsers(query: string, role?: string) {
    const cacheKey = `users:search:${query}:${role || 'all'}`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const users = await this.prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { address: { contains: query, mode: 'insensitive' } },
            ],
          },
          role ? { role } : {},
        ],
      },
      include: {
        artistProfile: true,
      },
      take: 20,
    });

    await this.cache.set(cacheKey, users, 300); // Cache for 5 minutes
    return users;
  }
}
