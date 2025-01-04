"use client";

import { useState, useEffect } from "react";
import { useWebSocket } from "@/lib/services/websocket.service";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/lib/types/notifications";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { subscribe } = useWebSocket();
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In production, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock notifications
        const mockNotifications: Notification[] = [
          {
            id: "1",
            type: "TRACK_RELEASE",
            title: "New Track Released",
            message: "Burna Boy just released a new track: 'African Giant'",
            priority: "HIGH",
            timestamp: new Date(),
            read: false,
            actionUrl: "/tracks/1",
          },
          {
            id: "2",
            type: "BADGE_EARNED",
            title: "New Badge Unlocked",
            message: "Congratulations! You've earned the 'Early Adopter' badge",
            priority: "MEDIUM",
            timestamp: new Date(Date.now() - 3600000),
            read: true,
            actionUrl: "/dashboard/badges",
          },
        ];

        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to real-time notifications
    const unsubscribe = subscribe<Notification>("notification", (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast for high priority notifications
      if (notification.priority === "HIGH") {
        toast({
          title: notification.title,
          description: notification.message,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [subscribe, toast]);

  const markAsRead = async (id: string) => {
    try {
      // In production, this would be an API call
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // In production, this would be an API call
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
}
