"use client";

import { Card } from "@/components/ui/card";
import { Trophy, Star, Target } from "lucide-react";
import { Badge } from "@/lib/types/badges";

interface BadgeStatsProps {
  badges: Badge[];
}

export function BadgeStats({ badges }: BadgeStatsProps) {
  const totalBadges = badges.length;
  const unlockedBadges = badges.filter(badge => badge.unlockedAt).length;
  const rareAndAbove = badges.filter(badge => 
    badge.level === "gold" || badge.level === "platinum" || badge.level === "exclusive"
  ).length;

  const stats = [
    {
      label: "Total Badges",
      value: totalBadges,
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Badges Unlocked",
      value: unlockedBadges,
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Rare & Above",
      value: rareAndAbove,
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
