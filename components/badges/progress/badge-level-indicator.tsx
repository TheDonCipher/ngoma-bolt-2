"use client";

import { BadgeLevel } from "@/lib/types/badges";

interface BadgeLevelIndicatorProps {
  level: BadgeLevel;
  className?: string;
}

const levelConfig = {
  bronze: {
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    label: "Bronze",
  },
  silver: {
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    label: "Silver",
  },
  gold: {
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    label: "Gold",
  },
  platinum: {
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    label: "Platinum",
  },
  exclusive: {
    color: "text-primary",
    bgColor: "bg-primary/10",
    label: "Exclusive",
  },
};

export function BadgeLevelIndicator({ level, className }: BadgeLevelIndicatorProps) {
  const config = levelConfig[level];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} ${className}`}
    >
      {config.label}
    </span>
  );
}
