"use client";

import { Album } from "@/lib/types";
import { AlbumCard } from "./album-card";
import { useState } from "react";

interface AlbumGridProps {
  albums: Album[];
}

export function AlbumGrid({ albums }: AlbumGridProps) {
  const [playingAlbumId, setPlayingAlbumId] = useState<string | null>(null);

  const handlePlay = (albumId: string) => {
    setPlayingAlbumId(playingAlbumId === albumId ? null : albumId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          album={album}
          isPlaying={playingAlbumId === album.id}
          onPlay={() => handlePlay(album.id)}
        />
      ))}
    </div>
  );
}
