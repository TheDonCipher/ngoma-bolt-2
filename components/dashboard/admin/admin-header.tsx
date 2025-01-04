"use client";

import { Button } from "@/components/ui/button";
import { Settings, Bell } from "lucide-react";

export function AdminHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, content, and platform settings
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <Bell className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
