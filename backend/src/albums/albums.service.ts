import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { Album } from '@prisma/client';

@Injectable()
export class AlbumsService {
  private ipfs;
  private provider;
  private albumContract;

  constructor(
    private prisma: PrismaService,
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
    
    this.albumContract = new ethers.Contract(
      this.config.get('ALBUM_NFT_CONTRACT_ADDRESS'),
      AlbumNFTAbi,
      this.provider,
    );
  }

  async uploadAlbumToIPFS(
    coverImage: Buffer,
    metadata: any,
  ): Promise<string> {
    // Upload cover image to IPFS
    const imageResult = await this.ipfs.add(coverImage);
    
    // Create metadata with IPFS image link
    const metadataWithImage = {
      ...metadata,
      image: `ipfs://${imageResult.path}`,
    };
    
    // Upload metadata to IPFS
    const metadataResult = await this.ipfs.add(JSON.stringify(metadataWithImage));
    
    return `ipfs://${metadataResult.path}`;
  }

  async mintAlbumNFT(
    album: Album,
    trackTokenIds: string[],
    coverImage: Buffer,
    signer: ethers.Signer,
  ): Promise<string> {
    // Upload album metadata to IPFS
    const metadata = {
      name: album.title,
      description: album.description,
      artist: album.artistId,
      releaseDate: album.releaseDate,
      tracks: trackTokenIds,
    };

    const ipfsUri = await this.uploadAlbumToIPFS(coverImage, metadata);

    // Connect contract with signer
    const contractWithSigner = this.albumContract.connect(signer);

    // Convert track token IDs to numbers
    const trackTokenIdsNum = trackTokenIds.map(id => parseInt(id));

    // Mint Album NFT
    const tx = await contractWithSigner.mintAlbum(
      ipfsUri,
      trackTokenIdsNum,
      ethers.utils.parseEther(album.price.toString()),
      album.royaltyFee * 100, // Convert percentage to basis points
    );

    const receipt = await tx.wait();
    const event = receipt.events.find(e => e.event === 'AlbumMinted');
    const tokenId = event.args.tokenId.toString();

    // Update album in database with NFT details
    await this.prisma.album.update({
      where: { id: album.id },
      data: {
        nft: {
          create: {
            tokenId,
            ipfsUrl: ipfsUri,
            price: album.price,
            royaltyFee: album.royaltyFee,
          },
        },
      },
    });

    return tokenId;
  }

  async purchaseAlbum(
    tokenId: string,
    buyer: ethers.Signer,
  ): Promise<ethers.ContractReceipt> {
    const album = await this.prisma.nFT.findUnique({
      where: { tokenId },
      include: { album: true },
    });

    const contractWithSigner = this.albumContract.connect(buyer);
    const tx = await contractWithSigner.purchaseAlbum(tokenId, {
      value: ethers.utils.parseEther(album.price.toString()),
    });

    return tx.wait();
  }

  async withdrawRoyalties(artist: ethers.Signer): Promise<ethers.ContractReceipt> {
    const contractWithSigner = this.albumContract.connect(artist);
    const tx = await contractWithSigner.withdrawRoyalties();
    return tx.wait();
  }
}
