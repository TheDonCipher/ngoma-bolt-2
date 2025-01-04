"use client";

import { Badge } from "@/lib/types/badges";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBadges } from "@/lib/hooks/use-badges";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const levelColors = {
  bronze: "bg-orange-500/10 text-orange-500",
  silver: "bg-slate-500/10 text-slate-500",
  gold: "bg-yellow-500/10 text-yellow-500",
  platinum: "bg-purple-500/10 text-purple-500",
  exclusive: "bg-primary/10 text-primary",
};

export function BadgeGrid() {
  const { badges, isLoading, getBadgeProgress } = useBadges();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const formatTimeRemaining = (seconds?: number) => {
    if (!seconds) return null;
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const renderBadge = (badge: Badge) => {
    const progress = getBadgeProgress(badge);
    const isUnlocked = !!badge.unlockedAt;
    const timeRemaining = formatTimeRemaining(progress.timeRemaining);

    return (
      <Card
        key={badge.id}
        className={`p-6 transition-colors ${
          isUnlocked ? "bg-muted/50" : "hover:bg-muted/50"
        }`}
      >
        <div className="space-y-4">
          <div className={`p-3 w-fit rounded-lg ${levelColors[badge.level]}`}>
            <span className="text-2xl">{badge.icon}</span>
          </div>

          <div>
            <h3 className="font-semibold">{badge.name}</h3>
            <p className="text-sm text-muted-foreground">
              {badge.description}
            </p>
          </div>

          {badge.rewards && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Reward:</span> {badge.rewards.value}
            </div>
          )}

          {isUnlocked ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary">Unlocked</span>
              <span className="text-xs text-muted-foreground">
                {badge.unlockedAt?.toLocaleDateString()}
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <Progress value={progress.percentage} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {progress.currentValue} / {progress.nextThreshold}
                </span>
                {timeRemaining && <span>{timeRemaining}</span>}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const filterBadges = (type: Badge["type"]) => {
    return badges.filter(badge => badge.type === type);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Badges</h2>
        <p className="text-muted-foreground">
          Collect badges by engaging with the platform
        </p>
      </div>

      <Tabs defaultValue="collector">
        <TabsList>
          <TabsTrigger value="collector">Collector</TabsTrigger>
          <TabsTrigger value="listener">Listener</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
        </TabsList>

        <TabsContent value="collector" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterBadges("collector").map(renderBadge)}
          </div>
        </TabsContent>

        <TabsContent value="listener" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterBadges("listener").map(renderBadge)}
          </div>
        </TabsContent>

        <TabsContent value="special" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterBadges("special").map(renderBadge)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
