import { IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty()
  @IsBoolean()
  emailNotifications: boolean;

  @ApiProperty()
  @IsBoolean()
  pushNotifications: boolean;

  @ApiProperty()
  @IsObject()
  privacySettings: {
    profileVisibility: 'public' | 'followers' | 'private';
    showActivity: boolean;
    showCollection: boolean;
  };
}
