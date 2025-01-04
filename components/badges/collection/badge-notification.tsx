"use client";

import { useEffect } from "react";
import { Badge } from "@/lib/types/badges";
import { useToast } from "@/hooks/use-toast";
import { BadgeLevelIndicator } from "../progress/badge-level-indicator";

interface BadgeNotificationProps {
  badge: Badge;
}

export function BadgeNotification({ badge }: BadgeNotificationProps) {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "New Badge Unlocked! 🎉",
      description: (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{badge.icon}</span>
            <div>
              <p className="font-semibold">{badge.name}</p>
              <BadgeLevelIndicator level={badge.level} />
            </div>
          </div>
          {badge.rewards && (
            <p className="text-sm text-muted-foreground">
              Reward: {badge.rewards.value}
            </p>
          )}
        </div>
      ),
      duration: 5000,
    });
  }, [badge, toast]);

  return null;
}
