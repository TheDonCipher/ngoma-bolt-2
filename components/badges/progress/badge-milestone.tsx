"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BadgeLevel } from "@/lib/types/badges";
import { BadgeLevelIndicator } from "./badge-level-indicator";

interface BadgeMilestoneProps {
  level: BadgeLevel;
  currentValue: number;
  threshold: number;
  isUnlocked?: boolean;
  unlockedAt?: Date;
}

export function BadgeMilestone({
  level,
  currentValue,
  threshold,
  isUnlocked,
  unlockedAt,
}: BadgeMilestoneProps) {
  const progress = Math.min((currentValue / threshold) * 100, 100);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <BadgeLevelIndicator level={level} />
        {isUnlocked && (
          <span className="text-xs text-muted-foreground">
            Unlocked {unlockedAt?.toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {currentValue} / {threshold}
          </span>
          {!isUnlocked && (
            <span className="text-primary font-medium">
              {Math.floor(progress)}%
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
