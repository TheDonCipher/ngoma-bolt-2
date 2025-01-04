"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Play, Pause } from "lucide-react";
import Image from "next/image";
import { mockFeaturedArtists } from "@/lib/mock-data";

export function FanFollowing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingArtistId, setPlayingArtistId] = useState<string | null>(null);

  const filteredArtists = mockFeaturedArtists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlay = (artistId: string) => {
    setPlayingArtistId(playingArtistId === artistId ? null : artistId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map((artist) => (
          <Card key={artist.id} className="p-6 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{artist.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{artist.genre}</p>
                <div className="flex items-center gap-4">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Tracks:</span>{" "}
                    <span className="font-medium">{artist.totalTracks}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Floor:</span>{" "}
                    <span className="font-medium">{artist.floorPrice} ETH</span>
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
                onClick={() => handlePlay(artist.id)}
              >
                {playingArtistId === artist.id ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
