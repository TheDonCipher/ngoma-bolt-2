"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SocialEngagementProps {
  dateRange: [Date, Date];
}

const mockData = {
  engagement: [
    { date: "Mon", shares: 120, likes: 450, comments: 65 },
    { date: "Tue", shares: 180, likes: 520, comments: 78 },
    { date: "Wed", shares: 140, likes: 480, comments: 70 },
    { date: "Thu", shares: 220, likes: 580, comments: 85 },
    { date: "Fri", shares: 190, likes: 540, comments: 80 },
    { date: "Sat", shares: 240, likes: 620, comments: 92 },
    { date: "Sun", shares: 210, likes: 590, comments: 88 },
  ],
};

export function SocialEngagement({ dateRange }: SocialEngagementProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Social Media Engagement</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData.engagement}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="likes"
              stroke="#6366f1"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="shares"
              stroke="#8b5cf6"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="comments"
              stroke="#d946ef"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#6366f1]" />
          <span className="text-sm">Likes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
          <span className="text-sm">Shares</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#d946ef]" />
          <span className="text-sm">Comments</span>
        </div>
      </div>
    </div>
  );
}
