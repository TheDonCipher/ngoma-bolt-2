"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBadgeService } from "@/lib/services/badge.service";
import { Badge } from "@/lib/types/badges";

interface BadgeNotificationProps {
  badge: Badge;
}

export function BadgeNotification({ badge }: BadgeNotificationProps) {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "New Badge Unlocked! 🎉",
      description: (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{badge.icon}</span>
          <div>
            <p className="font-semibold">{badge.name}</p>
            <p className="text-sm text-muted-foreground">{badge.description}</p>
          </div>
        </div>
      ),
      duration: 5000,
    });
  }, [badge, toast]);

  return null;
}
