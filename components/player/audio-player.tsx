"use client";

    import { useAudioPlayer } from "@/lib/hooks/use-audio-player";
    import { usePlayerStore } from "@/lib/store/use-player-store";
    import { Button } from "@/components/ui/button";
    import { Slider } from "@/components/ui/slider";
    import { 
      Play, 
      Pause, 
      SkipBack, 
      SkipForward, 
      Volume2,
      VolumeX,
      Repeat,
      Shuffle,
      Music
    } from "lucide-react";
    import { formatDuration } from "@/lib/utils";
    import Image from "next/image";

    export function AudioPlayer() {
      const { 
        currentTrack,
        isPlaying,
        volume,
        playbackProgress,
        isShuffled,
        repeatMode,
        setIsPlaying,
        setVolume,
        toggleShuffle,
        setRepeatMode,
        playNext,
        playPrevious,
        error,
        setError,
      } = usePlayerStore();

      const { isBuffering, audioRef } = useAudioPlayer();

      if (!currentTrack) return null;

      return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Track Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                  <Image
                    src={currentTrack.artist.image}
                    alt={currentTrack.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{currentTrack.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentTrack.artist.name}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleShuffle}
                    className={isShuffled ? "text-primary" : "text-muted-foreground"}
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={playPrevious}
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={!!error}
                  >
                    {isBuffering ? (
                      <Music className="w-5 h-5 animate-pulse" />
                    ) : isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={playNext}
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRepeatMode(
                      repeatMode === "none" ? "playlist" :
                      repeatMode === "playlist" ? "track" : "none"
                    )}
                    className={repeatMode !== "none" ? "text-primary" : "text-muted-foreground"}
                  >
                    <Repeat className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full max-w-md flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {formatDuration(playbackProgress * currentTrack.duration)}
                  </span>
                  <Slider
                    value={[playbackProgress * 100]}
                    max={100}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-10">
                    {formatDuration(currentTrack.duration)}
                  </span>
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 flex-1 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVolume(volume === 0 ? 1 : 0)}
                >
                  {volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolume(value[0] / 100)}
                  className="w-24"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center mt-2">
                {error}
              </p>
            )}
          </div>
        </div>
      );
    }
