"use client";

import { Button } from "@/components/ui/button";
import { Trophy, Music, Star } from "lucide-react";

interface BadgeFiltersProps {
  selected: string;
  onFilterChange: (filter: string) => void;
}

export function BadgeFilters({ selected, onFilterChange }: BadgeFiltersProps) {
  const filters = [
    { id: "all", label: "All Badges", icon: null },
    { id: "collector", label: "Collector", icon: Trophy },
    { id: "listener", label: "Listener", icon: Music },
    { id: "special", label: "Special", icon: Star },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={selected === filter.id ? "default" : "outline"}
          onClick={() => onFilterChange(filter.id)}
          className="whitespace-nowrap"
        >
          {filter.icon && <filter.icon className="w-4 h-4 mr-2" />}
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
