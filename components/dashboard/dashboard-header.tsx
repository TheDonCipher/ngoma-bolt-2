import { Artist } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Image from "next/image";

interface DashboardHeaderProps {
  artist: Artist;
}

export function DashboardHeader({ artist }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{artist.name}</h1>
          <p className="text-muted-foreground">
            {artist.genre} • {artist.totalTracks} Tracks
          </p>
        </div>
      </div>
      
      <Button variant="outline" size="icon">
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
}
