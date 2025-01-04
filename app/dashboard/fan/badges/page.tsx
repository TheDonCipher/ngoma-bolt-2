"use client";

import { BadgeOverview } from "@/components/badges/badge-overview";
import { useBadgeUnlocks } from "@/lib/hooks/use-badge-unlocks";

export default function BadgesPage() {
  // Initialize badge unlock notifications
  useBadgeUnlocks();

  return (
    <div className="container px-4 py-8">
      <BadgeOverview />
    </div>
  );
}
