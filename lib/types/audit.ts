"use client";

export type AuditAction = 
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "MINT"
  | "TRANSFER"
  | "SETTINGS_CHANGE"
  | "MODERATE";

export type AuditSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AuditCategory = 
  | "USER"
  | "CONTENT"
  | "SYSTEM"
  | "SECURITY"
  | "BLOCKCHAIN";

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userAddress: string;
  ipAddress: string;
  action: AuditAction;
  category: AuditCategory;
  severity: AuditSeverity;
  details: {
    component?: string;
    before?: any;
    after?: any;
    metadata?: Record<string, any>;
  };
  status: "SUCCESS" | "FAILURE";
  errorMessage?: string;
}

export interface AuditSearchFilters {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  action?: AuditAction;
  category?: AuditCategory;
  severity?: AuditSeverity;
  status?: "SUCCESS" | "FAILURE";
}
