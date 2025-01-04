"use client";

import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/web3/connect-wallet-button";
import { ArrowRight, Music2 } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hero-gradient" />
      <div className="container relative z-10 px-4 py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-8">
          <Music2 className="w-4 h-4 text-secondary" />
          <span className="text-sm">Web3 Music Revolution</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto">
          Discover and Collect Unique
          <span className="text-gradient"> African Music NFTs</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join the future of music ownership. Connect with artists directly, collect
          exclusive NFTs, and earn rewards for supporting your favorite creators.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <ConnectWalletButton />
          <Link href="/explore">
            <Button variant="outline" size="lg" className="group">
              Explore Music
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
