"use client";

import { Trophy, Music, Star } from "lucide-react";
import { BadgeProgressCard } from "./badge-progress-card";

export function BadgeProgressGrid() {
  const progressCards = [
    {
      type: "COLLECTOR",
      icon: <Trophy className="w-6 h-6" />,
      title: "Collector Progress",
      description: "Track your NFT collection milestones",
    },
    {
      type: "LISTENER",
      icon: <Music className="w-6 h-6" />,
      title: "Listener Progress",
      description: "Your music streaming achievements",
    },
    {
      type: "SPECIAL",
      icon: <Star className="w-6 h-6" />,
      title: "Special Achievements",
      description: "Exclusive and limited-time badges",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {progressCards.map((card) => (
        <BadgeProgressCard key={card.type} {...card} />
      ))}
    </div>
  );
}
