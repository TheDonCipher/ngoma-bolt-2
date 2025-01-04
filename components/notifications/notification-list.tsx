"use client";

import { useState } from "react";
import { useNotifications } from "@/lib/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./notification-item";
import { LoadingState } from "@/components/shared/loading-state";

export function NotificationList() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { notifications, isLoading, markAllAsRead } = useNotifications();

  const filteredNotifications = filter === "all"
    ? notifications
    : notifications.filter(n => !n.read);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "unread")}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No notifications to show
            </p>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
