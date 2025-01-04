import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { ConfigService } from '@nestjs/config';
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { Track } from '@prisma/client';

@Injectable()
export class TracksService {
  private ipfs;
  private provider;
  private contract;

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
    private config: ConfigService,
  ) {
    this.ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    });

    this.provider = new ethers.providers.JsonRpcProvider(
      this.config.get('ETHEREUM_RPC_URL'),
    );
    
    this.contract = new ethers.Contract(
      this.config.get('MUSIC_NFT_CONTRACT_ADDRESS'),
      MusicNFTAbi,
      this.provider,
    );
  }

  async getTrack(id: string): Promise<Track | null> {
    const cacheKey = this.cache.generateKey('track', id);
    const cachedTrack = await this.cache.get<Track>(cacheKey);
    
    if (cachedTrack) {
      return cachedTrack;
    }

    const track = await this.prisma.track.findUnique({
      where: { id },
      include: {
        artist: true,
        nft: true,
      },
    });

    if (track) {
      await this.cache.set(cacheKey, track);
    }

    return track;
  }

  async uploadToIPFS(file: Buffer, metadata: any): Promise<string> {
    const fileResult = await this.ipfs.add(file);
    
    const metadataWithFile = {
      ...metadata,
      file: `ipfs://${fileResult.path}`,
    };
    
    const metadataResult = await this.ipfs.add(JSON.stringify(metadataWithFile));
    
    return `ipfs://${metadataResult.path}`;
  }

  async mintTrackNFT(
    track: Track,
    file: Buffer,
    signer: ethers.Signer,
  ): Promise<string> {
    const metadata = {
      name: track.title,
      description: track.description,
      artist: track.artistId,
      duration: track.duration,
      genre: track.genre,
    };

    const ipfsUri = await this.uploadToIPFS(file, metadata);
    const contractWithSigner = this.contract.connect(signer);

    const tx = await contractWithSigner.mintTrack(
      ipfsUri,
      ethers.utils.parseEther(track.price.toString()),
      track.royaltyFee * 100,
    );

    const receipt = await tx.wait();
    const event = receipt.events.find(e => e.event === 'TrackMinted');
    const tokenId = event.args.tokenId.toString();

    // Invalidate cache after minting
    await this.cache.invalidatePattern(`track:${track.id}*`);

    return tokenId;
  }
}
