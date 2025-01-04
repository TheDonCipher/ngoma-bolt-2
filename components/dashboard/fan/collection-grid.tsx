"use client";

import { useState } from "react";
import { Track } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { formatEther } from "ethers/lib/utils";

interface CollectionGridProps {
  tracks: Track[];
}

export function CollectionGrid({ tracks }: CollectionGridProps) {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const handlePlay = (trackId: string) => {
    setPlayingTrackId(playingTrackId === trackId ? null : trackId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tracks.map((track) => (
        <Card key={track.id} className="p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
              onClick={() => handlePlay(track.id)}
            >
              {playingTrackId === track.id ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </Button>
            <div className="flex-1">
              <p className="font-medium">{track.title}</p>
              <p className="text-sm text-muted-foreground">
                {track.artist.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {formatEther(track.price)} ETH
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDuration(track.duration)}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
