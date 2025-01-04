"use client";

import Image from "next/image";
import { PlayCircle, PauseCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Artist } from "@/lib/types";

interface ArtistCardProps {
  artist: Artist;
  isPlaying: boolean;
  onPlay: () => void;
}

export function ArtistCard({ artist, isPlaying, onPlay }: ArtistCardProps) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-square">
        <Image
          src={artist.image}
          alt={artist.name}
          fill
          className="object-cover"
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onPlay}
        >
          {isPlaying ? (
            <PauseCircle className="w-6 h-6" />
          ) : (
            <PlayCircle className="w-6 h-6" />
          )}
        </Button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{artist.name}</h3>
        <p className="text-muted-foreground text-sm mb-3">{artist.genre}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {artist.totalTracks} tracks
          </span>
          <span className="text-sm font-medium text-primary">
            Floor: {artist.floorPrice} ETH
          </span>
        </div>
      </div>
    </Card>
  );
}
