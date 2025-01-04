import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiateRecoveryDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
