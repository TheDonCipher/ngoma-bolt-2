import { IsBoolean, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class UpdatePreferencesDto {
  @ApiProperty()
  @IsBoolean()
  emailEnabled: boolean;

  @ApiProperty({ enum: ['INSTANT', 'DAILY', 'WEEKLY'] })
  @IsEnum(['INSTANT', 'DAILY', 'WEEKLY'])
  emailFrequency: string;

  @ApiProperty({ type: [String], enum: NotificationType })
  @IsArray()
  @IsEnum(NotificationType, { each: true })
  emailTypes: NotificationType[];

  @ApiProperty()
  @IsBoolean()
  pushEnabled: boolean;

  @ApiProperty({ type: [String], enum: NotificationType })
  @IsArray()
  @IsEnum(NotificationType, { each: true })
  pushTypes: NotificationType[];
}
