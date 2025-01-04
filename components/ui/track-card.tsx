"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Track } from "@/lib/types";
import { Play, Pause, Heart, Share2, MoreHorizontal } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { formatEther } from "ethers/lib/utils";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlayerStore } from "@/lib/store/use-player-store";
import { useToast } from "@/hooks/use-toast";

interface TrackCardProps {
  track: Track;
  showArtist?: boolean;
}

export function TrackCard({ track, showArtist = true }: TrackCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { currentTrack, isPlaying, setTrack, setIsPlaying } = usePlayerStore();
  const { toast } = useToast();

  const handlePlay = () => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setTrack(track);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: track.title,
        text: `Check out ${track.title} by ${track.artist.name}`,
        url: `/tracks/${track.id}`,
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not share track",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="relative aspect-square w-16 h-16 rounded-lg overflow-hidden">
          <Image
            src={track.artist.image}
            alt={track.title}
            fill
            className="object-cover"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute inset-0 m-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handlePlay}
          >
            {currentTrack?.id === track.id && isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </Button>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{track.title}</h3>
          {showArtist && (
            <p className="text-sm text-muted-foreground truncate">
              {track.artist.name}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>{formatDuration(track.duration)}</span>
            <span>•</span>
            <span>{formatEther(track.price)} ETH</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={isLiked ? "text-primary" : "text-muted-foreground"}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
              <DropdownMenuItem>View Artist</DropdownMenuItem>
              <DropdownMenuItem>View on Explorer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
