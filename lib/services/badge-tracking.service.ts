"use client";

import { useBadgeContract } from "@/lib/hooks/use-badge-contract";
import { BadgeType } from "@/lib/types/badges";
import { useToast } from "@/hooks/use-toast";

export function useBadgeTracking() {
  const { useUpdateProgress } = useBadgeContract();
  const { mutateAsync: updateProgress } = useUpdateProgress();
  const { toast } = useToast();

  const trackProgress = async (
    address: string,
    type: BadgeType,
    amount: number
  ) => {
    try {
      await updateProgress({ args: [address, type, amount] });
      
      toast({
        title: "Progress Updated",
        description: `Your ${type.toLowerCase()} progress has been updated!`,
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    }
  };

  const trackPurchase = async (address: string) => {
    await trackProgress(address, "COLLECTOR", 1);
  };

  const trackListening = async (address: string) => {
    await trackProgress(address, "LISTENER", 1);
  };

  const trackSpecialAchievement = async (address: string) => {
    await trackProgress(address, "SPECIAL", 1);
  };

  return {
    trackPurchase,
    trackListening,
    trackSpecialAchievement,
  };
}
