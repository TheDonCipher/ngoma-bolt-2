"use client";

import { useState } from "react";
import { NewsFeed } from "@/components/news/news-feed";
import { TrendingArtists } from "@/components/news/trending-artists";
import { UpcomingEvents } from "@/components/news/upcoming-events";
import { NewsFilter } from "@/components/news/news-filter";

export default function NewsPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-3xl font-bold mb-6">News Feed</h1>
          <NewsFilter
            selected={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
          <NewsFeed filter={selectedFilter} />
        </div>
        
        <div className="lg:w-80 space-y-6">
          <TrendingArtists />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}
