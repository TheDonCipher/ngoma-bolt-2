import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { WebsocketService } from '../websocket/websocket.service';
import { CreateMerchandiseDto } from './dto/create-merchandise.dto';
import { UpdateMerchandiseDto } from './dto/update-merchandise.dto';
import { Merchandise } from '@prisma/client';

@Injectable()
export class MerchandiseService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
    private websocket: WebsocketService,
  ) {}

  async createMerchandise(createMerchandiseDto: CreateMerchandiseDto): Promise<Merchandise> {
    const merchandise = await this.prisma.merchandise.create({
      data: createMerchandiseDto,
    });

    // Invalidate cache
    await this.cache.invalidate('merchandise:*');

    // Notify followers
    this.websocket.emit('merchandise:created', merchandise);

    return merchandise;
  }

  async getMerchandise(type?: string, artistId?: string) {
    const cacheKey = `merchandise:${type || 'all'}:${artistId || 'all'}`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const merchandise = await this.prisma.merchandise.findMany({
      where: {
        ...(type && { type }),
        ...(artistId && { artistId }),
      },
      include: {
        artist: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await this.cache.set(cacheKey, merchandise, 300); // Cache for 5 minutes
    return merchandise;
  }

  async getMerchandiseById(id: string): Promise<Merchandise> {
    const cacheKey = `merchandise:${id}`;
    const cached = await this.cache.get<Merchandise>(cacheKey);

    if (cached) {
      return cached;
    }

    const merchandise = await this.prisma.merchandise.findUnique({
      where: { id },
      include: {
        artist: {
          include: {
            user: true,
          },
        },
      },
    });

    if (merchandise) {
      await this.cache.set(cacheKey, merchandise, 300); // Cache for 5 minutes
    }

    return merchandise;
  }

  async updateMerchandise(
    id: string,
    updateMerchandiseDto: UpdateMerchandiseDto,
  ): Promise<Merchandise> {
    const merchandise = await this.prisma.merchandise.update({
      where: { id },
      data: updateMerchandiseDto,
    });

    // Invalidate cache
    await this.cache.invalidate(`merchandise:${id}`);
    await this.cache.invalidate('merchandise:*');

    // Notify followers
    this.websocket.emit('merchandise:updated', merchandise);

    return merchandise;
  }

  async deleteMerchandise(id: string): Promise<Merchandise> {
    const merchandise = await this.prisma.merchandise.delete({
      where: { id },
    });

    // Invalidate cache
    await this.cache.invalidate(`merchandise:${id}`);
    await this.cache.invalidate('merchandise:*');

    // Notify followers
    this.websocket.emit('merchandise:deleted', merchandise);

    return merchandise;
  }

  async purchaseMerchandise(id: string): Promise<Merchandise> {
    // Implementation for merchandise purchase
    // This would involve creating a purchase record
    // and potentially minting a merchandise NFT
    return null;
  }
}
