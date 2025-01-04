"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/lib/types/badges";
import { BadgeLevelIndicator } from "../progress/badge-level-indicator";
import { BadgeDetailsDialog } from "./badge-details-dialog";
import { formatDistanceToNow } from "date-fns";

interface BadgeCardProps {
  badge: Badge;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Card
        className={`p-6 transition-colors cursor-pointer ${
          badge.unlockedAt ? "bg-muted/50" : "hover:bg-muted/50"
        }`}
        onClick={() => setShowDetails(true)}
      >
        <div className="space-y-4">
          <div className={`p-3 w-fit rounded-lg ${
            badge.unlockedAt ? "bg-primary/10" : "bg-muted"
          }`}>
            <span className="text-2xl">{badge.icon}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{badge.name}</h3>
              <BadgeLevelIndicator level={badge.level} />
            </div>
            <p className="text-sm text-muted-foreground">
              {badge.description}
            </p>
          </div>

          {badge.rewards && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Reward:</span> {badge.rewards.value}
            </div>
          )}

          {badge.unlockedAt && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary">Unlocked</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(badge.unlockedAt, { addSuffix: true })}
              </span>
            </div>
          )}
        </div>
      </Card>

      <BadgeDetailsDialog
        badge={badge}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
}
