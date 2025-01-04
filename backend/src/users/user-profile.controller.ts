import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserProfileService } from './user-profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Request } from 'express';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserProfileController {
  constructor(private readonly profileService: UserProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Req() req: Request) {
    return this.profileService.getProfile(req.user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @Req() req: Request,
    @Body(ValidationPipe) dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(
      req.user.id,
      dto,
      req.ip,
    );
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update user settings' })
  async updateSettings(
    @Req() req: Request,
    @Body(ValidationPipe) dto: UpdateSettingsDto,
  ) {
    return this.profileService.updateSettings(
      req.user.id,
      dto,
      req.ip,
    );
  }

  @Put('avatar')
  @ApiOperation({ summary: 'Upload user avatar' })
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.uploadAvatar(req.user.id, file);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user account' })
  async deleteAccount(@Req() req: Request) {
    return this.profileService.deleteAccount(req.user.id, req.ip);
  }
}
