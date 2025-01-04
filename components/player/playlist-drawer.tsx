"use client";

import { usePlayerStore } from "@/lib/store/use-player-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ListMusic, Play, Pause, X } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export function PlaylistDrawer() {
  const { 
    playlist,
    currentTrack,
    isPlaying,
    setTrack,
    removeFromPlaylist
  } = usePlayerStore();

  if (playlist.length === 0) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ListMusic className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Current Playlist</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {playlist.map((track) => (
            <div
              key={track.id}
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 ${
                currentTrack?.id === track.id ? "bg-muted" : ""
              }`}
            >
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => setTrack(track)}
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromPlaylist(track.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
