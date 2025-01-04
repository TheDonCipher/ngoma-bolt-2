"use client";

import { Card } from "@/components/ui/card";
import { Trophy, Star, Music, Heart, Users, Headphones, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const achievements = [
  {
    id: "1",
    title: "Early Adopter",
    description: "Joined during platform launch",
    icon: Star,
    unlockedAt: "2023-12-01",
    rarity: "Legendary",
    color: "text-yellow-500",
  },
  {
    id: "2",
    title: "Music Enthusiast",
    description: "Collected 10 music NFTs",
    icon: Music,
    unlockedAt: "2023-12-15",
    rarity: "Rare",
    color: "text-blue-500",
  },
  {
    id: "3",
    title: "Super Fan",
    description: "Followed 20 artists",
    icon: Heart,
    unlockedAt: "2023-12-20",
    rarity: "Epic",
    color: "text-purple-500",
  },
  {
    id: "4",
    title: "Music Marathon",
    description: "Listened to 100 hours of music",
    icon: Headphones,
    unlockedAt: "2024-01-05",
    rarity: "Rare",
    color: "text-green-500",
  },
  {
    id: "5",
    title: "Community Leader",
    description: "Referred 5 new users",
    icon: Users,
    unlockedAt: "2024-01-10",
    rarity: "Epic",
    color: "text-pink-500",
  },
  {
    id: "6",
    title: "NFT Collector",
    description: "Own NFTs from 5 different artists",
    icon: Award,
    unlockedAt: "2024-01-15",
    rarity: "Legendary",
    color: "text-orange-500",
  },
];

export function FanAchievements() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="p-6 hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-xl bg-primary/10", achievement.color)}>
                <achievement.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    achievement.rarity === "Legendary" && "bg-yellow-500/10 text-yellow-500",
                    achievement.rarity === "Epic" && "bg-purple-500/10 text-purple-500",
                    achievement.rarity === "Rare" && "bg-blue-500/10 text-blue-500"
                  )}>
                    {achievement.rarity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {achievement.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
