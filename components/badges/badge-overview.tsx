"use client";

import { BadgeProgressGrid } from "./progress/badge-progress-grid";
import { BadgeStats } from "./collection/badge-stats";
import { BadgeGrid } from "./collection/badge-grid";
import { useBadges } from "@/lib/hooks/use-badges";
import { Skeleton } from "@/components/ui/skeleton";

export function BadgeOverview() {
  const { badges, isLoading } = useBadges();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Badges</h2>
        <p className="text-muted-foreground">
          Track your achievements and unlock rewards
        </p>
      </div>

      <BadgeStats badges={badges} />
      <BadgeProgressGrid />
      <BadgeGrid badges={badges} />
    </div>
  );
}
