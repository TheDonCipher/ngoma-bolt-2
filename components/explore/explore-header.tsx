"use client";

import { ConnectWalletButton } from "@/components/web3/connect-wallet-button";
import { useAddress } from "@thirdweb-dev/react";

export function ExploreHeader() {
  const address = useAddress();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Explore Music</h1>
        <p className="text-muted-foreground">
          Discover unique African music NFTs and support your favorite artists
        </p>
      </div>

      {!address && (
        <ConnectWalletButton className="md:w-auto w-full" />
      )}
    </div>
  );
}
