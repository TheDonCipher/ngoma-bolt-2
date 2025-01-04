"use client";

import { ReactNode } from "react";
import { useBadgeTracking } from "@/lib/hooks/use-badge-tracking";

interface BadgeProviderProps {
  children: ReactNode;
}

export function BadgeProvider({ children }: BadgeProviderProps) {
  useBadgeTracking();
  return <>{children}</>;
}
