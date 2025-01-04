"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Notification } from "@/lib/types/notifications";
import { useNotifications } from "@/lib/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import {
  Music,
  Calendar,
  Award,
  DollarSign,
  Users,
  Bell,
} from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const { markAsRead } = useNotifications();

  const getIcon = () => {
    switch (notification.type) {
      case "TRACK_RELEASE":
      case "ALBUM_RELEASE":
        return <Music className="w-4 h-4" />;
      case "EVENT_REMINDER":
        return <Calendar className="w-4 h-4" />;
      case "BADGE_EARNED":
        return <Award className="w-4 h-4" />;
      case "PURCHASE_SUCCESS":
      case "ROYALTY_RECEIVED":
        return <DollarSign className="w-4 h-4" />;
      case "FOLLOWER_UPDATE":
        return <Users className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  return (
    <Card
      className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
        !notification.read ? "bg-primary/5" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex gap-4">
        <div className={`p-2 rounded-lg bg-primary/10 text-primary shrink-0`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium">{notification.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </p>
        </div>
      </div>
    </Card>
  );
}
