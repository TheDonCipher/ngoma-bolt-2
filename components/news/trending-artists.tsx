"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp } from "lucide-react";
import { mockFeaturedArtists } from "@/lib/mock-data";

export function TrendingArtists() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h2 className="font-semibold">Trending Artists</h2>
      </div>

      <div className="space-y-4">
        {mockFeaturedArtists.map((artist) => (
          <div key={artist.id} className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={artist.image} alt={artist.name} />
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{artist.name}</p>
              <p className="text-sm text-muted-foreground">{artist.genre}</p>
            </div>
            <Button variant="outline" size="sm">
              Follow
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
