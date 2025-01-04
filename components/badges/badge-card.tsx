"use client";

import { Badge } from "@/lib/types/badges";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBadgeProgress } from "@/hooks/use-badge-progress";
import { formatDistanceToNow } from "date-fns";

interface BadgeCardProps {
  badge: Badge;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const { progress, isLoading } = useBadgeProgress(badge.type);
  const percentage = Math.min((progress / badge.criteria.threshold) * 100, 100);
  const isUnlocked = progress >= badge.criteria.threshold;

  const levelColors = {
    bronze: "bg-orange-500/10 text-orange-500",
    silver: "bg-slate-500/10 text-slate-500",
    gold: "bg-yellow-500/10 text-yellow-500",
    platinum: "bg-purple-500/10 text-purple-500",
    exclusive: "bg-primary/10 text-primary",
  };

  return (
    <Card className={`p-6 transition-colors ${
      isUnlocked ? "bg-muted/50" : "hover:bg-muted/50"
    }`}>
      <div className="space-y-4">
        <div className={`p-3 w-fit rounded-lg ${levelColors[badge.level]}`}>
          <span className="text-2xl">{badge.icon}</span>
        </div>

        <div>
          <h3 className="font-semibold">{badge.name}</h3>
          <p className="text-sm text-muted-foreground">
            {badge.description}
          </p>
        </div>

        {badge.rewards && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Reward:</span> {badge.rewards.value}
          </div>
        )}

        {isUnlocked ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary">Unlocked</span>
            {badge.unlockedAt && (
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(badge.unlockedAt, { addSuffix: true })}
              </span>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Progress value={percentage} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {progress} / {badge.criteria.threshold}
              </span>
              {badge.criteria.timeframe && (
                <span>{badge.criteria.timeframe}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
