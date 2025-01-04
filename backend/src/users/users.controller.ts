import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':address')
  @ApiOperation({ summary: 'Get user profile' })
  async getUser(@Param('address') address: string) {
    return this.usersService.getUser(address);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':address')
  @ApiOperation({ summary: 'Update user profile' })
  async updateUser(
    @Param('address') address: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(address, updateUserDto);
  }

  @Get(':address/nfts')
  @ApiOperation({ summary: 'Get user NFTs' })
  async getUserNFTs(@Param('address') address: string) {
    return this.usersService.getUserNFTs(address);
  }

  @Get(':address/following')
  @ApiOperation({ summary: 'Get artists followed by user' })
  async getFollowing(@Param('address') address: string) {
    return this.usersService.getFollowing(address);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users' })
  async searchUsers(
    @Query('query') query: string,
    @Query('role') role?: string,
  ) {
    return this.usersService.searchUsers(query, role);
  }
}
