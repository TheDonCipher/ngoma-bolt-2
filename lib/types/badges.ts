export type BadgeLevel = "bronze" | "silver" | "gold" | "platinum" | "exclusive";
export type BadgeType = "collector" | "listener" | "special";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: BadgeLevel;
  type: BadgeType;
  criteria: {
    type: "nft" | "streams" | "engagement" | "special";
    threshold: number;
    timeframe?: "daily" | "weekly" | "monthly" | "all-time";
  };
  rewards?: {
    type: "discount" | "access" | "boost";
    value: string;
  };
  unlockedAt?: Date;
}

export interface BadgeProgress {
  currentValue: number;
  nextThreshold: number;
  percentage: number;
  timeRemaining?: number;
}
