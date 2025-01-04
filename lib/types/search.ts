"use client";

export type SearchCategory = "tracks" | "albums" | "artists" | "playlists";

export type SortOption = {
  field: string;
  direction: "asc" | "desc";
};

export interface SearchFilters {
  category: SearchCategory;
  genre?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  verified?: boolean;
}

export interface SearchResults<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
