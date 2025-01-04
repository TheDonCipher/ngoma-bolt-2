"use client";

import { useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { usePlayerStore } from "@/lib/store/use-player-store";
import { useBadgeService } from "@/lib/services/badge.service";
import { useToast } from "@/hooks/use-toast";

export function useBadgeTracking() {
  const address = useAddress();
  const { currentTrack, playbackProgress } = usePlayerStore();
  const { trackProgress } = useBadgeService();
  const { toast } = useToast();

  // Track listening progress
  useEffect(() => {
    if (!address || !currentTrack) return;

    let trackingInterval: NodeJS.Timeout;

    const trackListening = async () => {
      try {
        if (playbackProgress > 0.9) { // Track completed
          await trackProgress(address, "LISTENER", 1);
        }
      } catch (error) {
        console.error("Error tracking listening progress:", error);
        toast({
          title: "Error",
          description: "Failed to track listening progress",
          variant: "destructive",
        });
      }
    };

    if (playbackProgress > 0) {
      trackingInterval = setInterval(trackListening, 1000);
    }

    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    };
  }, [address, currentTrack, playbackProgress, trackProgress, toast]);

  return null;
}
