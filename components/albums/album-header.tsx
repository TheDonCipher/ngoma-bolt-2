"use client";

import { Album } from "@/lib/types";
import Image from "next/image";
import { formatEther } from "ethers/lib/utils";
import { formatDate } from "@/lib/utils";

interface AlbumHeaderProps {
  album: Album;
}

export function AlbumHeader({ album }: AlbumHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      <div className="relative aspect-square w-full md:w-64 rounded-lg overflow-hidden">
        <Image
          src={album.coverImage}
          alt={album.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{album.title}</h1>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-lg text-muted-foreground">By {album.artist.name}</p>
          <span className="text-muted-foreground">•</span>
          <p className="text-muted-foreground">
            Released {formatDate(album.releaseDate)}
          </p>
        </div>

        <p className="text-muted-foreground mb-6">{album.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Price</p>
            <p className="text-lg font-semibold">
              {formatEther(album.price)} ETH
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Tracks</p>
            <p className="text-lg font-semibold">{album.trackCount}</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Royalty</p>
            <p className="text-lg font-semibold">{album.royaltyFee}%</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Genre</p>
            <p className="text-lg font-semibold">{album.artist.genre}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
