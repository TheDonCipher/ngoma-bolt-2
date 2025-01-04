"use client";

import { Album } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Share2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { formatEther } from "ethers/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AlbumCardProps {
  album: Album;
  onPlay?: () => void;
  isPlaying?: boolean;
}

export function AlbumCard({ album, onPlay, isPlaying }: AlbumCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: album.title,
        text: `Check out ${album.title} by ${album.artist.name}`,
        url: `/albums/${album.id}`,
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not share album",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      className="group relative overflow-hidden bg-card hover:bg-muted/50 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square relative">
        <Image
          src={album.coverImage}
          alt={album.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-black/60 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full w-16 h-16"
              onClick={onPlay}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1">{album.title}</h3>
            <p className="text-muted-foreground text-sm">{album.artist.name}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">Price:</span>{" "}
            <span className="font-medium">
              {formatEther(album.price)} ETH
            </span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Tracks:</span>{" "}
            <span className="font-medium">{album.trackCount}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
