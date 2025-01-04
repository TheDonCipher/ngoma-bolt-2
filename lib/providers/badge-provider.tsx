"use client";

import { ReactNode } from "react";
import { useBadgeTracking } from "@/lib/hooks/use-badge-tracking";
import { useBadgeUnlocks } from "@/lib/hooks/use-badge-unlocks";

interface BadgeProviderProps {
  children: ReactNode;
}

export function BadgeProvider({ children }: BadgeProviderProps) {
  // Initialize badge tracking and unlock notifications
  useBadgeTracking();
  useBadgeUnlocks();

  return <>{children}</>;
}
