import { IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProgressDto {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({ enum: ['COLLECTOR', 'LISTENER', 'SPECIAL'] })
  @IsEnum(['COLLECTOR', 'LISTENER', 'SPECIAL'])
  type: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}
