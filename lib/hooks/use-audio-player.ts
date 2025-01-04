"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/lib/store/use-player-store";
import Hls from "hls.js";
import { useContract } from "@thirdweb-dev/react";
import { MUSIC_NFT_CONTRACT_ADDRESS } from "@/lib/constants";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const {
    currentTrack,
    isPlaying,
    volume,
    setPlaybackProgress,
    playNext,
  } = usePlayerStore();
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract(MUSIC_NFT_CONTRACT_ADDRESS);

  // Check if user owns the NFT
  const checkOwnership = async (trackId: string) => {
    try {
      const balance = await contract?.erc721.balanceOf(trackId);
      return balance?.gt(0);
    } catch (error) {
      console.error("Error checking NFT ownership:", error);
      return false;
    }
  };

  useEffect(() => {
    if (!currentTrack) return;

    const setupAudio = async () => {
      const hasAccess = await checkOwnership(currentTrack.id);
      if (!hasAccess) {
        setError("You need to own this NFT to play the full track");
        return;
      }

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;

      // Clean up existing HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      // Setup HLS if the source is an m3u8 stream
      if (currentTrack.previewUrl.includes('.m3u8')) {
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsRef.current = hls;

          hls.loadSource(currentTrack.previewUrl);
          hls.attachMedia(audio);

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              setError("Error loading stream");
            }
          });
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
          // For Safari
          audio.src = currentTrack.previewUrl;
        }
      } else {
        // Regular audio file
        audio.src = currentTrack.previewUrl;
      }

      audio.volume = volume;
      
      if (isPlaying) {
        try {
          await audio.play();
        } catch (error) {
          console.error("Playback error:", error);
        }
      }

      // Event listeners
      audio.addEventListener('waiting', () => setIsBuffering(true));
      audio.addEventListener('playing', () => setIsBuffering(false));
      audio.addEventListener('timeupdate', () => {
        setPlaybackProgress(audio.currentTime / audio.duration);
      });
      audio.addEventListener('ended', () => {
        playNext();
      });
    };

    setupAudio();

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (audioRef.current) {
        audioRef.current.remove();
      }
    };
  }, [currentTrack?.id]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  return {
    isBuffering,
    error,
    audioRef,
  };
}
