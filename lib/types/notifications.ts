"use client";

export type NotificationType = 
  | "TRACK_RELEASE"
  | "ALBUM_RELEASE"
  | "EVENT_REMINDER"
  | "BADGE_EARNED"
  | "PURCHASE_SUCCESS"
  | "ROYALTY_RECEIVED"
  | "FOLLOWER_UPDATE"
  | "SYSTEM_UPDATE";

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    frequency: "INSTANT" | "DAILY" | "WEEKLY";
    types: NotificationType[];
  };
  push: {
    enabled: boolean;
    types: NotificationType[];
  };
  inApp: {
    enabled: boolean;
    types: NotificationType[];
  };
}
