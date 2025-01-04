"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function ApiError({ message, onRetry }: ApiErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[200px] text-center">
      <AlertTriangle className="w-8 h-8 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="text-muted-foreground mb-4">
        {message || "Failed to load data. Please try again."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}
