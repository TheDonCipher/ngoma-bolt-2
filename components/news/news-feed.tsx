"use client";

import { useState, useEffect } from "react";
import { NewsCard } from "./news-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface NewsItem {
  id: string;
  type: "release" | "event" | "achievement";
  title: string;
  description: string;
  image: string;
  artist: {
    name: string;
    image: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    type: "release",
    title: "New Album: African Giant Deluxe",
    description: "Burna Boy drops surprise deluxe edition with 5 new tracks",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000",
    artist: {
      name: "Burna Boy",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000"
    },
    timestamp: "2024-01-15T10:00:00Z",
    likes: 1234,
    comments: 89
  },
  {
    id: "2",
    type: "event",
    title: "Virtual Concert Announcement",
    description: "Join Wizkid for an exclusive virtual concert experience",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000",
    artist: {
      name: "Wizkid",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000"
    },
    timestamp: "2024-01-14T15:30:00Z",
    likes: 856,
    comments: 45
  }
];

interface NewsFeedProps {
  filter: string;
}

export function NewsFeed({ filter }: NewsFeedProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const filteredNews = filter === "all" 
        ? mockNews 
        : mockNews.filter(item => item.type === filter);
      setNews(filteredNews);
      setIsLoading(false);
    }, 1000);
  }, [filter]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
      <div className="flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
}
