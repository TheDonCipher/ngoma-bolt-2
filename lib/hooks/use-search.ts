"use client";

import { useState, useEffect } from "react";
import { SearchFilters, SearchResults } from "@/lib/types/search";
import { Track, Album, Artist } from "@/lib/types";
import { mockAlbumData, mockFeaturedArtists } from "@/lib/mock-data";

type SearchResult = Track | Album | Artist;

export function useSearch(query: string, filters: Partial<SearchFilters>) {
  const [results, setResults] = useState<SearchResults<SearchResult>>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
    hasMore: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchItems = async () => {
      if (!query) {
        setResults({
          items: [],
          total: 0,
          page: 1,
          pageSize: 20,
          hasMore: false,
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // In production, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock search results based on filters
        let items: SearchResult[] = [];
        
        switch (filters.category) {
          case "tracks":
            items = mockAlbumData.tracks.filter(track =>
              track.title.toLowerCase().includes(query.toLowerCase())
            );
            break;
          case "albums":
            items = [mockAlbumData].filter(album =>
              album.title.toLowerCase().includes(query.toLowerCase())
            );
            break;
          case "artists":
            items = mockFeaturedArtists.filter(artist =>
              artist.name.toLowerCase().includes(query.toLowerCase())
            );
            break;
          default:
            items = [];
        }

        // Apply filters
        if (filters.genre?.length) {
          items = items.filter(item => 
            "genre" in item && filters.genre?.includes(item.genre.toLowerCase())
          );
        }

        if (filters.priceRange) {
          items = items.filter(item =>
            "price" in item && 
            Number(item.price) >= filters.priceRange!.min &&
            Number(item.price) <= filters.priceRange!.max
          );
        }

        setResults({
          items,
          total: items.length,
          page: 1,
          pageSize: 20,
          hasMore: false,
        });
      } catch (error) {
        console.error("Error searching:", error);
        setError("Failed to fetch search results");
      } finally {
        setIsLoading(false);
      }
    };

    searchItems();
  }, [query, filters]);

  return {
    results,
    isLoading,
    error,
  };
}
