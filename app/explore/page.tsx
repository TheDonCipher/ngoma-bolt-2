"use client";

    import { ExploreHeader } from "@/components/explore/explore-header";
    import { SearchFilters } from "@/components/explore/search-filters";
    import { FeaturedArtists } from "@/components/explore/featured-artists";
    import { TrendingSongs } from "@/components/explore/trending-songs";
    import { AudioPlayer } from "@/components/player/audio-player";
    import { PlaylistDrawer } from "@/components/player/playlist-drawer";
    import { useEffect, useState } from "react";
    import { fetchWithErrorHandling } from "@/lib/api-client";
    import { Artist } from "@/lib/types";
    import { isDevelopment } from "@/lib/utils/env";
    import { mockFeaturedArtists } from "@/lib/mock-data";

    export default function ExplorePage() {
      const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);

      useEffect(() => {
        const fetchArtists = async () => {
          try {
            let artists: Artist[];
            if (isDevelopment()) {
              // Use mock data in development
              artists = mockFeaturedArtists;
            } else {
              // Fetch from API in staging/production
              artists = await fetchWithErrorHandling<Artist[]>("/artists/featured");
            }
            setFeaturedArtists(artists);
          } catch (error) {
            console.error("Error fetching featured artists:", error);
          }
        };

        fetchArtists();
      }, []);

      return (
        <main className="min-h-screen pb-24">
          <div className="container px-4 py-8">
            <ExploreHeader />
            <SearchFilters />
            <div className="mt-12">
              <FeaturedArtists />
            </div>
            <div className="mt-12">
              <TrendingSongs />
            </div>
          </div>
          <AudioPlayer />
          <PlaylistDrawer />
        </main>
      );
    }
