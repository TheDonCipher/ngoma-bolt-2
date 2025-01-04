"use client";

import { Album } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface AlbumActionsProps {
  album: Album;
}

export function AlbumActions({ album }: AlbumActionsProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: album.title,
        text: `Check out ${album.title} by ${album.artist.name}`,
        url: `/albums/${album.id}`,
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not share album",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4 mb-8">
      <Button size="lg" className="flex-1 md:flex-none">
        Purchase Album
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="text-muted-foreground hover:text-foreground"
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="text-muted-foreground hover:text-foreground"
      >
        <Heart className="w-4 h-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Report Album</DropdownMenuItem>
          <DropdownMenuItem>View on Explorer</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
