"use client";

    import { create } from "zustand";
    import { Track } from "@/lib/types";

    interface PlayerStore {
      currentTrack: Track | null;
      isPlaying: boolean;
      volume: number;
      playlist: Track[];
      playbackProgress: number;
      isShuffled: boolean;
      repeatMode: "none" | "track" | "playlist";
      error: string | null;
      
      // Actions
      setTrack: (track: Track) => void;
      setIsPlaying: (isPlaying: boolean) => void;
      setVolume: (volume: number) => void;
      setPlaylist: (playlist: Track[]) => void;
      addToPlaylist: (track: Track) => void;
      removeFromPlaylist: (trackId: string) => void;
      setPlaybackProgress: (progress: number) => void;
      toggleShuffle: () => void;
      setRepeatMode: (mode: "none" | "track" | "playlist") => void;
      playNext: () => void;
      playPrevious: () => void;
      setError: (error: string | null) => void;
      clear: () => void;
    }

    export const usePlayerStore = create<PlayerStore>((set, get) => ({
      currentTrack: null,
      isPlaying: false,
      volume: 1,
      playlist: [],
      playbackProgress: 0,
      isShuffled: false,
      repeatMode: "none",
      error: null,

      setTrack: (track) => set({ currentTrack: track, isPlaying: true, error: null }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setVolume: (volume) => set({ volume }),
      setPlaylist: (playlist) => set({ playlist }),
      addToPlaylist: (track) => set((state) => ({ 
        playlist: [...state.playlist, track] 
      })),
      removeFromPlaylist: (trackId) => set((state) => ({
        playlist: state.playlist.filter((track) => track.id !== trackId)
      })),
      setPlaybackProgress: (progress) => set({ playbackProgress: progress }),
      toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),
      setRepeatMode: (mode) => set({ repeatMode: mode }),
      setError: (error) => set({ error }),
      clear: () => set({ currentTrack: null, isPlaying: false, playlist: [], playbackProgress: 0, error: null }),
      
      playNext: () => {
        const { currentTrack, playlist, isShuffled, repeatMode } = get();
        if (!currentTrack || playlist.length === 0) return;

        const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id);
        let nextIndex = currentIndex + 1;

        if (repeatMode === "track") {
          // Keep playing the same track
          return;
        } else if (repeatMode === "playlist" && nextIndex >= playlist.length) {
          // Start from beginning if repeat playlist is enabled
          nextIndex = 0;
        } else if (nextIndex >= playlist.length) {
          // Stop if end of playlist is reached
          set({ isPlaying: false });
          return;
        }

        if (isShuffled) {
          nextIndex = Math.floor(Math.random() * playlist.length);
        }

        set({ currentTrack: playlist[nextIndex], isPlaying: true, error: null });
      },

      playPrevious: () => {
        const { currentTrack, playlist, isShuffled } = get();
        if (!currentTrack || playlist.length === 0) return;

        const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id);
        let prevIndex = currentIndex - 1;

        if (prevIndex < 0) {
          prevIndex = playlist.length - 1;
        }

        if (isShuffled) {
          prevIndex = Math.floor(Math.random() * playlist.length);
        }

        set({ currentTrack: playlist[prevIndex], isPlaying: true, error: null });
      },
    }));
