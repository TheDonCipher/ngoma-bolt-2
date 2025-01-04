import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('nonce')
  @ApiOperation({ summary: 'Get nonce for wallet authentication' })
  getNonce(@Query('address') address: string) {
    return this.authService.getNonce(address);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify signed message and authenticate' })
  verify(
    @Body('message') message: string,
    @Body('signature') signature: string,
  ) {
    return this.authService.verify(message, signature);
  }
}
