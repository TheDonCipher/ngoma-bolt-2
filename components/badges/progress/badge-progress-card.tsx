"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BadgeType } from "@/lib/types/badges";
import { useBadgeProgress } from "@/lib/hooks/use-badge-progress";
import { useAddress } from "@thirdweb-dev/react";

interface BadgeProgressCardProps {
  type: BadgeType;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function BadgeProgressCard({
  type,
  icon,
  title,
  description,
}: BadgeProgressCardProps) {
  const address = useAddress();
  const { progress, isLoading } = useBadgeProgress(type);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={isLoading ? 0 : progress} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{progress}%</span>
          <span>Next Level</span>
        </div>
      </div>
    </Card>
  );
}
