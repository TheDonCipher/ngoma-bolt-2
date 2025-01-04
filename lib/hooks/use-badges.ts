"use client";

import { useState, useEffect } from "react";
import { Badge, BadgeProgress } from "@/lib/types/badges";
import { useAddress } from "@thirdweb-dev/react";

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const address = useAddress();

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setIsLoading(true);
        // In production, this would be an API call
        const mockBadges: Badge[] = [
          // Collector Badges
          {
            id: "bronze-collector",
            name: "Bronze Collector",
            description: "Own 1-5 NFTs",
            icon: "🥉",
            level: "bronze",
            type: "collector",
            criteria: {
              type: "nft",
              threshold: 1,
            },
            rewards: {
              type: "discount",
              value: "5% off next purchase",
            },
            unlockedAt: new Date(),
          },
          {
            id: "silver-collector",
            name: "Silver Collector",
            description: "Own 6-15 NFTs",
            icon: "🥈",
            level: "silver",
            type: "collector",
            criteria: {
              type: "nft",
              threshold: 6,
            },
            rewards: {
              type: "discount",
              value: "10% off next purchase",
            },
          },
          {
            id: "gold-collector",
            name: "Gold Collector",
            description: "Own 16-30 NFTs",
            icon: "🥇",
            level: "gold",
            type: "collector",
            criteria: {
              type: "nft",
              threshold: 16,
            },
            rewards: {
              type: "access",
              value: "Early access to new releases",
            },
          },
          {
            id: "platinum-collector",
            name: "Platinum Collector",
            description: "Own 31+ NFTs",
            icon: "💎",
            level: "platinum",
            type: "collector",
            criteria: {
              type: "nft",
              threshold: 31,
            },
            rewards: {
              type: "access",
              value: "VIP access to virtual events",
            },
          },

          // Listener Badges
          {
            id: "casual-listener",
            name: "Casual Listener",
            description: "Stream 50-200 songs",
            icon: "🎧",
            level: "bronze",
            type: "listener",
            criteria: {
              type: "streams",
              threshold: 50,
              timeframe: "monthly",
            },
            rewards: {
              type: "boost",
              value: "1.1x streaming rewards",
            },
            unlockedAt: new Date(),
          },
          {
            id: "engaged-listener",
            name: "Engaged Listener",
            description: "Stream 201-500 songs",
            icon: "🎵",
            level: "silver",
            type: "listener",
            criteria: {
              type: "streams",
              threshold: 201,
              timeframe: "monthly",
            },
            rewards: {
              type: "boost",
              value: "1.25x streaming rewards",
            },
          },
          {
            id: "music-aficionado",
            name: "Music Aficionado",
            description: "Stream 501-1000 songs",
            icon: "🎼",
            level: "gold",
            type: "listener",
            criteria: {
              type: "streams",
              threshold: 501,
              timeframe: "monthly",
            },
            rewards: {
              type: "boost",
              value: "1.5x streaming rewards",
            },
          },
          {
            id: "ultimate-fan",
            name: "Ultimate Fan",
            description: "Stream 1001+ songs",
            icon: "👑",
            level: "platinum",
            type: "listener",
            criteria: {
              type: "streams",
              threshold: 1001,
              timeframe: "monthly",
            },
            rewards: {
              type: "boost",
              value: "2x streaming rewards",
            },
          },

          // Special Badges
          {
            id: "early-adopter",
            name: "Early Adopter",
            description: "Join during platform launch",
            icon: "⭐",
            level: "exclusive",
            type: "special",
            criteria: {
              type: "special",
              threshold: 1,
            },
            rewards: {
              type: "access",
              value: "Limited edition platform launch NFT",
            },
            unlockedAt: new Date(),
          },
          {
            id: "first-listener",
            name: "First Listener",
            description: "Stream a track within 24h of release",
            icon: "🎯",
            level: "exclusive",
            type: "special",
            criteria: {
              type: "special",
              threshold: 1,
              timeframe: "daily",
            },
            rewards: {
              type: "access",
              value: "Exclusive artist content",
            },
          },
          {
            id: "loyal-fan",
            name: "Loyal Fan",
            description: "Stream an artist 50+ times in a month",
            icon: "❤️",
            level: "exclusive",
            type: "special",
            criteria: {
              type: "streams",
              threshold: 50,
              timeframe: "monthly",
            },
            rewards: {
              type: "access",
              value: "Artist meet & greet access",
            },
          },
        ];

        setBadges(mockBadges);
      } catch (error) {
        console.error("Error fetching badges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchBadges();
    }
  }, [address]);

  const getBadgeProgress = (badge: Badge): BadgeProgress => {
    // In production, this would fetch real data
    const mockProgress: Record<string, BadgeProgress> = {
      "bronze-collector": {
        currentValue: 3,
        nextThreshold: 5,
        percentage: 60,
      },
      "silver-collector": {
        currentValue: 3,
        nextThreshold: 6,
        percentage: 50,
      },
      "casual-listener": {
        currentValue: 150,
        nextThreshold: 200,
        percentage: 75,
        timeRemaining: 604800, // 7 days in seconds
      },
      "first-listener": {
        currentValue: 0,
        nextThreshold: 1,
        percentage: 0,
        timeRemaining: 86400, // 24 hours in seconds
      },
    };

    return mockProgress[badge.id] || {
      currentValue: 0,
      nextThreshold: badge.criteria.threshold,
      percentage: 0,
    };
  };

  return {
    badges,
    isLoading,
    getBadgeProgress,
  };
}
