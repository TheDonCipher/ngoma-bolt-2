"use client";

import { useAddress, useBalance, useDisconnect, useConnectionStatus } from "@thirdweb-dev/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, LogOut, Wallet } from "lucide-react";
import { formatEther } from "ethers/lib/utils";

export function WalletDetails() {
  const address = useAddress();
  const { data: balance, isLoading: isLoadingBalance } = useBalance();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();

  if (connectionStatus === "unknown" || connectionStatus === "connecting") {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </Card>
    );
  }

  if (connectionStatus === "disconnected") {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Wallet Details</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnect}
          className="text-destructive hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Address:{" "}
          <span className="font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Balance:{" "}
          {isLoadingBalance ? (
            <Loader2 className="w-4 h-4 inline animate-spin" />
          ) : (
            <span className="font-medium">
              {formatEther(balance?.value || 0)} {balance?.symbol}
            </span>
          )}
        </p>
      </div>
    </Card>
  );
}
