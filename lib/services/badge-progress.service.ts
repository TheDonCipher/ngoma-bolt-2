"use client";

import { useContract, useContractRead } from "@thirdweb-dev/react";
import { BADGE_NFT_CONTRACT_ADDRESS } from "@/lib/constants";
import { BadgeType } from "@/lib/types/badges";

export function useBadgeProgressService() {
  const { contract } = useContract(BADGE_NFT_CONTRACT_ADDRESS);

  const getProgress = (address: string, type: BadgeType) => {
    return useContractRead(contract, "getUserProgress", [address, type]);
  };

  const getThresholds = (type: BadgeType) => {
    const thresholds = {
      COLLECTOR: [5, 15, 30, 50],
      LISTENER: [200, 500, 1000, 2000],
      SPECIAL: [1, 3, 5, 10],
    };

    return thresholds[type];
  };

  const calculateNextThreshold = (currentValue: number, type: BadgeType) => {
    const thresholds = getThresholds(type);
    return thresholds.find(t => t > currentValue) || thresholds[thresholds.length - 1];
  };

  const calculatePercentage = (currentValue: number, nextThreshold: number) => {
    return Math.min((currentValue / nextThreshold) * 100, 100);
  };

  return {
    getProgress,
    getThresholds,
    calculateNextThreshold,
    calculatePercentage,
  };
}
