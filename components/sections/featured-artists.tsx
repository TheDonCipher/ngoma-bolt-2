"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArtistCard } from "@/components/ui/artist-card";
import { mockFeaturedArtists } from "@/lib/mock-data";

export function FeaturedArtists() {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Artists</h2>
            <p className="text-muted-foreground">Discover trending African artists and their exclusive NFTs</p>
          </div>
          <Button variant="secondary">View All Artists</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockFeaturedArtists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              isPlaying={playingTrack === artist.previewTrack}
              onPlay={() => setPlayingTrack(artist.previewTrack)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
