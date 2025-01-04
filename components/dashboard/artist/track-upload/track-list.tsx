"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Play, Pause, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDuration } from "@/lib/utils";
import { formatEther } from "ethers/lib/utils";
import { usePlayerStore } from "@/lib/store/use-player-store";
import { mockAlbumData } from "@/lib/mock-data";

export function TrackList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { currentTrack, isPlaying, setTrack, setIsPlaying } = usePlayerStore();

  const tracks = mockAlbumData.tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlay = (track: typeof tracks[0]) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setTrack(track);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <Card className="divide-y divide-border">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
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
                {formatDuration(track.duration)}
              </p>
            </div>

            <div className="text-sm font-medium">
              {formatEther(track.price)} ETH
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Track</DropdownMenuItem>
                <DropdownMenuItem>View Analytics</DropdownMenuItem>
                <DropdownMenuItem>Manage Royalties</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete Track
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </Card>
    </div>
  );
}
