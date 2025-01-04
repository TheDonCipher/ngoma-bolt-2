"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, ArrowUpRight } from "lucide-react";

const mockRoyalties = [
  {
    id: "1",
    track: "African Giant",
    totalEarned: "1.5",
    lastPayout: "0.5",
    nextPayout: "1.0",
    lastPayoutDate: "2024-02-15",
  },
  {
    id: "2",
    track: "On The Low",
    totalEarned: "0.8",
    lastPayout: "0.3",
    nextPayout: "0.5",
    lastPayoutDate: "2024-02-10",
  },
];

export function RoyaltyManagement() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true);
      // Implementation for withdrawing royalties will go here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Available Royalties</h3>
              <p className="text-3xl font-bold">1.5 ETH</p>
            </div>
          </div>
          <Button
            onClick={handleWithdraw}
            disabled={isWithdrawing}
          >
            Withdraw All
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Track</TableHead>
                <TableHead>Total Earned</TableHead>
                <TableHead>Last Payout</TableHead>
                <TableHead>Next Payout</TableHead>
                <TableHead>Last Payout Date</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRoyalties.map((royalty) => (
                <TableRow key={royalty.id}>
                  <TableCell className="font-medium">
                    {royalty.track}
                  </TableCell>
                  <TableCell>{royalty.totalEarned} ETH</TableCell>
                  <TableCell>{royalty.lastPayout} ETH</TableCell>
                  <TableCell>{royalty.nextPayout} ETH</TableCell>
                  <TableCell>{royalty.lastPayoutDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      Details
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
