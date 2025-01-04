import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MerchandiseService } from './merchandise.service';
import { CreateMerchandiseDto } from './dto/create-merchandise.dto';
import { UpdateMerchandiseDto } from './dto/update-merchandise.dto';

@ApiTags('merchandise')
@Controller('merchandise')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}

  @Post()
  @Roles('ARTIST')
  @ApiOperation({ summary: 'Create new merchandise' })
  async createMerchandise(@Body() createMerchandiseDto: CreateMerchandiseDto) {
    return this.merchandiseService.createMerchandise(createMerchandiseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all merchandise' })
  async getMerchandise(
    @Query('type') type?: string,
    @Query('artistId') artistId?: string,
  ) {
    return this.merchandiseService.getMerchandise(type, artistId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get merchandise by id' })
  async getMerchandiseById(@Param('id') id: string) {
    return this.merchandiseService.getMerchandiseById(id);
  }

  @Put(':id')
  @Roles('ARTIST')
  @ApiOperation({ summary: 'Update merchandise' })
  async updateMerchandise(
    @Param('id') id: string,
    @Body() updateMerchandiseDto: UpdateMerchandiseDto,
  ) {
    return this.merchandiseService.updateMerchandise(id, updateMerchandiseDto);
  }

  @Delete(':id')
  @Roles('ARTIST')
  @ApiOperation({ summary: 'Delete merchandise' })
  async deleteMerchandise(@Param('id') id: string) {
    return this.merchandiseService.deleteMerchandise(id);
  }

  @Post(':id/purchase')
  @ApiOperation({ summary: 'Purchase merchandise' })
  async purchaseMerchandise(@Param('id') id: string) {
    return this.merchandiseService.purchaseMerchandise(id);
  }
}
