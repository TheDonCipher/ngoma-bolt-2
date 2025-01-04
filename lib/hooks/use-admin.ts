"use client";

import { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { AdminConfig, SystemSettings } from "@/lib/types/admin";

const ADMIN_ADDRESSES = [
  "0x123...789", // Replace with your admin address
];

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    platformFee: 2.5,
    minRoyaltyFee: 1,
    maxRoyaltyFee: 10,
    automaticModeration: true,
  });

  const address = useAddress();

  useEffect(() => {
    if (!address) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        // In production, this would be an API call
        setIsAdmin(ADMIN_ADDRESSES.includes(address));
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [address]);

  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      // In production, this would be an API call
      setSettings({ ...settings, ...newSettings });
      return true;
    } catch (error) {
      console.error("Error updating settings:", error);
      return false;
    }
  };

  return {
    isAdmin,
    isLoading,
    settings,
    updateSettings,
  };
}
