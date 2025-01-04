import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BadgesService } from './badges.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@ApiTags('badges')
@Controller('badges')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get('user/:address')
  @ApiOperation({ summary: 'Get user badges' })
  async getUserBadges(@Param('address') address: string) {
    return this.badgesService.getUserBadges(address);
  }

  @Get('progress/:address')
  @ApiOperation({ summary: 'Get user badge progress' })
  async getUserProgress(
    @Param('address') address: string,
    @Query('type') type: string,
  ) {
    return this.badgesService.getUserProgress(address, type);
  }

  @Post('progress/update')
  @ApiOperation({ summary: 'Update badge progress' })
  async updateProgress(@Body() updateProgressDto: UpdateProgressDto) {
    return this.badgesService.updateProgress(updateProgressDto);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get badge leaderboard' })
  async getLeaderboard(@Query('type') type: string) {
    return this.badgesService.getLeaderboard(type);
  }
}
