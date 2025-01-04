"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/lib/store/use-player-store";
import { Play, Pause, Plus } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { formatEther } from "ethers/lib/utils";
import { mockAlbumData } from "@/lib/mock-data";

export function TrendingSongs() {
  const [hoveredTrackId, setHoveredTrackId] = useState<string | null>(null);
  const { 
    currentTrack, 
    isPlaying, 
    setTrack, 
    setIsPlaying,
    addToPlaylist 
  } = usePlayerStore();

  const tracks = mockAlbumData.tracks;

  const handlePlay = (track: typeof tracks[0]) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setTrack(track);
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Trending Songs</h2>
          <p className="text-muted-foreground">
            Most popular tracks this week
          </p>
        </div>
      </div>

      <Card className="divide-y divide-border">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            onMouseEnter={() => setHoveredTrackId(track.id)}
            onMouseLeave={() => setHoveredTrackId(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => handlePlay(track)}
            >
              {currentTrack?.id === track.id && isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{track.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {track.artist.name}
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              {formatDuration(track.duration)}
            </div>

            <div className="text-sm font-medium">
              {formatEther(track.price)} ETH
            </div>

            {hoveredTrackId === track.id && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addToPlaylist(track)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </Card>
    </section>
  );
}
