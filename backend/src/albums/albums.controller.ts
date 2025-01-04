import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@ApiTags('albums')
@Controller('albums')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post('mint')
  @Roles('ARTIST')
  @UseInterceptors(FileInterceptor('coverImage'))
  @ApiOperation({ summary: 'Mint a new album NFT' })
  async mintAlbum(
    @UploadedFile() coverImage: Express.Multer.File,
    @Body() createAlbumDto: CreateAlbumDto,
  ) {
    return this.albumsService.mintAlbumNFT(
      createAlbumDto,
      createAlbumDto.trackTokenIds,
      coverImage.buffer,
      // Note: In a real implementation, you'd get the signer from the user's wallet
    );
  }

  @Post(':tokenId/purchase')
  @Roles('FAN')
  @ApiOperation({ summary: 'Purchase an album NFT' })
  async purchaseAlbum(@Param('tokenId') tokenId: string) {
    return this.albumsService.purchaseAlbum(
      tokenId,
      // Note: In a real implementation, you'd get the signer from the user's wallet
    );
  }

  @Post('royalties/withdraw')
  @Roles('ARTIST')
  @ApiOperation({ summary: 'Withdraw accumulated album royalties' })
  async withdrawRoyalties() {
    return this.albumsService.withdrawRoyalties(
      // Note: In a real implementation, you'd get the signer from the user's wallet
    );
  }
}
