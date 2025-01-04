"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Music, Star } from "lucide-react";

interface BadgeProgressProps {
  collectorProgress: number;
  listenerProgress: number;
  specialProgress: number;
}

export function BadgeProgress({
  collectorProgress,
  listenerProgress,
  specialProgress,
}: BadgeProgressProps) {
  const stats = [
    {
      label: "Collector Progress",
      value: collectorProgress,
      icon: Trophy,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Listener Progress",
      value: listenerProgress,
      icon: Music,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Special Achievements",
      value: specialProgress,
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}%</p>
            </div>
          </div>
          <Progress value={stat.value} className="h-2" />
        </Card>
      ))}
    </div>
  );
}
