"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PlaylistAnalyticsProps {
  dateRange: [Date, Date];
}

const mockData = [
  { playlist: "Afrobeats Mix", adds: 450 },
  { playlist: "African Heat", adds: 380 },
  { playlist: "New Music Friday", adds: 320 },
  { playlist: "Viral Hits", adds: 280 },
  { playlist: "Chill Vibes", adds: 220 },
];

export function PlaylistAnalytics({ dateRange }: PlaylistAnalyticsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Top Playlists</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="playlist" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="adds" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
