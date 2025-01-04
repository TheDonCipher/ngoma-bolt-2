"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RevenueBreakdownProps {
  dateRange: [Date, Date];
}

const mockData = [
  { name: "NFT Sales", value: 45 },
  { name: "Streaming", value: 25 },
  { name: "Merchandise", value: 20 },
  { name: "Tickets", value: 10 },
];

const COLORS = ["#6366f1", "#8b5cf6", "#d946ef", "#f43f5e"];

export function RevenueBreakdown({ dateRange }: RevenueBreakdownProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Revenue Streams</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {mockData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
