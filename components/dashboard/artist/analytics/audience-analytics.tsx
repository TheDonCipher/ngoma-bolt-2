"use client";

import { MapPin } from "lucide-react";

interface AudienceAnalyticsProps {
  dateRange: [Date, Date];
}

const mockData = {
  topLocations: [
    { country: "Nigeria", listeners: "8.2K", percentage: 45 },
    { country: "Ghana", listeners: "3.5K", percentage: 20 },
    { country: "South Africa", listeners: "2.8K", percentage: 15 },
    { country: "Kenya", listeners: "1.9K", percentage: 10 },
    { country: "UK", listeners: "1.2K", percentage: 5 },
  ],
};

export function AudienceAnalytics({ dateRange }: AudienceAnalyticsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Top Listener Locations</h3>
      <div className="space-y-4">
        {mockData.topLocations.map((location) => (
          <div key={location.country} className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{location.country}</span>
                <span>{location.listeners}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${location.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
