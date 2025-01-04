"use client";

import { ReactNode } from "react";
import { useAdmin } from "@/lib/hooks/use-admin";
import { LoadingState } from "@/components/shared/loading-state";
import { ApiError } from "@/components/shared/api-error";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return <LoadingState message="Checking permissions..." />;
  }

  if (!isAdmin) {
    return (
      <ApiError 
        message="You don't have permission to access this area." 
      />
    );
  }

  return <>{children}</>;
}
