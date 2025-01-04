import { IsString, IsNumber, IsArray, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDateString()
  releaseDate: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  trackTokenIds: string[];

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(10)
  royaltyFee: number;
}
