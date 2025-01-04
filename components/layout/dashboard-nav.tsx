"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Music,
  LayoutDashboard,
  Upload,
  Album,
  CalendarDays,
  Package,
  BarChart,
  Users,
  Settings,
  Medal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const artistRoutes = [
  {
    href: "/dashboard/artist",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/artist/tracks",
    label: "Tracks",
    icon: Music,
  },
  {
    href: "/dashboard/artist/upload",
    label: "Upload",
    icon: Upload,
  },
  {
    href: "/dashboard/artist/albums",
    label: "Albums",
    icon: Album,
  },
  {
    href: "/dashboard/artist/events",
    label: "Events",
    icon: CalendarDays,
  },
  {
    href: "/dashboard/artist/merchandise",
    label: "Merchandise",
    icon: Package,
  },
  {
    href: "/dashboard/artist/analytics",
    label: "Analytics",
    icon: BarChart,
  },
  {
    href: "/dashboard/artist/collaborations",
    label: "Collaborations",
    icon: Users,
  },
  {
    href: "/dashboard/artist/settings",
    label: "Settings",
    icon: Settings,
  },
];

const fanRoutes = [
  {
    href: "/dashboard/fan",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/fan/collection",
    label: "Collection",
    icon: Music,
  },
  {
    href: "/dashboard/fan/following",
    label: "Following",
    icon: Users,
  },
  {
    href: "/dashboard/fan/badges",
    label: "Badges",
    icon: Medal,
  },
  {
    href: "/dashboard/fan/achievements",
    label: "Achievements",
    icon: Album,
  },
  {
    href: "/dashboard/fan/settings",
    label: "Settings",
    icon: Settings,
  },
];

const adminRoutes = [
  {
    href: "/dashboard/admin",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/dashboard/admin/content",
    label: "Content",
    icon: Music,
  },
  {
    href: "/dashboard/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const routes = pathname.includes("/artist")
    ? artistRoutes
    : pathname.includes("/fan")
    ? fanRoutes
    : adminRoutes;

  return (
    <nav className="hidden lg:block w-64 border-r min-h-screen p-6 space-y-4">
      <div className="flex items-center gap-2 mb-8">
        <Music className="w-6 h-6" />
        <span className="font-bold">Dashboard</span>
      </div>

      {routes.map((route) => (
        <Button
          key={route.href}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2",
            pathname === route.href
              ? "bg-muted"
              : "hover:bg-muted"
          )}
          asChild
        >
          <Link href={route.href}>
            <route.icon className="w-4 h-4" />
            {route.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
