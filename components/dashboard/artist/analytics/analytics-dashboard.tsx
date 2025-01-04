"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "./date-range-picker";
import { PerformanceMetrics } from "./performance-metrics";
import { RevenueBreakdown } from "./revenue-breakdown";
import { AudienceAnalytics } from "./audience-analytics";
import { PlaylistAnalytics } from "./playlist-analytics";
import { SocialEngagement } from "./social-engagement";
import { Download } from "lucide-react";

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date(),
  ]);

  const handleExport = () => {
    // Implementation for exporting analytics data
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your music performance and audience engagement
          </p>
        </div>

        <div className="flex items-center gap-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <PerformanceMetrics dateRange={dateRange} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <RevenueBreakdown dateRange={dateRange} />
        </Card>
        <Card className="p-6">
          <AudienceAnalytics dateRange={dateRange} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <PlaylistAnalytics dateRange={dateRange} />
        </Card>
        <Card className="p-6">
          <SocialEngagement dateRange={dateRange} />
        </Card>
      </div>
    </div>
  );
}
