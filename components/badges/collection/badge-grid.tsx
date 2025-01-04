"use client";

import { useState } from "react";
import { Badge, BadgeType } from "@/lib/types/badges";
import { BadgeCard } from "./badge-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Music, Star } from "lucide-react";

interface BadgeGridProps {
  badges: Badge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  const [selectedType, setSelectedType] = useState<BadgeType>("COLLECTOR");

  const filteredBadges = badges.filter(badge => badge.type === selectedType);

  const tabs = [
    {
      value: "COLLECTOR",
      label: "Collector",
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      value: "LISTENER",
      label: "Listener",
      icon: <Music className="w-4 h-4" />,
    },
    {
      value: "SPECIAL",
      label: "Special",
      icon: <Star className="w-4 h-4" />,
    },
  ] as const;

  return (
    <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as BadgeType)}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex items-center gap-2"
          >
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
