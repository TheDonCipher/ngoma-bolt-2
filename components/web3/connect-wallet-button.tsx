"use client";

import { ConnectWallet } from "@thirdweb-dev/react";
import { cn } from "@/lib/utils";

interface ConnectWalletButtonProps {
  className?: string;
}

export function ConnectWalletButton({ className }: ConnectWalletButtonProps) {
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
        subtitle: "Connect your wallet or create a new one to get started",
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
