"use client";

import { ReactNode, useEffect } from "react";
import { usePlayerStore } from "@/lib/store/use-player-store";
import { useAudioPlayer } from "@/lib/hooks/use-audio-player";

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const { currentTrack } = usePlayerStore();
  const { error } = useAudioPlayer();

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Audio playback error:", error);
    }
  }, [error]);

  return <>{children}</>;
}
