import { Card } from "@/components/ui/card";
import {
  Music,
  Users,
  Trophy,
  Headphones
} from "lucide-react";

export function FanStats() {
  const stats = [
    {
      label: "NFTs Owned",
      value: "15",
      icon: Music,
      trend: "+3 this month"
    },
    {
      label: "Artists Following",
      value: "24",
      icon: Users,
      trend: "+5 this month"
    },
    {
      label: "Achievements",
      value: "8",
      icon: Trophy,
      trend: "+2 this month"
    },
    {
      label: "Hours Listened",
      value: "156",
      icon: Headphones,
      trend: "+23 this month"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <stat.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
