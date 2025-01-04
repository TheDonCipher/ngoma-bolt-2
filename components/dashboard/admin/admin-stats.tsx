import { Card } from "@/components/ui/card";
import {
  Users,
  Music,
  DollarSign,
  Activity
} from "lucide-react";

export function AdminStats() {
  const stats = [
    {
      label: "Total Users",
      value: "2,345",
      icon: Users,
      trend: "+123 this month"
    },
    {
      label: "Active NFTs",
      value: "1,234",
      icon: Music,
      trend: "+45 this month"
    },
    {
      label: "Platform Revenue",
      value: "45.5 ETH",
      icon: DollarSign,
      trend: "+5.2 ETH this month"
    },
    {
      label: "System Health",
      value: "98.5%",
      icon: Activity,
      trend: "Normal"
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
