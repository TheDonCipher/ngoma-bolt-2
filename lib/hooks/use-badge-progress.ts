"use client";

import { useState, useEffect } from "react";
import { useBadgeContract } from "./use-badge-contract";
import { BadgeType } from "@/lib/types/badges";
import { useAddress } from "@thirdweb-dev/react";

export function useBadgeProgress(type: BadgeType) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const address = useAddress();
  const { useUserProgress } = useBadgeContract();
  const { data: userProgress } = useUserProgress(address || "", type);

  useEffect(() => {
    if (userProgress) {
      // Convert progress to percentage based on the next threshold
      const thresholds = {
        COLLECTOR: [5, 15, 30, 50],
        LISTENER: [200, 500, 1000, 2000],
        SPECIAL: [1, 3, 5, 10],
      };

      const currentValue = Number(userProgress);
      const nextThreshold = thresholds[type].find(t => t > currentValue) || thresholds[type][0];
      const percentage = Math.min((currentValue / nextThreshold) * 100, 100);
      
      setProgress(percentage);
      setIsLoading(false);
    }
  }, [userProgress, type]);

  return {
    progress,
    isLoading,
  };
}
