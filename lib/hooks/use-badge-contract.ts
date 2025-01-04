"use client";

import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { BADGE_NFT_CONTRACT_ADDRESS } from "@/lib/constants";
import { BadgeType, BadgeLevel } from "@/lib/types/badges";

export function useBadgeContract() {
  const { contract } = useContract(BADGE_NFT_CONTRACT_ADDRESS);

  // Read user's progress for a specific badge type
  const useUserProgress = (address: string, badgeType: BadgeType) => {
    return useContractRead(contract, "getUserProgress", [address, badgeType]);
  };

  // Check if user has earned a specific badge
  const useHasBadge = (address: string, badgeId: string) => {
    return useContractRead(contract, "hasBadge", [address, badgeId]);
  };

  // Get all badges for a user
  const useUserBadges = (address: string) => {
    return useContractRead(contract, "getUserBadges", [address]);
  };

  // Create a new badge (admin only)
  const useCreateBadge = () => {
    return useContractWrite(contract, "createBadge");
  };

  // Update user's progress
  const useUpdateProgress = () => {
    return useContractWrite(contract, "updateProgress");
  };

  return {
    contract,
    useUserProgress,
    useHasBadge,
    useUserBadges,
    useCreateBadge,
    useUpdateProgress,
  };
}
