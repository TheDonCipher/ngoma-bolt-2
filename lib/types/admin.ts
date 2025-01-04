export interface AdminConfig {
  address: string;
  role: "ADMIN";
  permissions: AdminPermission[];
}

export type AdminPermission = 
  | "MANAGE_USERS"
  | "MANAGE_CONTENT"
  | "MANAGE_SETTINGS"
  | "VIEW_ANALYTICS"
  | "MODERATE_CONTENT";

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTracks: number;
  totalRevenue: string;
  platformHealth: number;
}

export interface ContentModerationItem {
  id: string;
  type: "TRACK" | "ALBUM" | "PROFILE";
  title: string;
  artist: string;
  status: "PENDING" | "APPROVED" | "FLAGGED" | "REMOVED";
  reportCount: number;
  createdAt: string;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  platformFee: number;
  minRoyaltyFee: number;
  maxRoyaltyFee: number;
  automaticModeration: boolean;
}
