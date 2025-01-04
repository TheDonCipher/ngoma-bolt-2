"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWalletButton } from "@/components/web3/connect-wallet-button";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAddress } from "@thirdweb-dev/react";

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/explore",
    label: "Explore",
  },
  {
    href: "/news",
    label: "News",
  },
];

const dashboardRoutes = [
  {
    href: "/dashboard/artist",
    label: "Artist Dashboard",
    role: "ARTIST",
  },
  {
    href: "/dashboard/fan",
    label: "Fan Dashboard",
    role: "FAN",
  },
  {
    href: "/dashboard/admin",
    label: "Admin Dashboard",
    role: "ADMIN",
  },
];

export function MainNav() {
  const pathname = usePathname();
  const address = useAddress();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Music className="w-6 h-6" />
          <span className="font-bold">Afrobeats NFT</span>
        </Link>

        <nav className="flex items-center gap-4 flex-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === route.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {address ? (
            <>
              {dashboardRoutes.map((route) => (
                <Button
                  key={route.href}
                  variant="ghost"
                  asChild
                >
                  <Link href={route.href}>{route.label}</Link>
                </Button>
              ))}
            </>
          ) : (
            <ConnectWalletButton />
          )}
        </div>
      </div>
    </header>
  );
}
