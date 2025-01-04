import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { WebsocketService } from '../websocket/websocket.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
    private websocket: WebsocketService,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const event = await this.prisma.event.create({
      data: createEventDto,
    });

    // Invalidate cache
    await this.cache.invalidate('events:*');

    // Notify followers
    this.websocket.emit('event:created', event);

    return event;
  }

  async getEvents(type?: string, artistId?: string) {
    const cacheKey = `events:${type || 'all'}:${artistId || 'all'}`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const events = await this.prisma.event.findMany({
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
        startDate: 'asc',
      },
    });

    await this.cache.set(cacheKey, events, 300); // Cache for 5 minutes
    return events;
  }

  async getEvent(id: string): Promise<Event> {
    const cacheKey = `event:${id}`;
    const cached = await this.cache.get<Event>(cacheKey);

    if (cached) {
      return cached;
    }

    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        artist: {
          include: {
            user: true,
          },
        },
      },
    });

    if (event) {
      await this.cache.set(cacheKey, event, 300); // Cache for 5 minutes
    }

    return event;
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });

    // Invalidate cache
    await this.cache.invalidate(`event:${id}`);
    await this.cache.invalidate('events:*');

    // Notify registered users
    this.websocket.emit('event:updated', event);

    return event;
  }

  async deleteEvent(id: string): Promise<Event> {
    const event = await this.prisma.event.delete({
      where: { id },
    });

    // Invalidate cache
    await this.cache.invalidate(`event:${id}`);
    await this.cache.invalidate('events:*');

    // Notify registered users
    this.websocket.emit('event:deleted', event);

    return event;
  }

  async registerForEvent(id: string): Promise<Event> {
    // Implementation for event registration
    // This would involve creating a registration record
    // and potentially minting an event ticket NFT
    return null;
  }
}
