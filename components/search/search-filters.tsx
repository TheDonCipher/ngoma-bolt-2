"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchFilters as SearchFiltersType } from "@/lib/types/search";

const GENRES = [
  "Afrobeats",
  "Afro-fusion",
  "Amapiano",
  "Highlife",
  "Afro-soul",
];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFiltersType>({
    category: "tracks",
    genre: [],
    priceRange: { min: 0, max: 10 },
    verified: false,
  });

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (typeof value === "object") {
        Object.entries(value).forEach(([k, v]) => {
          params.set(`${key}_${k}`, v.toString());
        });
      } else {
        params.set(key, value.toString());
      }
    });
    router.push(`/search?${params.toString()}`);
  };

  const resetFilters = () => {
    setFilters({
      category: "tracks",
      genre: [],
      priceRange: { min: 0, max: 10 },
      verified: false,
    });
    router.push("/search");
  };

  return (
    <div className="py-4 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => 
              setFilters({ ...filters, category: value as SearchFiltersType["category"] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tracks">Tracks</SelectItem>
              <SelectItem value="albums">Albums</SelectItem>
              <SelectItem value="artists">Artists</SelectItem>
              <SelectItem value="playlists">Playlists</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Genre</Label>
          <Select
            value={filters.genre?.[0] || ""}
            onValueChange={(value) => 
              setFilters({ ...filters, genre: [value] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              {GENRES.map((genre) => (
                <SelectItem key={genre} value={genre.toLowerCase()}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price Range (ETH)</Label>
          <div className="pt-2">
            <Slider
              value={[filters.priceRange?.min || 0, filters.priceRange?.max || 10]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={([min, max]) =>
                setFilters({
                  ...filters,
                  priceRange: { min, max },
                })
              }
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{filters.priceRange?.min} ETH</span>
              <span>{filters.priceRange?.max} ETH</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label>Verified Only</Label>
          <Switch
            checked={filters.verified}
            onCheckedChange={(checked) =>
              setFilters({ ...filters, verified: checked })
            }
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={resetFilters} variant="outline" className="flex-1">
          Reset
        </Button>
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
