import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Ip,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RecoveryService } from './recovery.service';
import { InitiateRecoveryDto } from './dto/initiate-recovery.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth/recovery')
export class RecoveryController {
  constructor(private readonly recoveryService: RecoveryService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate password recovery' })
  async initiateRecovery(
    @Body(ValidationPipe) dto: InitiateRecoveryDto,
    @Ip() ipAddress: string,
  ) {
    await this.recoveryService.initiateRecovery(dto.email, ipAddress);
    return { message: 'If the email exists, recovery instructions have been sent' };
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate recovery token' })
  async validateToken(@Body('token') token: string) {
    const isValid = await this.recoveryService.validateToken(token);
    return { isValid };
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(
    @Body(ValidationPipe) dto: ResetPasswordDto,
    @Ip() ipAddress: string,
  ) {
    await this.recoveryService.resetPassword(dto.token, dto.newPassword, ipAddress);
    return { message: 'Password reset successfully' };
  }
}
