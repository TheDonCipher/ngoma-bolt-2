import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles('ARTIST')
  @ApiOperation({ summary: 'Create new event' })
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  async getEvents(
    @Query('type') type?: string,
    @Query('artistId') artistId?: string,
  ) {
    return this.eventsService.getEvents(type, artistId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  async getEvent(@Param('id') id: string) {
    return this.eventsService.getEvent(id);
  }

  @Put(':id')
  @Roles('ARTIST')
  @ApiOperation({ summary: 'Update event' })
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  @Roles('ARTIST')
  @ApiOperation({ summary: 'Delete event' })
  async deleteEvent(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }

  @Post(':id/register')
  @ApiOperation({ summary: 'Register for event' })
  async registerForEvent(@Param('id') id: string) {
    return this.eventsService.registerForEvent(id);
  }
}
