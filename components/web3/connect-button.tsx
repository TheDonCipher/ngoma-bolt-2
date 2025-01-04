"use client";

import { ConnectWallet } from "@thirdweb-dev/react";
import { useWeb3Auth } from "@/lib/hooks/use-web3-auth";
import { cn } from "@/lib/utils";

interface ConnectButtonProps {
  className?: string;
}

export function ConnectButton({ className }: ConnectButtonProps) {
  useWeb3Auth(); // Hook into auth state management

  return (
    <ConnectWallet
      theme="dark"
      btnTitle="Connect Wallet"
      modalTitle="Connect Your Wallet"
      auth={{
        loginOptional: false,
        onLogin(token) {
          console.log("Logged in with token:", token);
        },
        onLogout() {
          console.log("Logged out");
        },
      }}
      modalSize="wide"
      welcomeScreen={{
        title: "Welcome to Afrobeats NFT",
        subtitle: "Connect your wallet to get started",
      }}
      modalTitleIconUrl="/logo.png"
      className={cn(
        "!bg-primary !text-primary-foreground hover:!bg-primary/90",
        "!px-8 !py-6 !rounded-lg !font-semibold !transition-colors",
        className
      )}
    />
  );
}
