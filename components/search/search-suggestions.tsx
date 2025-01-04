"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Music, User, Disc } from "lucide-react";

interface SearchSuggestion {
  id: string;
  type: "track" | "artist" | "album";
  title: string;
  subtitle?: string;
}

interface SearchSuggestionsProps {
  query: string;
}

export function SearchSuggestions({ query }: SearchSuggestionsProps) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // In production, this would be an API call
        // Simulating API response
        await new Promise(resolve => setTimeout(resolve, 300));
        setSuggestions([
          {
            id: "1",
            type: "track",
            title: "African Giant",
            subtitle: "Burna Boy",
          },
          {
            id: "2",
            type: "artist",
            title: "Wizkid",
          },
          {
            id: "3",
            type: "album",
            title: "Made in Lagos",
            subtitle: "Wizkid",
          },
        ]);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [query]);

  const getIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "track":
        return <Music className="w-4 h-4" />;
      case "artist":
        return <User className="w-4 h-4" />;
      case "album":
        return <Disc className="w-4 h-4" />;
    }
  };

  if (!suggestions.length && !isLoading) return null;

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 p-2 z-50">
      <div className="space-y-1">
        {isLoading ? (
          <div className="p-2 text-sm text-muted-foreground">Loading...</div>
        ) : (
          suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => router.push(`/search/${suggestion.type}/${suggestion.id}`)}
            >
              {getIcon(suggestion.type)}
              <div className="text-left">
                <p className="font-medium">{suggestion.title}</p>
                {suggestion.subtitle && (
                  <p className="text-sm text-muted-foreground">
                    {suggestion.subtitle}
                  </p>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </Card>
  );
}
