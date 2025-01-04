"use client";

import { useState, useEffect } from "react";
import { Track } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Play, Pause, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDuration } from "@/lib/utils";
import { formatEther } from "ethers/lib/utils";
import { mockAlbumData } from "@/lib/mock-data";

interface TrackListProps {
  artistId: string;
}

export function TrackList({ artistId }: TrackListProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  useEffect(() => {
    // Simulating API call with mock data
    setTracks(mockAlbumData.tracks);
  }, [artistId]);

  const handlePlay = (trackId: string) => {
    setPlayingTrackId(playingTrackId === trackId ? null : trackId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Tracks</h3>
      <div className="space-y-2">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-4 bg-card rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => handlePlay(track.id)}
            >
              {playingTrackId === track.id ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <div className="flex-1">
              <p className="font-medium">{track.title}</p>
              <p className="text-sm text-muted-foreground">
                {formatDuration(track.duration)}
              </p>
            </div>
            <div className="text-sm font-medium">
              {formatEther(track.price)} ETH
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Track</DropdownMenuItem>
                <DropdownMenuItem>View Analytics</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete Track
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}
