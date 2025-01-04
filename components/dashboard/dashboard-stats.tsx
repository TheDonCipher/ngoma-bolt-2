import { Artist } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { formatEther } from "ethers/lib/utils";
import {
  TrendingUp,
  Users,
  Music,
  DollarSign
} from "lucide-react";

interface DashboardStatsProps {
  artist: Artist;
}

export function DashboardStats({ artist }: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Tracks",
      value: artist.totalTracks,
      icon: Music,
      trend: "+2 this month"
    },
    {
      label: "Floor Price",
      value: `${formatEther(BigInt(artist.floorPrice * 1e18))} ETH`,
      icon: DollarSign,
      trend: "+12% from last month"
    },
    {
      label: "Total Followers",
      value: "1,234",
      icon: Users,
      trend: "+123 this month"
    },
    {
      label: "Revenue",
      value: "12.5 ETH",
      icon: TrendingUp,
      trend: "+2.3 ETH this month"
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
