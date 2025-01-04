"use client";

import { useWebSocket } from "./websocket.service";
import { useToast } from "@/hooks/use-toast";
import { Notification, NotificationPreferences } from "@/lib/types/notifications";

export function useNotificationService() {
  const { emit } = useWebSocket();
  const { toast } = useToast();

  const sendNotification = async (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    try {
      // In production, this would be an API call
      emit("notification", {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        read: false,
      });
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  };

  const updatePreferences = async (preferences: Partial<NotificationPreferences>) => {
    try {
      // In production, this would be an API call
      toast({
        title: "Success",
        description: "Notification preferences updated",
      });
      return true;
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
      return false;
    }
  };

  const requestPushPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting push permission:", error);
      return false;
    }
  };

  return {
    sendNotification,
    updatePreferences,
    requestPushPermission,
  };
}
