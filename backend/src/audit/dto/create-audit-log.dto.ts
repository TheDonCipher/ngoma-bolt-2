import { IsString, IsEnum, IsObject, IsOptional, IsIP } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuditAction, AuditCategory, AuditSeverity } from '@prisma/client';

export class CreateAuditLogDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ enum: AuditAction })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({ enum: AuditCategory })
  @IsEnum(AuditCategory)
  category: AuditCategory;

  @ApiProperty({ enum: AuditSeverity })
  @IsEnum(AuditSeverity)
  severity: AuditSeverity;

  @ApiProperty()
  @IsObject()
  details: Record<string, any>;

  @ApiProperty()
  @IsIP()
  ipAddress: string;

  @ApiProperty({ enum: ['SUCCESS', 'FAILURE'] })
  @IsEnum(['SUCCESS', 'FAILURE'])
  status: 'SUCCESS' | 'FAILURE';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  errorMessage?: string;
}
