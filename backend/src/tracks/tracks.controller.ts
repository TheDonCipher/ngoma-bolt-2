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
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';

@ApiTags('tracks')
@Controller('tracks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post('mint')
  @Roles('ARTIST')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Mint a new track NFT' })
  async mintTrack(
    @UploadedFile() file: Express.Multer.File,
    @Body() createTrackDto: CreateTrackDto,
  ) {
    return this.tracksService.mintTrackNFT(
      createTrackDto,
      file.buffer,
      // Note: In a real implementation, you'd get the signer from the user's wallet
    );
  }

  @Post(':tokenId/purchase')
  @Roles('FAN')
  @ApiOperation({ summary: 'Purchase a track NFT' })
  async purchaseTrack(@Param('tokenId') tokenId: string) {
    return this.tracksService.purchaseTrack(
      tokenId,
      // Note: In a real implementation, you'd get the signer from the user's wallet
    );
  }

  @Post('royalties/withdraw')
  @Roles('ARTIST')
  @ApiOperation({ summary: 'Withdraw accumulated royalties' })
  async withdrawRoyalties() {
    return this.tracksService.withdrawRoyalties(
      // Note: In a real implementation, you'd get the signer from the user's wallet
    );
  }
}
