"use client";

import { useAddress } from "@thirdweb-dev/react";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/layout/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const address = useAddress();

  if (!address) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
