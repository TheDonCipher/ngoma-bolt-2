"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/lib/types/badges";
import { BadgeLevelIndicator } from "../progress/badge-level-indicator";
import { formatDistanceToNow } from "date-fns";

interface BadgeDetailsDialogProps {
  badge: Badge;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BadgeDetailsDialog({
  badge,
  open,
  onOpenChange,
}: BadgeDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{badge.icon}</span>
            {badge.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BadgeLevelIndicator level={badge.level} />
            {badge.unlockedAt && (
              <span className="text-sm text-muted-foreground">
                Unlocked {formatDistanceToNow(badge.unlockedAt, { addSuffix: true })}
              </span>
            )}
          </div>

          <p className="text-muted-foreground">{badge.description}</p>

          {badge.rewards && (
            <div className="p-4 rounded-lg bg-primary/10">
              <h4 className="font-semibold mb-1">Rewards</h4>
              <p className="text-sm text-muted-foreground">{badge.rewards.value}</p>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-semibold">Requirements</h4>
            <div className="text-sm text-muted-foreground">
              <p>Type: {badge.criteria.type}</p>
              <p>Threshold: {badge.criteria.threshold}</p>
              {badge.criteria.timeframe && (
                <p>Timeframe: {badge.criteria.timeframe}</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
